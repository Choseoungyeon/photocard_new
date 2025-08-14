'use client';
import React, { useCallback } from 'react';
import { LuX, LuMenu } from 'react-icons/lu';
import './modal.scss';
import clsx from 'clsx';
import { gsap } from 'gsap';

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
  const isMobileSize = React.useRef(false);

  const [isExpandDragging, setIsExpandDragging] = React.useState(false);
  const [isModalDragging, setIsModalDragging] = React.useState(false);
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });
  const [modalTop, setModalTop] = React.useState(0);
  const [modalDraggingDirection, setModalDraggingDirection] = React.useState<
    undefined | 'up' | 'down'
  >(undefined);
  const [isModalOpen, setIsModalOpen] = React.useState(open);
  const [columnCount, setColumnCount] = React.useState(3);

  // GSAP 애니메이션 함수들
  const animateModalPosition = React.useCallback((top: string, duration: number = 0.3) => {
    if (modalRef.current) {
      gsap.to(modalRef.current, {
        top: top,
        duration: duration,
        ease: 'power2.out',
      });
    }
  }, []);

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

  const handleModalDraggingMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    let clientX: number, clientY: number;

    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e && 'clientY' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else {
      return;
    }

    e.stopPropagation();
    if (modalRef.current) {
      const rect = modalRef.current.getBoundingClientRect();
      setOffset({
        x: clientX - rect.left,
        y: clientY - rect.top,
      });
      setModalTop(clientY);
    }
    setIsModalDragging(true);
    onClick();
  };

  const handleExpandMouseMove = React.useCallback(
    (e: MouseEvent | TouchEvent) => {
      const x = 'clientX' in e ? e.clientX : e.touches[0].clientX;
      const y = 'clientY' in e ? e.clientY : e.touches[0].clientY;

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
    (e: MouseEvent | TouchEvent) => {
      const moveY = 'clientY' in e ? e.clientY : e.touches[0].clientY;
      const moveX = 'clientX' in e ? e.clientX : e.touches[0].clientX;

      if (window.innerWidth < 600) {
        if (isModalDragging && !isExpandDragging && modalRef.current) {
          let direction;

          if (modalTop - moveY > 0) {
            direction = 'up';
          } else if (modalTop - moveY === 0) {
            direction = modalDraggingDirection;
          } else {
            direction = 'down';
          }

          if (direction === 'up') {
            setModalDraggingDirection('up');
            if (window.innerHeight - moveY > 400) {
              animateModalPosition('calc(100% - 500px)', 0.1);
            } else {
              modalRef.current.style.top = `${moveY}px`;
            }
          } else {
            setModalDraggingDirection('down');
            if (window.innerHeight - moveY < 100) {
              animateModalPosition('100%', 0.3);
              setTimeout(() => {
                setIsModalOpen(false);
                onClose();
              }, 300);
            } else {
              modalRef.current.style.top = `${moveY}px`;
            }
          }
        }
      } else {
        if (isModalDragging && !isExpandDragging && modalRef.current) {
          modalRef.current.style.left = `${moveX - offset.x}px`;
          modalRef.current.style.top = `${moveY - offset.y}px`;
        }
      }

      setModalTop(moveY);
    },
    [
      modalTop,
      isModalDragging,
      isExpandDragging,
      modalDraggingDirection,
      animateModalPosition,
      onClose,
      offset.x,
      offset.y,
    ],
  );

  const hanldeExpandMouseUp = () => {
    setIsExpandDragging(false);
  };

  const handleModalDraggingMouseUp = React.useCallback(
    (e: MouseEvent | TouchEvent) => {
      let moveY: number | undefined;
      if ('touches' in e) {
        if (e.touches && e.touches.length > 0) {
          moveY = e.touches[0].clientY;
        } else if ('changedTouches' in e && e.changedTouches.length > 0) {
          moveY = e.changedTouches[0].clientY;
        }
      } else if ('clientY' in e) {
        moveY = e.clientY;
      }

      setIsModalDragging(false);

      if (modalDraggingDirection === 'up') {
        animateModalPosition('calc(100% - 500px)', 0.3);
      } else if (modalDraggingDirection === 'down') {
        if (typeof moveY === 'number' && window.innerHeight - moveY < 100) {
          animateModalPosition('100%', 0.3);
          setTimeout(() => {
            setIsModalOpen(false);
            onClose();
          }, 300);
        } else {
          animateModalPosition('calc(100% - 200px)', 0.3);
        }
      }
      setModalDraggingDirection(undefined);
      setModalTop(0);
    },
    [modalDraggingDirection, onClose, animateModalPosition],
  );

  const closeButtonClick = () => {
    if (window.innerWidth < 600) {
      animateModalPosition('100%', 0.3);
      setTimeout(() => {
        setIsModalOpen(false);
        onClose();
      }, 300);
    } else {
      onClose();
      setIsModalOpen(false);
    }
  };

  const handleResize = useCallback(() => {
    if (window.innerWidth < 600) {
      if (isMobileSize.current) return;
      isMobileSize.current = true;
      setIsModalDragging(false);
      setIsExpandDragging(false);
      setIsModalOpen(false);
      onClose();
    } else {
      isMobileSize.current = false;
    }
  }, [onClose]);

  React.useEffect(() => {
    if (isExpandDragging && !isModalDragging) {
      document.addEventListener('touchmove', handleExpandMouseMove);
      document.addEventListener('touchend', hanldeExpandMouseUp);
      document.addEventListener('mousemove', handleExpandMouseMove);
      document.addEventListener('mouseup', hanldeExpandMouseUp);
    } else {
      document.removeEventListener('touchmove', handleExpandMouseMove);
      document.removeEventListener('touchend', hanldeExpandMouseUp);
      document.removeEventListener('mousemove', handleExpandMouseMove);
      document.removeEventListener('mouseup', hanldeExpandMouseUp);
    }

    return () => {
      document.removeEventListener('touchmove', handleExpandMouseMove);
      document.removeEventListener('touchend', hanldeExpandMouseUp);
      document.removeEventListener('mousemove', handleExpandMouseMove);
      document.removeEventListener('mouseup', hanldeExpandMouseUp);
    };
  }, [isExpandDragging, isModalDragging, handleExpandMouseMove]);

  React.useEffect(() => {
    if (isModalDragging && !isExpandDragging) {
      document.addEventListener('touchmove', handleModalDraggingMouseMove);
      document.addEventListener('touchend', handleModalDraggingMouseUp);
      document.addEventListener('mousemove', handleModalDraggingMouseMove);
      document.addEventListener('mouseup', handleModalDraggingMouseUp);
    } else {
      document.removeEventListener('touchmove', handleModalDraggingMouseMove);
      document.removeEventListener('touchend', handleModalDraggingMouseUp);
      document.removeEventListener('mousemove', handleModalDraggingMouseMove);
      document.removeEventListener('mouseup', handleModalDraggingMouseUp);
    }

    return () => {
      document.removeEventListener('touchmove', handleModalDraggingMouseMove);
      document.removeEventListener('touchend', handleModalDraggingMouseUp);
      document.removeEventListener('mousemove', handleModalDraggingMouseMove);
      document.removeEventListener('mouseup', handleModalDraggingMouseUp);
    };
  }, [isModalDragging, isExpandDragging, handleModalDraggingMouseMove, handleModalDraggingMouseUp]);

  React.useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  React.useEffect(() => {
    setIsModalOpen(open);
  }, [open]);

  return isModalOpen ? (
    <>
      <div className={clsx('create_page_modal', className)} ref={modalRef}>
        <div
          className="create_page_modal_menu"
          onMouseDown={handleModalDraggingMouseDown}
          onTouchStart={handleModalDraggingMouseDown}
        >
          <h2>스티커</h2>
          <i
            className="create_page_modal_icon create_page_modal_icon_close"
            onClick={closeButtonClick}
          >
            <LuX />
          </i>
        </div>
        <div className="create_page_modal_content">
          <div className="create_page_modal_element_wrap">
            {columns.map((col, colIdx) => (
              <div className="create_page_modal_element_column" key={colIdx}>
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
      {open && <div className="create_page_modal_dim" onClick={closeButtonClick}></div>}
    </>
  ) : null;
}

export default Create;
