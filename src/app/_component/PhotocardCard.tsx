import React from 'react';
import { FiEdit3, FiTrash2, FiDownload } from 'react-icons/fi';
import Card from './Card';
import Button from './Button';
import { formatDate, ensureHttps } from '../gallery/utils';
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
  const handleDownload = async () => {
    try {
      const httpsUrl = ensureHttps(card.images.main);
      const response = await fetch(httpsUrl, {
        mode: 'cors',
        credentials: 'omit',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${card.title || 'photocard'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('다운로드 중 오류가 발생했습니다:', error);
      try {
        const httpsUrl = ensureHttps(card.images.main);
        window.open(httpsUrl, '_blank');
      } catch (fallbackError) {
        console.error('fallback 다운로드도 실패했습니다:', fallbackError);
      }
    }
  };

  return (
    <Card className={`photocard-card ${className}`}>
      <div className="photocard-image">
        <img src={ensureHttps(card.images.main)} alt={card.title} />
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
            onClick={handleDownload}
            className="photocard-download"
            disabled={isDeleting}
          >
            <FiDownload />
          </Button>
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
