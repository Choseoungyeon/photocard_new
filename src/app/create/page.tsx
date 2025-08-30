'use client';

import React from 'react';
import Dropzone from 'react-dropzone';
import clsx from 'clsx';
import { useInfiniteQuery } from '@tanstack/react-query';
import {
  FiUpload,
  FiPlus,
  FiImage,
  FiDownload,
  FiSmile,
  FiSave,
  FiType,
  FiTrash2,
} from 'react-icons/fi';

import { useModal } from '@/app/_context/ModalContext';
import { UploadModal } from '@/app/_component';
import customFetch from '@/app/_hook/customFetch';

import TextInputModal from './_component/TextInputModal';
import StickerModal from './_component/StickerModal';
import MoveableComponent from './_component/MoveableComponent';

import { downloadClickHandler, saveClickHandler } from './utils';
import { TextElement, TextElementSize, UploadData } from './types';

import '@/app/style/page/create.scss';

export default function CreateClient() {
  const { showModal } = useModal();
  const [image, setImage] = React.useState<string | null>(null);
  const [menuActive, setMenuActive] = React.useState(false);
  const [moveableTarget, setMoveableTarget] = React.useState<HTMLElement[]>([]);
  const [moveableElementImg, setMoveableElementImg] = React.useState<string[]>([]);
  const [textElements, setTextElements] = React.useState<TextElement[]>([]);
  const [showTrashButton, setShowTrashButton] = React.useState(false);
  const [modalStickerActive, setModalStickerActive] = React.useState(false);
  const [modalTextActive, setModalTextActive] = React.useState(false);
  const [uploadModalOpen, setUploadModalOpen] = React.useState(false);
  const [uploadData, setUploadData] = React.useState<UploadData | null>(null);
  const [isRotating, setIsRotating] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [isLoadingImages, setIsLoadingImages] = React.useState(false);
  const [textElementSizes, setTextElementSizes] = React.useState<Record<string, TextElementSize>>(
    {},
  );

  const createBoxRef = React.useRef<HTMLDivElement>(null);
  const targetRef = React.useRef<HTMLImageElement | null>(null);
  const elementWrapRef = React.useRef<HTMLDivElement>(null);

  const {
    data: stickersData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isLoadingStickers,
    error: stickersError,
  } = useInfiniteQuery({
    queryKey: ['stickers'],
    queryFn: async ({ pageParam }) => {
      return await getStickers(pageParam?.lastIndex, pageParam?.direction);
    },
    initialPageParam: { lastIndex: undefined, direction: 'next' as const },
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.hasNextPage) {
        return {
          lastIndex: lastPage.pagination.nextCursor,
          direction: 'next' as const,
        };
      }
      return undefined;
    },
    staleTime: 5 * 60 * 1000,
  });

  const getStickers = async (lastIndex?: number, direction: 'next' | 'prev' = 'next') => {
    const params = new URLSearchParams();
    params.append('limit', '20');

    if (lastIndex !== undefined) {
      params.append('last_index', lastIndex.toString());
      params.append('direction', direction);
    }

    const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/image?${params.toString()}`;
    const res = await customFetch.get(url);
    return res.data;
  };

  const stickersList = React.useMemo(() => {
    return stickersData?.pages.flatMap((page) => page.images) || [];
  }, [stickersData]);

  const dropHandler = (files: File[]) => {
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const imageUrl = finishedEvent.target?.result as string;
      if (imageUrl) {
        setImage(imageUrl);
        setImageLoaded(false);
      }
    };
    reader.readAsDataURL(files[0]);
  };

  const moveableElementClickHandler = (event: React.MouseEvent) => {
    const elementRef = event.currentTarget as HTMLElement;
    if (!moveableTarget.includes(elementRef)) setMoveableTarget([...moveableTarget, elementRef]);
    setShowTrashButton(true);
  };

  const textElementClickHandler = (event: React.MouseEvent) => {
    const elementRef = event.currentTarget as HTMLElement;
    if (!moveableTarget.includes(elementRef)) setMoveableTarget([...moveableTarget, elementRef]);
    setShowTrashButton(true);
  };

  const moveableTargetClickHandler = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target && !moveableTarget.includes(target)) {
      setMoveableTarget([...moveableTarget, target]);
    }
  };

  const blurHandler = (event: React.MouseEvent) => {
    const target = event.target as HTMLElement;
    if (moveableTarget.length > 0 && !moveableTarget.includes(target)) {
      setMoveableTarget([]);
      setShowTrashButton(false);
    }
  };

  const handleDownload = () => {
    const childrenArray = elementWrapRef.current?.children;
    downloadClickHandler(image, childrenArray, createBoxRef, targetRef, textElements, showModal);
  };

  const waitForImagesToLoad = async (
    imageList: { public_id: string; url: string }[],
  ): Promise<void> => {
    const imagePromises = imageList.map((item) => {
      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => reject(new Error(`이미지 로드 실패: ${item.url}`));
        img.src = item.url;
      });
    });

    await Promise.all(imagePromises);
  };

  const onClickStickersHandler = async () => {
    try {
      if (stickersList.length > 0) {
        setIsLoadingImages(true);
        await waitForImagesToLoad(stickersList);
      }

      setModalStickerActive(true);
    } catch (error) {
      console.error('스티커 로딩 중 오류:', error);
      showModal({
        type: 'error',
        title: '오류',
        message: '스티커 로딩 중 오류가 발생했습니다.',
        confirmText: '확인',
      });
    } finally {
      setIsLoadingImages(false);
    }
  };

  const addTextElement = (textData: {
    text: string;
    color: string;
    fontSize: number;
    fontWeight: string;
    textAlign: string;
    lineHeight: number;
  }) => {
    const newTextElement = {
      id: `text-${Date.now()}`,
      ...textData,
    };
    setTextElements([...textElements, newTextElement]);

    setTimeout(() => {
      const textElement = document.querySelector(
        `[data-text-id="${newTextElement.id}"]`,
      ) as HTMLElement;
      if (textElement) {
        const rect = textElement.getBoundingClientRect();
        setTextElementSizes((prev) => ({
          ...prev,
          [newTextElement.id]: {
            width: rect.width,
            height: rect.height,
            fontSize: textData.fontSize,
          },
        }));
      }
    }, 100);

    setModalTextActive(false);
  };

  const changeImageHandler = () => {
    if (image) {
      setMoveableElementImg([]);
      setMoveableTarget([]);
    }
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        setImage(null);
        dropHandler(Array.from(files));
      }
    };
    fileInput.click();
  };

  React.useEffect(() => {
    if (targetRef.current && imageLoaded) {
      setMoveableTarget([targetRef.current]);
    } else {
      setMoveableTarget([]);
    }
  }, [image, imageLoaded]);

  const handleSave = () => {
    const childrenArray = elementWrapRef.current?.children;
    saveClickHandler(
      image,
      childrenArray,
      createBoxRef,
      targetRef,
      moveableElementImg,
      textElements,
      showModal,
      setUploadData,
      setUploadModalOpen,
    );
  };

  const handleTrashClick = () => {
    if (moveableTarget.length > 0) {
      const selectedElement = moveableTarget[moveableTarget.length - 1];

      if (selectedElement.classList.contains('create_box_text_element')) {
        const textId = selectedElement.getAttribute('data-text-id');
        if (textId) {
          setTextElements((prev) => prev.filter((element) => element.id !== textId));
          setTextElementSizes((prev) => {
            const newSizes = { ...prev };
            delete newSizes[textId];
            return newSizes;
          });
        }
      } else if (selectedElement.classList.contains('create_box_element')) {
        const src = selectedElement.getAttribute('src');
        if (src) {
          setMoveableElementImg((prev) => prev.filter((item) => item !== src));
        }
      }

      setMoveableTarget([]);
      setShowTrashButton(false);
    }
  };

  React.useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <div className="create_page" onClick={blurHandler}>
      <div className="create_box_wrap">
        <div className="create_box" ref={createBoxRef}>
          {image ? (
            <div className="create_box_image" onClick={moveableTargetClickHandler}>
              <img
                src={image}
                alt="uploaded_image"
                ref={targetRef}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageLoaded(false)}
              />
            </div>
          ) : (
            <Dropzone onDrop={dropHandler}>
              {({ getRootProps, getInputProps }) => (
                <div className="create_box_icon_wrap" {...getRootProps()}>
                  <input {...getInputProps()} />
                  <i className="create_box_icon">
                    <FiUpload />
                  </i>
                </div>
              )}
            </Dropzone>
          )}
          <MoveableComponent
            moveableTarget={moveableTarget}
            isRotating={isRotating}
            setIsRotating={setIsRotating}
            textElementSizes={textElementSizes}
            setTextElements={setTextElements}
          />
          <div className="create_box_element_wrap" ref={elementWrapRef}>
            {(() => {
              return null;
            })()}
            {moveableElementImg.map((item, idx) => {
              return (
                <img
                  src={item}
                  alt={`moveable_element_${idx}`}
                  key={`${item}_${idx}`}
                  className="create_box_element"
                  onClick={moveableElementClickHandler}
                  style={{
                    touchAction: 'none',
                    userSelect: 'none',
                    WebkitUserSelect: 'none',
                    WebkitTouchCallout: 'none',
                  }}
                />
              );
            })}
            {textElements.map((textElement) => (
              <div
                key={textElement.id}
                data-text-id={textElement.id}
                className="create_box_text_element"
                onClick={textElementClickHandler}
                style={{
                  color: textElement.color,
                  fontSize: `${textElement.fontSize}px`,
                  fontWeight: textElement.fontWeight,
                  textAlign: textElement.textAlign as 'left' | 'center' | 'right',
                  lineHeight: textElement.lineHeight,
                }}
              >
                {textElement.text.split('\n').map((line, index) => (
                  <div key={index}>
                    {line}
                    {index < textElement.text.split('\n').length - 1 && <br />}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="create_box_menu">
          <span
            className={clsx('create_box_menu_item', { ['is-active']: menuActive })}
            onClick={() => setMenuActive(!menuActive)}
          >
            <i className="create_box_menu_icon">
              <FiPlus />
            </i>
          </span>

          {showTrashButton && (
            <span
              className="create_box_menu_item create_box_trash_button"
              onClick={handleTrashClick}
              title="선택된 요소 삭제"
            >
              <i className="create_box_menu_icon">
                <FiTrash2 />
              </i>
            </span>
          )}
          {menuActive ? (
            <>
              <span
                className="create_box_menu_item"
                onClick={changeImageHandler}
                title="이미지 변경"
              >
                <i className="create_box_menu_icon">
                  <FiImage />
                </i>
              </span>
              <span
                className={clsx('create_box_menu_item', {
                  'is-loading': isLoadingStickers || isLoadingImages,
                })}
                onClick={onClickStickersHandler}
                style={{
                  pointerEvents: isLoadingStickers || isLoadingImages ? 'none' : 'auto',
                }}
              >
                <i className="create_box_menu_icon">
                  <FiSmile />
                </i>
              </span>
              <span className="create_box_menu_item" onClick={() => setModalTextActive(true)}>
                <i className="create_box_menu_icon">
                  <FiType />
                </i>
              </span>
              <span className="create_box_menu_item" onClick={handleDownload}>
                <i className="create_box_menu_icon">
                  <FiDownload />
                </i>
              </span>
              <span className="create_box_menu_item" onClick={handleSave}>
                <i className="create_box_menu_icon">
                  <FiSave />
                </i>
              </span>
            </>
          ) : null}
        </div>
      </div>

      <StickerModal
        isOpen={modalStickerActive}
        onClose={() => setModalStickerActive(false)}
        onSelectSticker={(stickerUrl: string) => {
          setMoveableElementImg([...moveableElementImg, stickerUrl]);
        }}
        imageList={stickersList}
        onLoadMore={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />

      <TextInputModal
        isOpen={modalTextActive}
        onClose={() => setModalTextActive(false)}
        onAddText={addTextElement}
      />

      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() => {
          setUploadModalOpen(false);
          setUploadData(null);
        }}
        uploadData={uploadData}
      />
    </div>
  );
}
