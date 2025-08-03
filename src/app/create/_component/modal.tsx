'use client';
import React from 'react';
import { LuX, LuMenu } from 'react-icons/lu';
import './modal.scss';
import clsx from 'clsx';

interface CreateProps {
  className?: string;
  open?: boolean;
  imageList: { public_id: string; url: string }[];
  onClick: () => void;
  onClose: () => void;
  elementClick: (val: string) => void;
}

function splitImagesToColumns(images: string[], columnCount: number) {
  const columns: string[][] = Array.from({ length: columnCount }, () => []);
  images.forEach((img, idx) => {
    columns[idx % columnCount].push(img);
  });
  return columns;
}

function Create(props: CreateProps) {
  const { open = true, imageList, className, elementClick, onClose, onClick } = props;
  const expandIconRef = React.useRef<HTMLElement | null>(null);
  const modalRef = React.useRef<HTMLDivElement | null>(null);

  const [isExpandDragging, setIsExpandDragging] = React.useState(false);
  const [isModalDragging, setIsModalDragging] = React.useState(false);
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });
  const [isModalOpen, setIsModalOpen] = React.useState(open);
  const [columnCount, setColumnCount] = React.useState(3);

  React.useEffect(() => {
    function handleResize() {
      if (!modalRef.current) {
        setIsModalOpen(false);
        return;
      }
      const width = modalRef.current?.clientWidth || 0;
      if (width >= 350) setColumnCount(4);
      else if (width >= 250) setColumnCount(3);
      else if (width >= 200) setColumnCount(2);
      else setColumnCount(2);
    }
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const columns = React.useMemo(() => {
    if (imageList.length > 0) {
      return splitImagesToColumns(
        imageList.map((item) => item.url),
        columnCount,
      );
    } else {
      return [];
    }
  }, [imageList, columnCount]);

  const handleExpandMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpandDragging(true);
  };

  const handleModalDraggingMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (modalRef.current) {
      const rect = modalRef.current.getBoundingClientRect();
      setOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
    setIsModalDragging(true);
    onClick();
  };

  const handleExpandMouseMove = React.useCallback(
    (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      if (isExpandDragging) {
        if (modalRef.current) {
          const modal = modalRef.current.getBoundingClientRect();
          const modalWidth = Math.min(Math.max(x - modal.x + 10, 200), 320);
          modalRef.current.style.width = `${modalWidth}px`;
          modalRef.current.style.height = `${y - modal.y + 10}px`;

          // modalWidth에 따라 columnCount 계산
          if (modalWidth >= 350) setColumnCount(4);
          else if (modalWidth >= 250) setColumnCount(3);
          else if (modalWidth >= 200) setColumnCount(2);
          else setColumnCount(2);
        }
      }
    },
    [isExpandDragging, modalRef],
  );

  const handleModalDraggingMouseMove = React.useCallback(
    (e: MouseEvent) => {
      if (isModalDragging && !isExpandDragging && modalRef.current) {
        modalRef.current.style.left = `${e.clientX - offset.x}px`;
        modalRef.current.style.top = `${e.clientY - offset.y}px`;
      }
    },
    [isModalDragging, isExpandDragging, offset, modalRef],
  );

  const hanldeExpandMouseUp = () => {
    setIsExpandDragging(false);
  };

  const handleModalDraggingMouseUp = () => {
    setIsModalDragging(false);
  };

  const closeButtonClick = () => {
    onClose();
    setIsModalOpen(false);
  };

  React.useEffect(() => {
    if (isExpandDragging && !isModalDragging) {
      document.addEventListener('mousemove', handleExpandMouseMove);
      document.addEventListener('mouseup', hanldeExpandMouseUp);
    } else {
      document.removeEventListener('mousemove', handleExpandMouseMove);
      document.removeEventListener('mouseup', hanldeExpandMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleExpandMouseMove);
      document.removeEventListener('mouseup', hanldeExpandMouseUp);
    };
  }, [isExpandDragging, isModalDragging, handleExpandMouseMove]);

  React.useEffect(() => {
    if (isModalDragging && !isExpandDragging) {
      document.addEventListener('mousemove', handleModalDraggingMouseMove);
      document.addEventListener('mouseup', handleModalDraggingMouseUp);
    } else {
      document.removeEventListener('mousemove', handleModalDraggingMouseMove);
      document.removeEventListener('mouseup', handleModalDraggingMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleModalDraggingMouseMove);
      document.removeEventListener('mouseup', handleModalDraggingMouseUp);
    };
  }, [isModalDragging, isExpandDragging, handleModalDraggingMouseMove]);

  React.useEffect(() => {
    setIsModalOpen(open);
  }, [open]);

  return isModalOpen ? (
    <div
      className={clsx('create_page_modal', className)}
      ref={modalRef}
      onMouseDown={handleModalDraggingMouseDown}
    >
      <div className="create_page_modal_menu">
        <h2>스티커</h2>
        <i
          className="create_page_modal_icon create_page_modal_icon_close"
          onClick={closeButtonClick}
        >
          <LuX />
        </i>
      </div>
      <div className="create_page_modal_content">
        <div className="gallery_masonry">
          {columns.map((col, colIdx) => (
            <div className="gallery_column" key={colIdx}>
              {col.map((item, idx) => (
                <button
                  className="create_page_modal_element"
                  key={`create_page_modal_element_${colIdx}_${idx}`}
                  onClick={() => elementClick(item)}
                >
                  <img src={item} alt="" />
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
      <i
        className="create_page_modal_icon create_page_modal_icon_expand"
        ref={expandIconRef}
        onMouseDown={handleExpandMouseDown}
      >
        <LuMenu />
      </i>
    </div>
  ) : null;
}

export default Create;
