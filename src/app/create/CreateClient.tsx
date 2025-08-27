'use client';
import React from 'react';
import Dropzone from 'react-dropzone';
import clsx from 'clsx';
import Moveable, { OnDrag, OnResize, OnRotate } from 'react-moveable';
import { FiUpload, FiPlus, FiImage, FiDownload, FiSmile, FiGift, FiSave } from 'react-icons/fi';
import { useModal } from '../_context/ModalContext';
import Modal from '../_component/Modal';
import UploadModal from '../_component/UploadModal';
import { downloadClickHandler, saveClickHandler } from './utils';
import '@/app/style/page/create.scss';
import { useQuery, useMutation } from '@tanstack/react-query';
import customFetch from '@/app/_hook/customFetch';

export default function CreateClient() {
  const { showModal } = useModal();
  const [image, setImage] = React.useState<string | null>(null);
  const [menuActive, setMenuActive] = React.useState(false);
  const [moveableTarget, setMoveableTarget] = React.useState<HTMLElement[]>([]);
  const [moveableElementImg, setMoveableElementImg] = React.useState<string[]>([]);
  const [modalRibbonActive, setModalRibbonActive] = React.useState(false);
  const [modalStickerActive, setModalStickerActive] = React.useState(false);
  const [uploadModalOpen, setUploadModalOpen] = React.useState(false);
  const [uploadData, setUploadData] = React.useState<{
    imageData: string;
    originalImage: string;
    stickers: string[];
  } | null>(null);

  const createBoxRef = React.useRef<HTMLDivElement>(null);
  const targetRef = React.useRef<HTMLImageElement | null>(null);
  const elementWrapRef = React.useRef<HTMLDivElement>(null);

  const getImagePhoto = async (type: 'Sticker' | 'Ribbon') => {
    const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/image/${type}`;
    const res = await customFetch.get(url);
    return res.data.images;
  };

  // TanStack Query를 사용하여 서버에서 prefetch한 데이터 사용
  const { data: stickerImageList = [] } = useQuery({
    queryKey: ['sticker-images'],
    queryFn: () => getImagePhoto('Sticker'),
    staleTime: 5 * 60 * 1000, // 5분
  });

  const { data: ribbonImageList = [] } = useQuery({
    queryKey: ['ribbon-images'],
    queryFn: () => getImagePhoto('Ribbon'),
    staleTime: 5 * 60 * 1000, // 5분
  });

  // Fallback용 mutations
  const stickerMutation = useMutation({
    mutationFn: () => getImagePhoto('Sticker'),
    onError: (error: any) => {
      console.log('스티커 이미지 로딩 실패:', error);
      showModal({
        type: 'error',
        title: '오류',
        message: error.message || '스티커 이미지 로딩 실패',
        confirmText: '확인',
      });
    },
  });

  const ribbonMutation = useMutation({
    mutationFn: () => getImagePhoto('Ribbon'),
    onError: (error: any) => {
      console.log('리본 이미지 로딩 실패:', error);
      showModal({
        type: 'error',
        title: '오류',
        message: error.message || '리본 이미지 로딩 실패',
        confirmText: '확인',
      });
    },
  });

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
    }
  };

  const handleDownload = () => {
    const childrenArray = elementWrapRef.current?.children;
    downloadClickHandler(image, childrenArray, createBoxRef, targetRef, showModal);
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

  const onClickStickerHandler = async () => {
    try {
      let currentStickerList = stickerImageList;

      if (stickerImageList.length === 0) {
        const result = await stickerMutation.mutateAsync();
        currentStickerList = result;
      }

      if (currentStickerList.length > 0) {
        setIsLoadingImages(true);
        await waitForImagesToLoad(currentStickerList);
      }

      setModalStickerActive(true);
    } catch (error) {
      console.error('스티커 로딩 중 오류:', error);
    } finally {
      setIsLoadingImages(false);
    }
  };

  const onClickRibbonHandler = async () => {
    try {
      let currentRibbonList = ribbonImageList;
      if (ribbonImageList.length === 0) {
        const result = await ribbonMutation.mutateAsync();
        currentRibbonList = result;
      }

      if (currentRibbonList.length > 0) {
        setIsLoadingImages(true);
        await waitForImagesToLoad(currentRibbonList);
      }

      setModalRibbonActive(true);
    } catch (error) {
      console.error('리본 로딩 중 오류:', error);
    } finally {
      setIsLoadingImages(false);
    }
  };

  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [isLoadingImages, setIsLoadingImages] = React.useState(false);

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
      showModal,
      setUploadData,
      setUploadModalOpen,
    );
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
          <Moveable
            target={moveableTarget}
            className="create_box_moveable"
            container={null}
            origin={true}
            edge={false}
            draggable={true}
            throttleDrag={0}
            onDrag={({ target, transform }: OnDrag) => {
              target!.style.transform = transform;
            }}
            keepRatio={true}
            resizable={true}
            throttleResize={0}
            onResize={({ target, width, height, delta }: OnResize) => {
              if (delta[0]) target!.style.width = `${width}px`;
              if (delta[1]) target!.style.height = `${height}px`;
            }}
            rotatable={true}
            throttleRotate={0}
            onRotate={({ target, transform }: OnRotate) => {
              target!.style.transform = transform;
            }}
            pinchable={true}
            pinchThreshold={0}
            pinchOutside={true}
            preventDefault={true}
          />
          <div className="create_box_element_wrap" ref={elementWrapRef}>
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
                  'is-loading': ribbonMutation.isPending || isLoadingImages,
                })}
                onClick={onClickRibbonHandler}
                style={{
                  pointerEvents: ribbonMutation.isPending || isLoadingImages ? 'none' : 'auto',
                }}
              >
                <i className="create_box_menu_icon">
                  <FiGift />
                </i>
              </span>
              <span
                className={clsx('create_box_menu_item', {
                  'is-loading': stickerMutation.isPending || isLoadingImages,
                })}
                onClick={onClickStickerHandler}
                style={{
                  pointerEvents: stickerMutation.isPending || isLoadingImages ? 'none' : 'auto',
                }}
              >
                <i className="create_box_menu_icon">
                  <FiSmile />
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

      <Modal
        open={modalStickerActive}
        type="custom"
        title="스티커"
        closeButton={true}
        imageList={stickerImageList}
        elementClick={(val: string) => {
          setMoveableElementImg([...moveableElementImg, val]);
        }}
        onClose={() => setModalStickerActive(false)}
        resizable={true}
        draggable={true}
      />

      <Modal
        open={modalRibbonActive}
        type="custom"
        title="리본"
        closeButton={true}
        imageList={ribbonImageList}
        elementClick={(val: string) => {
          setMoveableElementImg([...moveableElementImg, val]);
        }}
        onClose={() => setModalRibbonActive(false)}
        resizable={true}
        draggable={true}
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
