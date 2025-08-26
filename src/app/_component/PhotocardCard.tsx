import React from 'react';
import { FiEdit3, FiTrash2 } from 'react-icons/fi';
import Card from './Card';
import Button from './Button';
import { formatDate } from '../gallery/utils';
import '../style/ui/photocard-card.scss';

interface Photocard {
  _id: string;
  writer: {
    _id: string;
    name: string;
    email: string;
  };
  images: {
    [key: string]: string;
  };
  title: string;
  description: string;
  createdAt: string;
}

interface PhotocardCardProps {
  card: Photocard;
  className?: string;
  showActions?: boolean;
  onEdit?: (card: Photocard) => void;
  onDelete?: (cardId: string) => void;
  isDeleting?: boolean;
  variant?: 'gallery' | 'mypage';
}

export default function PhotocardCard({
  card,
  className = '',
  showActions = false,
  onEdit,
  onDelete,
  isDeleting = false,
  variant = 'gallery',
}: PhotocardCardProps) {
  return (
    <Card className={`photocard-card ${className}`}>
      <div className="photocard-image">
        <img src={card.images.main} alt={card.title} />
        {isDeleting && (
          <div className="photocard-overlay">
            <div className="photocard-loading">
              <div className="loading-spinner" />
              <span>삭제 중...</span>
            </div>
          </div>
        )}
      </div>
      <div className="photocard-content">
        <h3 className="photocard-title">{card.title}</h3>
        <p className="photocard-description">{card.description}</p>
        <div className="photocard-meta">
          <span className="photocard-date">{formatDate(card.createdAt)}</span>
        </div>
      </div>

      {showActions && (
        <div className="photocard-actions">
          <Button
            size="small"
            onClick={() => onEdit?.(card)}
            className="photocard-edit"
            disabled={isDeleting}
          >
            <FiEdit3 />
          </Button>
          <Button
            size="small"
            onClick={() => onDelete?.(card._id)}
            disabled={isDeleting}
            className="photocard-delete"
          >
            <FiTrash2 />
          </Button>
        </div>
      )}
    </Card>
  );
}
