'use client';

import React from 'react';
import Modal from '@/app/_component/Modal';
import Skeleton from '@/app/_component/Skeleton';
import '@/app/style/ui/sticker-modal.scss';

interface StickerModalProps {
  isOpen: boolean;
  imageList?: { public_id: string; url: string }[];
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  onClose: () => void;
  onLoadMore?: () => void;
  onSelectSticker: (stickerUrl: string) => void;
}

export default function StickerModal({
  isOpen,
  imageList = [],
  hasNextPage,
  isFetchingNextPage,
  onClose,
  onLoadMore,
  onSelectSticker,
}: StickerModalProps) {
  const [columnCount, setColumnCount] = React.useState(3);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleStickerClick = (stickerUrl: string) => {
    onSelectSticker(stickerUrl);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

    if (
      scrollHeight - scrollTop <= clientHeight * 1.5 &&
      hasNextPage &&
      !isFetchingNextPage &&
      onLoadMore
    ) {
      onLoadMore();
    }
  };

  const columnCountFun = (width: number) => {
    if (width >= 350) setColumnCount(4);
    else if (width >= 250) setColumnCount(3);
    else if (width >= 200) setColumnCount(2);
    else setColumnCount(2);
  };

  const splitImagesToColumns = (images: string[], columnCount: number) => {
    const columns: string[][] = Array.from({ length: columnCount }, () => []);
    images.forEach((img, idx) => {
      columns[idx % columnCount].push(img);
    });
    return columns;
  };

  const columns = React.useMemo(() => {
    if (imageList && imageList.length > 0) {
      return splitImagesToColumns(
        imageList.map((item) => item.url),
        columnCount,
      );
    } else {
      return [];
    }
  }, [imageList, columnCount]);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 600) {
        columnCountFun(window.innerWidth);
      } else {
        columnCountFun(containerRef.current?.clientWidth || 0);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  React.useEffect(() => {
    if (isOpen) {
      if (window.innerWidth < 600) {
        columnCountFun(window.innerWidth);
      } else {
        setColumnCount(3);
      }
    }
  }, [isOpen]);

  return (
    <Modal
      open={isOpen}
      type="custom"
      title="스티커"
      closeButton={true}
      onClose={onClose}
      resizable={true}
      draggable={true}
      onResize={(width) => {
        columnCountFun(width);
      }}
      onContentScroll={handleScroll}
      content={
        <div className="sticker_modal_container" ref={containerRef}>
          <div className="sticker_modal_element_wrap">
            {columns.map((col, colIdx) => (
              <div className="sticker_modal_element_column" key={colIdx}>
                {col.map((item, idx) => (
                  <button
                    className="sticker_modal_element"
                    key={`sticker_${colIdx}_${idx}`}
                    onClick={() => handleStickerClick(item)}
                  >
                    <img src={item} alt={`sticker_${colIdx}_${idx}`} />
                  </button>
                ))}
                {hasNextPage && (
                  <>
                    {Array.from({ length: 3 }).map((_, index) => (
                      <Skeleton key={`skeleton-${index}`} variant="sticker" />
                    ))}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      }
    />
  );
}
