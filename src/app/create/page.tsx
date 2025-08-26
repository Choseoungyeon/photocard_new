'use client';
import React from 'react';
import Dropzone from 'react-dropzone';
import clsx from 'clsx';
import Moveable, { OnDrag, OnResize, OnScale, OnRotate } from 'react-moveable';
import { FiUpload, FiPlus, FiImage, FiDownload, FiSmile, FiGift, FiSave } from 'react-icons/fi';
import { useModal } from '../_context/ModalContext';
import Modal from '../_component/Modal';
import UploadModal from '../_component/UploadModal';
import '@/app/style/page/create.scss';
import { useMutation } from '@tanstack/react-query';
import customFetch from '@/app/_hook/customFetch';

function Create() {
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
  const [stickerImageList, setStickerImageList] = React.useState<
    { public_id: string; url: string }[]
  >([]);
  const [ribbonImageList, setRibbonImageList] = React.useState<
    { public_id: string; url: string }[]
  >([]);

  const createBoxRef = React.useRef<HTMLDivElement>(null);
  const targetRef = React.useRef<HTMLImageElement | null>(null);
  const elementWrapRef = React.useRef<HTMLDivElement>(null);

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

  function drawImageOnCanvas(
    ctx: CanvasRenderingContext2D,
    src: string,
    element: HTMLElement,
    finalWidth?: number,
    finalHeight?: number,
    originalCanvasWidth?: number,
    originalCanvasHeight?: number,
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        const isSvg = src.toLowerCase().includes('.svg') || src.startsWith('data:image/svg+xml');

        let imageSrc = src;
        if (isSvg) {
          imageSrc = await convertSvgToImage(src, finalWidth, finalHeight);
        }

        const image = new window.Image();
        image.crossOrigin = 'anonymous';

        image.onload = () => {
          try {
            ctx.save();

            const computedStyle = window.getComputedStyle(element);
            const transform = computedStyle.transform;

            const originalTransform = element.style.transform;
            element.style.transform = 'none';

            const originalRect = element.getBoundingClientRect();
            const parentRect = createBoxRef.current?.getBoundingClientRect();

            element.style.transform = originalTransform;

            if (!parentRect) {
              ctx.restore();
              resolve();
              return;
            }

            const displayWidth = originalRect.width;
            const displayHeight = originalRect.height;

            const imageWidth = image.naturalWidth;
            const imageHeight = image.naturalHeight;

            const currentRect = element.getBoundingClientRect();
            const x = currentRect.left - parentRect.left;
            const y = currentRect.top - parentRect.top;

            let scaledX = x;
            let scaledY = y;
            let scaledWidth = displayWidth;
            let scaledHeight = displayHeight;

            if (finalWidth && finalHeight && originalCanvasWidth && originalCanvasHeight) {
              const scaleX = finalWidth / originalCanvasWidth;
              const scaleY = finalHeight / originalCanvasHeight;

              scaledX = x * scaleX;
              scaledY = y * scaleY;
              scaledWidth = displayWidth * scaleX;
              scaledHeight = displayHeight * scaleY;
            }

            if (transform && transform !== 'none' && !transform.includes('rotate')) {
              const match = transform.match(/matrix\(([^)]+)\)/);
              if (match) {
                const values = match[1].split(',').map(Number);
                const [a, b, c, d] = values;

                const angle = Math.atan2(b, a);

                const currentCenterX = x + currentRect.width / 2;
                const currentCenterY = y + currentRect.height / 2;

                if (finalWidth && finalHeight && originalCanvasWidth && originalCanvasHeight) {
                  const scaledCenterX = currentCenterX * (finalWidth / originalCanvasWidth);
                  const scaledCenterY = currentCenterY * (finalHeight / originalCanvasHeight);
                  ctx.translate(scaledCenterX, scaledCenterY);
                } else {
                  ctx.translate(currentCenterX, currentCenterY);
                }
                ctx.rotate(angle);

                ctx.drawImage(
                  image,
                  0,
                  0,
                  imageWidth,
                  imageHeight,
                  -scaledWidth / 2,
                  -scaledHeight / 2,
                  scaledWidth,
                  scaledHeight,
                );
              }
            } else {
              ctx.drawImage(
                image,
                0,
                0,
                imageWidth,
                imageHeight,
                scaledX,
                scaledY,
                scaledWidth,
                scaledHeight,
              );
            }

            ctx.restore();
            resolve();
          } catch (error) {
            reject(error);
          }
        };

        image.onerror = () => {
          reject(new Error('이미지 로딩 실패'));
        };

        image.src = imageSrc;
      } catch (error) {
        reject(error);
      }
    });
  }

  const convertSvgToImage = (
    svgUrl: string,
    finalWidth?: number,
    finalHeight?: number,
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      fetch(svgUrl)
        .then((response) => response.text())
        .then((svgText) => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('캔버스 컨텍스트를 생성할 수 없습니다.'));
            return;
          }

          const img = new Image();
          const svgBlob = new Blob([svgText], { type: 'image/svg+xml' });
          const url = URL.createObjectURL(svgBlob);

          img.onload = () => {
            if (finalWidth && finalHeight) {
              const scaleX = finalWidth / img.width;
              const scaleY = finalHeight / img.height;
              const scale = Math.max(scaleX, scaleY);

              canvas.width = img.width * scale;
              canvas.height = img.height * scale;
            } else {
              canvas.width = img.width;
              canvas.height = img.height;
            }

            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/png');
            URL.revokeObjectURL(url);
            resolve(dataUrl);
          };

          img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('SVG를 이미지로 변환할 수 없습니다.'));
          };

          img.src = url;
        })
        .catch(reject);
    });
  };

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  };

  const downloadClickHandler = async () => {
    try {
      const childrenArray = elementWrapRef.current?.children;
      const creatBoxBoundingBox = createBoxRef.current?.getBoundingClientRect();
      const targetImg = targetRef.current;

      if (!creatBoxBoundingBox) return;
      if (!image) {
        showModal({
          type: 'error',
          title: '오류',
          message: '이미지를 먼저 추가해주세요.',
          confirmText: '확인',
        });
        return;
      }

      const mainImage = await loadImage(image);

      const maxHeight = 2000;
      const ratio = 360 / 500;
      let finalHeight = Math.min(mainImage.naturalHeight, maxHeight);
      let finalWidth = finalHeight * ratio;

      const maxPixels = 2000000;
      if (finalWidth * finalHeight > maxPixels) {
        const currentRatio = finalWidth / finalHeight;
        finalHeight = Math.sqrt(maxPixels / currentRatio);
        finalWidth = finalHeight * currentRatio;
      }

      const canvas = document.createElement('canvas');
      const originalWidth = creatBoxBoundingBox.width;
      const originalHeight = creatBoxBoundingBox.height;
      canvas.width = finalWidth;
      canvas.height = finalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const radius = 8 * (finalWidth / originalWidth);
      ctx.beginPath();
      ctx.moveTo(radius, 0);
      ctx.lineTo(canvas.width - radius, 0);
      ctx.quadraticCurveTo(canvas.width, 0, canvas.width, radius);
      ctx.lineTo(canvas.width, canvas.height - radius);
      ctx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - radius, canvas.height);
      ctx.lineTo(radius, canvas.height);
      ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - radius);
      ctx.lineTo(0, radius);
      ctx.quadraticCurveTo(0, 0, radius, 0);
      ctx.closePath();
      ctx.clip();

      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (targetImg && image) {
        await drawImageOnCanvas(
          ctx,
          image,
          targetImg,
          finalWidth,
          finalHeight,
          originalWidth,
          originalHeight,
        );
      }

      if (childrenArray && childrenArray.length > 0) {
        for (const item of Array.from(childrenArray)) {
          if (!item) continue;
          const src = item.getAttribute('src');
          if (!src) continue;

          await drawImageOnCanvas(
            ctx,
            src,
            item as HTMLElement,
            finalWidth,
            finalHeight,
            originalWidth,
            originalHeight,
          );
        }
      }

      canvas.toBlob((blob) => {
        if (!blob) {
          alert('이미지 생성에 실패했습니다.');
          return;
        }

        const blobUrl = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = 'photocard.png';
        link.href = blobUrl;
        link.click();

        URL.revokeObjectURL(blobUrl);
      }, 'image/png');
    } catch (error) {
      console.error('다운로드 중 오류 발생:', error);
      alert('다운로드 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const getImagePhoto = async (type: 'Sticker' | 'Ribbon') => {
    const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/image/${type}`;
    const res = await customFetch.get(url);

    return res;
  };

  const stickerMutation = useMutation({
    mutationFn: () => getImagePhoto('Sticker'),
    onSuccess: (res) => {
      setStickerImageList(res.data.images);
    },
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
    onSuccess: (res) => {
      setRibbonImageList(res.data.images);
    },
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
    setIsLoadingImages(true);

    try {
      if (!stickerMutation.isPending) {
        await stickerMutation.mutateAsync();
      }

      if (stickerImageList.length > 0) {
        await waitForImagesToLoad(stickerImageList);
      }

      setModalStickerActive(true);
    } catch (error) {
      console.error('스티커 로딩 중 오류:', error);
    } finally {
      setIsLoadingImages(false);
    }
  };

  const onClickRibbonHandler = async () => {
    setIsLoadingImages(true);

    try {
      if (!ribbonMutation.isPending) {
        await ribbonMutation.mutateAsync();
      }

      if (ribbonImageList.length > 0) {
        await waitForImagesToLoad(ribbonImageList);
      }

      setModalRibbonActive(true);
    } catch (error) {
      console.error('리본 로딩 중 오류:', error);
    } finally {
      setIsLoadingImages(false);
    }
  };

  const [imageLoaded, setImageLoaded] = React.useState(false);

  const changeImageHandler = () => {
    if (image) {
      setImage(null);
      setMoveableElementImg([]);
      setMoveableTarget([]);
    }
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
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

  const [isLoadingImages, setIsLoadingImages] = React.useState(false);

  const saveClickHandler = async () => {
    try {
      const childrenArray = elementWrapRef.current?.children;
      const creatBoxBoundingBox = createBoxRef.current?.getBoundingClientRect();
      const targetImg = targetRef.current;

      if (!creatBoxBoundingBox) return;
      if (!image) {
        showModal({
          type: 'error',
          title: '오류',
          message: '이미지를 먼저 추가해주세요.',
          confirmText: '확인',
        });
        return;
      }

      const mainImage = await loadImage(image);

      const maxHeight = 2000;
      const ratio = 360 / 500;
      let finalHeight = Math.min(mainImage.naturalHeight, maxHeight);
      let finalWidth = finalHeight * ratio;

      const maxPixels = 2000000;
      if (finalWidth * finalHeight > maxPixels) {
        const currentRatio = finalWidth / finalHeight;
        finalHeight = Math.sqrt(maxPixels / currentRatio);
        finalWidth = finalHeight * currentRatio;
      }

      const canvas = document.createElement('canvas');
      const originalWidth = creatBoxBoundingBox.width;
      const originalHeight = creatBoxBoundingBox.height;
      canvas.width = finalWidth;
      canvas.height = finalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const radius = 8 * (finalWidth / originalWidth);
      ctx.beginPath();
      ctx.moveTo(radius, 0);
      ctx.lineTo(canvas.width - radius, 0);
      ctx.quadraticCurveTo(canvas.width, 0, canvas.width, radius);
      ctx.lineTo(canvas.width, canvas.height - radius);
      ctx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - radius, canvas.height);
      ctx.lineTo(radius, canvas.height);
      ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - radius);
      ctx.lineTo(0, radius);
      ctx.quadraticCurveTo(0, 0, radius, 0);
      ctx.closePath();
      ctx.clip();

      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (targetImg && image) {
        await drawImageOnCanvas(
          ctx,
          image,
          targetImg,
          finalWidth,
          finalHeight,
          originalWidth,
          originalHeight,
        );
      }

      if (childrenArray && childrenArray.length > 0) {
        for (const item of Array.from(childrenArray)) {
          if (!item) continue;
          const src = item.getAttribute('src');
          if (!src) continue;

          await drawImageOnCanvas(
            ctx,
            src,
            item as HTMLElement,
            finalWidth,
            finalHeight,
            originalWidth,
            originalHeight,
          );
        }
      }

      canvas.toBlob((blob) => {
        if (!blob) {
          showModal({
            type: 'error',
            title: '오류',
            message: '이미지 생성에 실패했습니다.',
            confirmText: '확인',
          });
          return;
        }

        const imageUrl = URL.createObjectURL(blob);

        const newUploadData = {
          imageData: imageUrl,
          originalImage: image,
          stickers: moveableElementImg,
        };

        setUploadData(newUploadData);
        setUploadModalOpen(true);
      }, 'image/png');
    } catch (error) {
      console.error('이미지 생성 오류:', error);
      showModal({
        type: 'error',
        title: '오류',
        message: '이미지 생성 중 오류가 발생했습니다.',
        confirmText: '확인',
      });
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
                  'is-loading': isLoadingImages,
                })}
                onClick={onClickRibbonHandler}
                style={{
                  pointerEvents: isLoadingImages ? 'none' : 'auto',
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
              <span className="create_box_menu_item" onClick={downloadClickHandler}>
                <i className="create_box_menu_icon">
                  <FiDownload />
                </i>
              </span>
              <span className="create_box_menu_item" onClick={saveClickHandler}>
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

export default Create;
