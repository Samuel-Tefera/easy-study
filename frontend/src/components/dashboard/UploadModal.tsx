import React, { useState, useRef } from 'react';
import { Upload, FileText, X, AlertCircle } from 'lucide-react';
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalFooter, Button } from '../ui';
import { documentService } from '../../services/document.service';
import axios from 'axios';

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ open, onClose, onSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleUploadSubmit = async () => {
    if (!selectedFile) return;

    try {
      setIsUploading(true);
      setUploadError(null);
      await documentService.uploadDocument(selectedFile);

      setSelectedFile(null);
      onSuccess();
      onClose();
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
    setUploadError(null);
    setSelectedFile(null);
    onClose();
  };

  return (
    <Modal open={open} onClose={handleModalClose}>
      <ModalHeader>
        <ModalTitle>Upload Document</ModalTitle>
        <ModalDescription>
          Upload a PDF document to start studying with AI assistance.
        </ModalDescription>
      </ModalHeader>

      <div className="space-y-4">
        {uploadError && (
           <div className="flex items-start gap-2 p-3 text-sm text-red-500 bg-red-500/10 border border-red-500/20 rounded-lg">
             <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
             <p>{uploadError}</p>
           </div>
        )}

        <input
          type="file"
          accept=".pdf,application/pdf"
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileSelect}
          disabled={isUploading}
        />

        {!selectedFile ? (
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
  );
};
