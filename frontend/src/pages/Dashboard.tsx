import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Upload,
  Plus,
  Search,
  Clock,
  MoreHorizontal,
  X,
  AlertCircle,
  Trash2,
} from 'lucide-react';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
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

  /* ── Upload State ── */
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  /* ── Delete State ── */
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState<Document | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch documents on load
  const fetchDocuments = async () => {
    try {
      setErrorMsg(null);
      setIsLoadingDocs(true);
      const data = await documentService.getDocuments();
      setDocuments(data);
    } catch (error) {
      console.error('Failed to fetch documents', error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401 || error.response?.status === 403) {
          logout();
          navigate('/login');
          return;
        }
        setErrorMsg(error.response?.data?.detail || 'Failed to load your documents. Please try again later.');
      } else {
        setErrorMsg('An unexpected error occurred while fetching your documents.');
      }
    } finally {
      setIsLoadingDocs(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [navigate]);

  /* ── Handles File Selection ── */
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setUploadError('Please select a valid PDF file.');
      return;
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      setUploadError('File is too large. Maximum size is 50MB.');
      return;
    }

    setSelectedFile(file);
  };

  /* ── Handles File Upload Submission ── */
  const handleUploadSubmit = async () => {
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      setUploadError(null);
      await documentService.uploadDocument(selectedFile);

      // Cleanup and refresh list
      setSelectedFile(null);
      setUploadModalOpen(false);
      await fetchDocuments();

    } catch (error) {
      console.error('Upload failed', error);
      if (axios.isAxiosError(error)) {
         setUploadError(error.response?.data?.detail || 'Failed to upload document. Please try again.');
      } else {
         setUploadError('An unexpected error occurred during upload.');
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleModalClose = () => {
    if (isUploading) return;
    setUploadModalOpen(false);
    setSelectedFile(null);
    setUploadError(null);
  };

  /* ── Handles Delete Click ── */
  const handleDeleteClick = (e: React.MouseEvent, doc: Document) => {
    e.stopPropagation();
    setDocToDelete(doc);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!docToDelete) return;

    try {
      setIsDeleting(true);
      await documentService.deleteDocument(docToDelete.id);
      setDeleteModalOpen(false);
      setDocToDelete(null);
      await fetchDocuments();
    } catch (error) {
      console.error('Delete failed', error);
      setErrorMsg('Failed to delete document. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

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
                  <button
                    onClick={(e) => handleDeleteClick(e, doc)}
                    className="p-1 rounded-md text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-500/10 transition-all duration-200 cursor-pointer"
                    title="Delete document"
                  >
                    <Trash2 className="w-4 h-4" />
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
      <Modal open={uploadModalOpen} onClose={handleModalClose}>
        <ModalHeader>
          <ModalTitle>Upload Document</ModalTitle>
          <ModalDescription>
            Upload a PDF document to start studying with AI assistance.
          </ModalDescription>
        </ModalHeader>

        <div className="space-y-4">
          {/* Error Message */}
          {uploadError && (
             <div className="flex items-start gap-2 p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg">
               <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
               <p>{uploadError}</p>
             </div>
          )}

          {/* Hidden File Input */}
          <input
            type="file"
            accept=".pdf,application/pdf"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileSelect}
            disabled={isUploading}
          />

          {!selectedFile ? (
            /* Drop zone */
            <div
               onClick={() => !isUploading && fileInputRef.current?.click()}
               className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/40 hover:bg-primary-light/50 transition-colors duration-200 cursor-pointer"
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-surface-elevated mx-auto mb-3">
                <Upload className="w-5 h-5 text-muted-foreground" />
              </div>
              <p className="text-sm font-medium text-foreground mb-1">
                Click to browse for a PDF
              </p>
              <p className="text-xs text-muted-foreground">
                Maximum file size: 50MB
              </p>
            </div>
          ) : (
            /* Selected File State */
            <div className="flex items-center justify-between p-4 border border-border rounded-xl bg-surface-elevated">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary-light shrink-0">
                  <FileText className="w-5 h-5 text-accent-foreground" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate" title={selectedFile.name}>
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <button
                onClick={() => !isUploading && setSelectedFile(null)}
                disabled={isUploading}
                className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Remove file"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        <ModalFooter>
          <Button variant="secondary" onClick={handleModalClose} disabled={isUploading}>
            Cancel
          </Button>
          <Button
             onClick={handleUploadSubmit}
             disabled={!selectedFile || isUploading}
             isLoading={isUploading}
          >
            {isUploading ? 'Uploading...' : 'Upload PDF'}
          </Button>
        </ModalFooter>
      </Modal>

      {/* ── Delete Confirmation Modal ── */}
      <Modal open={deleteModalOpen} onClose={() => !isDeleting && setDeleteModalOpen(false)}>
        <ModalHeader>
          <ModalTitle>Delete Document</ModalTitle>
          <ModalDescription>
            Are you sure you want to delete <span className="font-semibold text-foreground">"{docToDelete?.filename}"</span>?
          </ModalDescription>
        </ModalHeader>

        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl mb-2">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
            <p className="text-sm text-red-500">
              This action cannot be undone. All AI interactions and notes associated with this document will also be permanently deleted.
            </p>
          </div>
        </div>

        <ModalFooter>
          <Button variant="secondary" onClick={() => setDeleteModalOpen(false)} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
             variant="danger"
             onClick={confirmDelete}
             disabled={isDeleting}
             isLoading={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete Document'}
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default Dashboard;
