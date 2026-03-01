import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import {
  ArrowLeft,
  Sparkles,
  BookOpen,
  User,
  Bot,
} from 'lucide-react';
import { Badge } from '../components/ui';
import { cn } from '../lib/utils';
import { documentService } from '../services/document.service';
import { aiService } from '../services/ai.service';

/* ── Extracted Components ── */
import { LoadingView } from '../components/study-room/LoadingView';
import { FloatingMenu } from '../components/study-room/FloatingMenu';
import { aiActions, type ActionKey } from '../components/study-room/constants';
import { ResponseRenderer } from '../components/study-room/ResponseRenderer';
import { TypingEffect } from '../components/study-room/TypingEffect';

/* ── Configure PDF.js worker ── */
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  actionLabel?: string;
  timestamp: Date;
  isNew?: boolean;
};

/* ══════════════════════════════════════════════════════
   StudyRoom — Main Page Component
   ══════════════════════════════════════════════════════ */
const StudyRoom: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  /* ── PDF state ── */
  const [numPages, setNumPages] = useState<number>(0);
  const [pdfWidth, setPdfWidth] = useState<number>(800);
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const aiPanelRef = useRef<HTMLDivElement>(null);

  /* ── PDF loading state ── */
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoadingPdf, setIsLoadingPdf] = useState(true);
  const [pdfError, setPdfError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDocumentUrl() {
      if (!id) return;
      try {
        setIsLoadingPdf(true);
        setPdfError(null);
        const { url } = await documentService.getDocumentViewUrl(id);
        setPdfUrl(url);
      } catch (err) {
        console.error('Failed to load document URL:', err);
        setPdfError('Could not securely connect to the document server.');
      } finally {
        setIsLoadingPdf(false);
      }
    }
    loadDocumentUrl();
  }, [id]);

  /* ── Debounced ResizeObserver for PDF width ── */
  useEffect(() => {
    if (!pdfContainerRef.current) return;
    let debounceTimer: ReturnType<typeof setTimeout>;
    const observer = new ResizeObserver((entries) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        for (const entry of entries) {
          setPdfWidth(Math.min(entry.contentRect.width - 80, 1000));
        }
      }, 200);
    });
    observer.observe(pdfContainerRef.current);
    return () => {
      clearTimeout(debounceTimer);
      observer.disconnect();
    };
  }, []);

  /* ── Chat state ── */
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  /* ── Load interaction history ── */
  useEffect(() => {
    async function loadHistory() {
      if (!id) return;
      try {
        const history = await aiService.getHistory(id);
        const restored: Message[] = [];
        for (const item of history) {
          const frontendKey = aiService.toFrontendAction(item.action);
          const actionData = aiActions.find((a) => a.key === frontendKey);

          restored.push({
            id: item.id + '-q',
            role: 'user',
            content: item.input_text,
            actionLabel: actionData?.label,
            timestamp: new Date(item.created_at),
          });
          restored.push({
            id: item.id,
            role: 'assistant',
            content: item.response_text,
            timestamp: new Date(item.created_at),
          });
        }
        setMessages(restored);
      } catch (err) {
        console.error('Failed to load AI history:', err);
      }
    }
    loadHistory();
  }, [id]);

  /* ── Floating menu state ── */
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const [pendingText, setPendingText] = useState<string | null>(null);

  /* ── Panel width state (RAF‑throttled drag) ── */
  const [leftPanelWidth, setLeftPanelWidth] = useState<number>(60);
  const isDraggingPanel = useRef(false);
  const rafId = useRef<number>(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingPanel.current) return;

      // Throttle to one update per animation frame
      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        const newWidth = (e.clientX / window.innerWidth) * 100;
        if (newWidth > 30 && newWidth < 80) {
          setLeftPanelWidth(newWidth);
        }
      });
    };

    const handleMouseUpDrag = () => {
      if (isDraggingPanel.current) {
        cancelAnimationFrame(rafId.current);
        isDraggingPanel.current = false;
        document.body.style.cursor = 'default';
        document.body.style.userSelect = '';
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUpDrag);

    return () => {
      cancelAnimationFrame(rafId.current);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUpDrag);
    };
  }, []);

  /* ── PDF loaded ── */
  function onDocumentLoadSuccess({ numPages: n }: { numPages: number }) {
    setNumPages(n);
  }

  /* ── Text selection handler ── */
  const handleMouseUp = useCallback(() => {
    const selection = window.getSelection();
    const text = selection?.toString().trim();

    if (text && text.length > 0) {
      const range = selection!.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      const menuX = Math.max(8, rect.left + rect.width / 2 - 200);
      const menuY = rect.bottom + 8;

      setPendingText(text);
      setMenuPosition({ x: menuX, y: menuY });
    }
  }, []);

  /* ── Click-outside to dismiss menu ── */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (target.closest('[class*="animate-in"]')) return;
      setMenuPosition(null);
      setPendingText(null);
    }

    if (menuPosition) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [menuPosition]);

  /* ── Handle action click ── */
  async function handleAction(action: ActionKey) {
    if (!pendingText || !id) return;

    const actionData = aiActions.find((a) => a.key === action);
    const userMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      role: 'user',
      content: pendingText,
      actionLabel: actionData?.label,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setMenuPosition(null);
    setPendingText(null);
    setIsTyping(true);

    // clear selection
    window.getSelection()?.removeAllRanges();

    try {
      const response = await aiService.highlightText(id, userMessage.content, action);
        const assistantMessage: Message = {
          id: response.id,
          role: 'assistant',
          content: response.response_text,
          timestamp: new Date(response.created_at),
          isNew: true,
        };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error('AI highlight request failed:', err);
      const errorMessage: Message = {
        id: Math.random().toString(36).substr(2, 9),
        role: 'assistant',
        content: 'Something went wrong. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }

  /* ── Auto-scroll to bottom of chat ── */
  useEffect(() => {
    if (aiPanelRef.current) {
      aiPanelRef.current.scrollTo({
        top: aiPanelRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isTyping]);

  return (
    <div className="flex h-screen bg-background overflow-hidden selection:bg-primary/20">
      {/* ── Left Panel: PDF Viewer ── */}
      <div className="flex flex-col relative will-change-[width]" style={{ width: `${leftPanelWidth}%` }}>
        {/* Enhanced Header */}
        <div className="flex items-center gap-4 h-14 px-6 bg-surface/40 backdrop-blur-md shrink-0">
          <button
            onClick={() => navigate('/dashboard')}
            className="group p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-surface-elevated transition-all duration-200 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <div className="flex-1 min-w-0">
            <h2 className="text-sm font-bold text-foreground truncate flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary/70" />
              Document {id}
            </h2>
          </div>
          {numPages > 0 && (
            <Badge variant="outline" className="text-[10px] font-bold tracking-tight opacity-70">
              {numPages} PAGES
            </Badge>
          )}
        </div>

        {/* PDF content */}
        <div
          ref={pdfContainerRef}
          onMouseUp={handleMouseUp}
          className="flex-1 overflow-y-auto bg-surface-elevated/20 scrollbar-thin"
        >
          <div className="py-10 px-6 flex justify-center">
            {isLoadingPdf ? (
              <LoadingView text="Preparing your study space…" />
            ) : pdfError || !pdfUrl ? (
              <div className="flex items-center justify-center h-[80vh] w-full">
                <div className="bg-surface p-8 rounded-3xl border border-border shadow-xl text-center max-w-xs animate-in fade-in slide-in-from-bottom-4">
                  <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="w-6 h-6 text-red-500" />
                  </div>
                  <p className="font-bold text-foreground mb-2">Access Denied</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {pdfError || 'Failed to load document link.'}
                  </p>
                </div>
              </div>
            ) : (
              <Document
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={<LoadingView text="Almost there, loading your document…" />}
                error={
                  <div className="flex items-center justify-center h-[80vh] w-full">
                    <div className="bg-surface p-8 rounded-3xl border border-border shadow-xl text-center max-w-xs animate-in fade-in slide-in-from-bottom-4">
                      <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="w-6 h-6 text-red-500" />
                      </div>
                      <p className="font-bold text-foreground mb-2">Failed to Render PDF</p>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        The document may be corrupted or your connection was interrupted.
                      </p>
                    </div>
                  </div>
                }
              >
                {Array.from({ length: numPages }, (_, index) => (
                <div key={`page_${index + 1}`} className="mb-10 last:mb-0 shadow-2xl rounded-sm overflow-hidden" style={{ contain: 'content' }}>
                  <Page
                    pageNumber={index + 1}
                    width={pdfWidth}
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                  />
                </div>
              ))}
              </Document>
            )}
          </div>
        </div>
      </div>

      {/* ── Drag Handle ── */}
      <div
        className="relative w-1.5 bg-border/40 hover:bg-primary/50 cursor-col-resize shrink-0 transition-colors z-20 flex items-center justify-center -ml-px group"
        onMouseDown={(e) => {
          e.preventDefault();
          isDraggingPanel.current = true;
          document.body.style.cursor = 'col-resize';
          document.body.style.userSelect = 'none';
        }}
      >
        <div className="h-10 w-1 bg-border/80 rounded-full group-hover:bg-primary/80 transition-colors" />
      </div>

      {/* ── Right Panel: AI Chat ── */}
      <div className="flex flex-col flex-1 bg-surface min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between h-14 px-6 border-b border-border/50 shrink-0 bg-surface/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm font-bold text-foreground tracking-tight uppercase tracking-widest">
              AI Tutor
            </span>
          </div>
          <Badge variant="primary" className="text-[9px] px-2 py-0">LIVE</Badge>
        </div>

        {/* Chat Area */}
        <div
          ref={aiPanelRef}
          className="flex-1 overflow-y-auto px-6 py-6 space-y-8 scrollbar-hide"
        >
          {messages.length === 0 ? (
            /* ── Empty State ── */
            <div className="flex flex-col items-center justify-center h-full text-center max-w-[260px] mx-auto animate-in fade-in duration-700">
              <div className="w-16 h-16 rounded-3xl bg-surface-elevated border border-border flex items-center justify-center mb-6 shadow-inner">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <p className="text-[15px] font-medium text-foreground leading-relaxed mb-2">
                Highlight any text in the document
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your AI tutor will help you explain, define, or understand it better.
              </p>
            </div>
          ) : (
            <div className="space-y-10">
              {messages.map((msg, idx) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500",
                    msg.role === 'user' ? "items-end" : "items-start"
                  )}
                >
                  {/* Avatar / Role Label */}
                  <div className={cn(
                    "flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider",
                    msg.role === 'user' ? "flex-row-reverse text-primary" : "text-muted-foreground"
                  )}>
                    {msg.role === 'user' ? <User className="w-3 h-3" /> : <Bot className="w-3 h-3 text-primary" />}
                    {msg.role === 'user' ? 'You' : 'AI Tutor'}
                  </div>

                  {/* Message Bubble */}
                  <div className={cn(
                    "max-w-[90%] px-5 py-4 rounded-3xl shadow-sm",
                    msg.role === 'user'
                      ? "bg-primary text-white rounded-tr-none"
                      : "bg-surface-elevated border border-border rounded-tl-none"
                  )}>
                    {msg.role === 'user' ? (
                      <div>
                         <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                           {msg.actionLabel && aiActions.find(a => a.label === msg.actionLabel)?.icon && React.createElement(aiActions.find(a => a.label === msg.actionLabel)!.icon, { className: "w-3 h-3" })}
                           {msg.actionLabel}
                         </p>
                         <p className="text-[15px] leading-relaxed italic opacity-90">"{msg.content}"</p>
                      </div>
                    ) : (
                      msg.isNew && idx === messages.length - 1 ? (
                        <TypingEffect text={msg.content} onComplete={() => {
                          setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, isNew: false } : m));
                        }} />
                      ) : (
                        <ResponseRenderer content={msg.content} />
                      )
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex flex-col gap-3 animate-fade-in">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    <Bot className="w-3 h-3 text-primary" />
                    AI Tutor is thinking...
                  </div>
                  <div className="bg-surface-elevated border border-border rounded-3xl rounded-tl-none px-6 py-4 w-20 flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce" />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* AI Disclaimer (Sticky at bottom) */}
        <div className="px-6 py-4 border-t border-border/10 bg-surface/80 backdrop-blur-md shrink-0">
          <p className="text-[10px] text-muted-foreground/60 text-center leading-relaxed italic">
            AI may make mistakes. Please verify important information.
          </p>
        </div>
      </div>

      {/* ── Floating Action Menu ── */}
      {menuPosition && pendingText && (
        <FloatingMenu
          x={menuPosition.x}
          y={menuPosition.y}
          onAction={handleAction}
        />
      )}
    </div>
  );
};

export default StudyRoom;
