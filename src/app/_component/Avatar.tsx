import * as React from 'react';
import clsx from 'clsx';
import '@/app/style/ui/avatar.scss';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type AvatarVariant = 'circle' | 'square';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: AvatarSize;
  variant?: AvatarVariant;
  className?: string;
  children?: React.ReactNode;
  fallback?: string;
  status?: 'online' | 'offline' | 'away' | 'busy';
}

export default function Avatar({
  src,
  alt,
  size = 'md',
  variant = 'circle',
  className,
  children,
  fallback,
  status,
  ...props
}: AvatarProps) {
  const [imageError, setImageError] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const showImage = src && !imageError;
  const showFallback = !showImage && fallback;
  const showChildren = !showImage && !showFallback && children;

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      className={clsx(
        'avatar',
        `avatar--${size}`,
        `avatar--${variant}`,
        {
          'avatar--with-status': status,
        },
        className,
      )}
      {...props}
    >
      {showImage && (
        <img
          src={src}
          alt={alt || 'Avatar'}
          className={clsx('avatar__image', {
            'avatar__image--loaded': imageLoaded,
          })}
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
      )}

      {showFallback && <div className="avatar__fallback">{getInitials(fallback)}</div>}

      {showChildren && <div className="avatar__content">{children}</div>}

      {status && <div className={clsx('avatar__status', `avatar__status--${status}`)} />}
    </div>
  );
}
