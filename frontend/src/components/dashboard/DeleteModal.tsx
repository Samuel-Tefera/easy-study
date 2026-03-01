import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Modal, ModalHeader, ModalTitle, ModalDescription, ModalFooter, Button } from '../ui';
import { documentService, type Document } from '../../services/document.service';

interface DeleteModalProps {
  open: boolean;
  onClose: () => void;
  docToDelete: Document | null;
  onSuccess: () => void;
  onError: (msg: string) => void;
}

export const DeleteModal: React.FC<DeleteModalProps> = ({
  open,
  onClose,
  docToDelete,
  onSuccess,
  onError,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!docToDelete) return;

    try {
      setIsDeleting(true);
      await documentService.deleteDocument(docToDelete.id);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Delete failed', error);
      onError('Failed to delete document. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal open={open} onClose={() => !isDeleting && onClose()}>
      <ModalHeader>
        <ModalTitle>Delete Document</ModalTitle>
        <ModalDescription>
          Are you sure you want to delete <span className="font-semibold text-foreground break-words">"{docToDelete?.filename}"</span>?
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
        <Button variant="secondary" onClick={onClose} disabled={isDeleting}>
          Cancel
        </Button>
        <Button
           variant="destructive"
           onClick={confirmDelete}
           disabled={isDeleting}
           isLoading={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete Document'}
        </Button>
      </ModalFooter>
    </Modal>
  );
};
