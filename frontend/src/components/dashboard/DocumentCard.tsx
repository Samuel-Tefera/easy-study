import React from 'react';
import { FileText, Trash2, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui';
import { type Document } from '../../services/document.service';
import { useNavigate } from 'react-router-dom';

interface DocumentCardProps {
  doc: Document;
  index: number;
  onDeleteClick: (e: React.MouseEvent, doc: Document) => void;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({ doc, index, onDeleteClick }) => {
  const navigate = useNavigate();

  return (
    <Card
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
            onClick={(e) => {
              e.stopPropagation();
              onDeleteClick(e, doc);
            }}
            className="p-1 rounded-md text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-500/10 transition-all duration-200 cursor-pointer"
            title="Delete document"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        <CardTitle className="mt-3 line-clamp-2" title={doc.filename}>{doc.filename}</CardTitle>
        <CardDescription>
          {doc.pages} pages
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
  );
};
