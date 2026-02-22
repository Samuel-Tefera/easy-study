import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Upload,
  Plus,
  Search,
  Clock,
  MoreHorizontal,
} from 'lucide-react';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Badge,
  Input,
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter,
  SkeletonCard,
} from '../components/ui';
import { documentService, type Document } from '../services/document.service';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        setErrorMsg(null);
        setIsLoadingDocs(true);
        const data = await documentService.getDocuments();
        setDocuments(data);
      } catch (error) {
        console.error('Failed to fetch documents', error);
        if (axios.isAxiosError(error)) {
          // Handle authentication errors
          if (error.response?.status === 401 || error.response?.status === 403) {
            logout(); // Delete from local storage and update context
            navigate('/login');   // Redirect to login
            return;
          }
          // Handle other server errors
          setErrorMsg(error.response?.data?.detail || 'Failed to load your documents. Please try again later.');
        } else {
          // Handle network or unexpected errors
          setErrorMsg('An unexpected error occurred while fetching your documents.');
        }
      } finally {
        setIsLoadingDocs(false);
      }
    };

    fetchDocuments();
  }, [navigate]);

  const filteredDocs = documents.filter((doc) =>
    doc.filename.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto animate-fade-in">
      {/* ── Header ── */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">
          Your Documents
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Upload and study your documents with AI assistance.
        </p>
      </div>

      {/* ── Actions Bar ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div className="w-full sm:w-72">
          <Input
            placeholder="Search documents…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>
        <Button
          onClick={() => setUploadModalOpen(true)}
          icon={<Plus className="w-4 h-4" />}
        >
          Upload Document
        </Button>
      </div>

      {/* ── Documents Grid ── */}
      {errorMsg ? (
        <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-red-500/10 mb-4 border border-red-500/20">
            <FileText className="w-6 h-6 text-red-500" />
          </div>
          <h3 className="text-base font-medium text-foreground mb-1">
            Unable to Load Documents
          </h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-xs">
            {errorMsg}
          </p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
        </div>
      ) : isLoadingDocs ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : filteredDocs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map((doc, index) => (
            <Card
              key={doc.id}
              hover
              onClick={() => navigate(`/study/${doc.id}`)}
              className="group"
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary-light shrink-0">
                    <FileText className="w-4.5 h-4.5 text-accent-foreground" />
                  </div>
                  <button className="p-1 rounded-md text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-surface-elevated transition-all duration-200 cursor-pointer">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
                <CardTitle className="mt-3 line-clamp-2" title={doc.filename}>{doc.filename}</CardTitle>
                <CardDescription>
                  {doc.page_count} pages
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mt-2">
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {new Date(doc.created_at).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* ── Empty State ── */
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-surface-elevated mb-4">
            <FileText className="w-6 h-6 text-muted-foreground" />
          </div>
          <h3 className="text-base font-medium text-foreground mb-1">
            {searchQuery ? 'No results found' : 'No documents yet'}
          </h3>
          <p className="text-sm text-muted-foreground mb-4 max-w-xs">
            {searchQuery
              ? 'Try adjusting your search query.'
              : 'Upload your first PDF to start studying with AI.'}
          </p>
          {!searchQuery && (
            <Button
              onClick={() => setUploadModalOpen(true)}
              icon={<Upload className="w-4 h-4" />}
            >
              Upload PDF
            </Button>
          )}
        </div>
      )}

      {/* ── Upload Modal ── */}
      <Modal open={uploadModalOpen} onClose={() => setUploadModalOpen(false)}>
        <ModalHeader>
          <ModalTitle>Upload Document</ModalTitle>
          <ModalDescription>
            Upload a PDF document to start studying with AI assistance.
          </ModalDescription>
        </ModalHeader>

        {/* Drop zone */}
        <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/40 hover:bg-primary-light/50 transition-colors duration-200 cursor-pointer">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-surface-elevated mx-auto mb-3">
            <Upload className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground mb-1">
            Drop your PDF here
          </p>
          <p className="text-xs text-muted-foreground">
            or click to browse • PDF up to 50MB
          </p>
        </div>

        <ModalFooter>
          <Button variant="secondary" onClick={() => setUploadModalOpen(false)}>
            Cancel
          </Button>
          <Button disabled>Upload</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Dashboard;
