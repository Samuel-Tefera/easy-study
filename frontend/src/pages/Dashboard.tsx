import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Upload,
  Plus,
  Search,
} from 'lucide-react';
import {
  Button,
  Input,
  SkeletonCard,
} from '../components/ui';
import { documentService, type Document } from '../services/document.service';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

import { UploadModal } from '../components/dashboard/UploadModal';
import { DeleteModal } from '../components/dashboard/DeleteModal';
import { DocumentCard } from '../components/dashboard/DocumentCard';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoadingDocs, setIsLoadingDocs] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  /* ── Delete State ── */
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState<Document | null>(null);

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

  /* ── Handles Delete Click ── */
  const handleDeleteClick = (e: React.MouseEvent, doc: Document) => {
    e.stopPropagation();
    setDocToDelete(doc);
    setDeleteModalOpen(true);
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
            <DocumentCard
              key={doc.id}
              doc={doc}
              index={index}
              onDeleteClick={handleDeleteClick}
            />
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

      {/* ── Modals ── */}
      <UploadModal
        open={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onSuccess={fetchDocuments}
      />

      <DeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        docToDelete={docToDelete}
        onSuccess={() => {
          setDocToDelete(null);
          fetchDocuments();
        }}
        onError={setErrorMsg}
      />
    </div>
  );
};

export default Dashboard;
