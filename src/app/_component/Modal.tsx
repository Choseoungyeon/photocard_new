'use client';
import React, { useCallback } from 'react';
import { FiX, FiMenu, FiAlertCircle, FiCheckCircle, FiInfo } from 'react-icons/fi';
import './Modal.scss';
import clsx from 'clsx';
import { gsap } from 'gsap';
import Button from './Button';

interface ModalProps {
  className?: string;
  open?: boolean;
  title?: string;
  type?: 'alert' | 'confirm' | 'custom' | 'error' | 'success' | 'info';
  message?: string;
  content?: React.ReactNode;
  imageList?: { public_id: string; url: string }[];
  isError?: boolean;
  errorMessage?: string;
  closeButton?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  onClose?: () => void;
  elementClick?: (val: string) => void;
  confirmText?: string;
  cancelText?: string;
  draggable?: boolean;
  resizable?: boolean;
}

function splitImagesToColumns(images: string[], columnCount: number) {
  const columns: string[][] = Array.from({ length: columnCount }, () => []);
  images.forEach((img, idx) => {
    columns[idx % columnCount].push(img);
  });
  return columns;
}

function Modal(props: ModalProps) {
  const {
    open = true,
    title = '알림',
    type = 'alert',
    message,
    content,
    imageList,
    className,
    isError,
    errorMessage,
    elementClick,
    onConfirm,
    onCancel,
    onClose,
    confirmText = '확인',
    cancelText = '취소',
    draggable = true,
    resizable = false,
    closeButton = false,
  } = props;

  const expandIconRef = React.useRef<HTMLElement | null>(null);
  const modalRef = React.useRef<HTMLDivElement | null>(null);
  const [isMobileSize, setIsMobileSize] = React.useState(false);

  const [isExpandDragging, setIsExpandDragging] = React.useState(false);
  const [isModalDragging, setIsModalDragging] = React.useState(false);
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });
  const [modalTop, setModalTop] = React.useState(0);
  const [modalDraggingDirection, setModalDraggingDirection] = React.useState<
    undefined | 'up' | 'down'
  >(undefined);
  const [isModalOpen, setIsModalOpen] = React.useState(open);
  const [columnCount, setColumnCount] = React.useState(3);

  const setActiveModal = React.useCallback(() => {
    const allModals = document.querySelectorAll('.modal_wrap');
    allModals.forEach((modal) => {
      modal.classList.remove('is-active');
    });

    if (modalRef.current) {
      const modalWrap = modalRef.current.closest('.modal_wrap');
      if (modalWrap) {
        modalWrap.classList.add('is-active');
      }
    }
  }, []);

  const animateModalPosition = React.useCallback((top: string, duration: number = 0.3) => {
    if (modalRef.current) {
      gsap.to(modalRef.current, {
        top: top,
        duration: duration,
        ease: 'power2.out',
      });
    }
  }, []);

  const columnCountFun = (width: number) => {
    if (width >= 350) setColumnCount(4);
    else if (width >= 250) setColumnCount(3);
    else if (width >= 200) setColumnCount(2);
    else setColumnCount(2);
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

  const getIconAndColor = () => {
    switch (type) {
      case 'error':
        return { icon: <FiAlertCircle />, color: '#da3633' };
      case 'success':
        return { icon: <FiCheckCircle />, color: '#3fb950' };
      case 'info':
        return { icon: <FiInfo />, color: '#5e6ad2' };
      default:
        return { icon: <FiAlertCircle />, color: '#8b949e' };
    }
  };

  const { icon, color } = getIconAndColor();

  const handleExpandMouseDown = (e: React.MouseEvent) => {
    if (!resizable) return;
    e.stopPropagation();
    setIsExpandDragging(true);
  };

  const handleModalDraggingMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    if (!draggable || type !== 'custom') return;

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

    setActiveModal();

    if (modalRef.current) {
      const rect = modalRef.current.getBoundingClientRect();
      setOffset({
        x: clientX - rect.left,
        y: clientY - rect.top,
      });
      setModalTop(clientY);
    }
    setIsModalDragging(true);
  };

  const handleExpandMouseMove = React.useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!resizable) return;

      const x = 'clientX' in e ? e.clientX : e.touches[0].clientX;
      const y = 'clientY' in e ? e.clientY : e.touches[0].clientY;

      if (isExpandDragging) {
        if (modalRef.current) {
          const modal = modalRef.current.getBoundingClientRect();
          const modalWidth = Math.min(Math.max(x - modal.x + 10, 200), 320);
          modalRef.current.style.width = `${modalWidth}px`;
          modalRef.current.style.height = `${y - modal.y + 10}px`;
          columnCountFun(modalWidth);
        }
      }
    },
    [isExpandDragging, modalRef, resizable],
  );

  const handleModalDraggingMouseMove = React.useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!draggable) return;

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
                if (onClose) onClose();
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
      draggable,
    ],
  );

  const hanldeExpandMouseUp = () => {
    setIsExpandDragging(false);
  };

  const handleModalDraggingMouseUp = React.useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!draggable) return;

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
            if (onClose) onClose();
          }, 300);
        } else {
          animateModalPosition('calc(100% - 200px)', 0.3);
        }
      }
      setModalDraggingDirection(undefined);
      setModalTop(0);
    },
    [modalDraggingDirection, onClose, animateModalPosition, draggable],
  );

  const closeButtonClick = () => {
    if (window.innerWidth < 600) {
      animateModalPosition('100%', 0.3);
      setTimeout(() => {
        setIsModalOpen(false);
        if (onClose) onClose();
      }, 300);
    } else {
      if (onClose) onClose();
      setIsModalOpen(false);
    }
  };

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    closeButtonClick();
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    closeButtonClick();
  };

  const handleResize = useCallback(() => {
    columnCountFun(modalRef.current?.clientWidth || 0);
    if (window.innerWidth < 600) {
      if (isMobileSize) return;
      setIsMobileSize(true);
      setIsModalDragging(false);
      setIsExpandDragging(false);
      setIsModalOpen(false);
      if (onClose) onClose();
    } else {
      setIsMobileSize(false);
    }
  }, [onClose, isMobileSize]);

  const isDim = React.useMemo(() => {
    if (isError && open) return true;
    if (isMobileSize && open) return true;
    return false;
  }, [isError, open, isMobileSize]);

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
    if (open) {
      if (window.innerWidth < 600) {
        setIsMobileSize(true);
        columnCountFun(window.innerWidth);
      } else {
        setIsMobileSize(false);
        setColumnCount(3);
      }
    }
    setIsModalOpen(open);
    setActiveModal();
  }, [open, setActiveModal]);

  const renderContent = () => {
    if (isError) {
      return (
        <>
          <p className="modal_error">
            <FiAlertCircle />
            {errorMessage}
          </p>
          <Button variant="primary" onClick={closeButtonClick}>
            {confirmText}
          </Button>
        </>
      );
    }

    if (imageList && imageList.length > 0) {
      return (
        <>
          <div className="modal_element_wrap">
            {columns.map((col, colIdx) => (
              <div className="modal_element_column" key={colIdx}>
                {col.map((item, idx) => (
                  <button
                    className="modal_element"
                    key={`modal_element_${colIdx}_${idx}`}
                    onClick={() => elementClick && elementClick(item)}
                  >
                    <img src={item} alt="" />
                  </button>
                ))}
              </div>
            ))}
          </div>

          {resizable && (
            <i
              className="modal_icon_wrap modal_icon_expand"
              ref={expandIconRef}
              onMouseDown={handleExpandMouseDown}
            >
              <FiMenu />
            </i>
          )}
        </>
      );
    }

    if (
      type == 'error' ||
      type === 'alert' ||
      type === 'confirm' ||
      type === 'success' ||
      type === 'info'
    ) {
      return (
        <>
          <div className="modal_icon" style={{ color }}>
            {icon}
          </div>
          <p className="modal_message">{message}</p>
          <div className="modal_actions">
            {type === 'confirm' && (
              <Button variant="secondary" onClick={handleCancel}>
                {cancelText}
              </Button>
            )}
            <Button variant="primary" onClick={handleConfirm}>
              {confirmText}
            </Button>
          </div>
        </>
      );
    }

    if (type === 'custom' && content) {
      return content;
    }

    return null;
  };

  return isModalOpen ? (
    <div
      className={clsx('modal_wrap', 'is-active', className, {
        ['is-error']: isError || type === 'error',
        ['is-alert']: type === 'alert',
        ['is-confirm']: type === 'confirm',
        ['is-success']: type === 'success',
        ['is-info']: type === 'info',
      })}
    >
      <div className={clsx('modal')} ref={modalRef}>
        <>
          <div
            className="modal_menu"
            onMouseDown={handleModalDraggingMouseDown}
            onTouchStart={handleModalDraggingMouseDown}
          >
            <h2>{title}</h2>
            {closeButton && (
              <i className="modal_icon modal_icon_close" onClick={closeButtonClick}>
                <FiX />
              </i>
            )}
          </div>
          <div className="modal_content">{renderContent()}</div>
        </>
      </div>
      {(type !== 'custom' || isDim) && <div className="modal_dim" onClick={closeButtonClick}></div>}
    </div>
  ) : null;
}

export default Modal;
