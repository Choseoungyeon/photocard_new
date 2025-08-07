'use client';
import React from 'react';
import Dropzone from 'react-dropzone';
import clsx from 'clsx';
import Moveable, { OnDrag, OnResize, OnScale, OnRotate } from 'react-moveable';
import { LuImagePlus, LuPlus } from 'react-icons/lu';
import { LuImage, LuArrowDownToLine, LuSticker } from 'react-icons/lu';
import { FaRibbon } from 'react-icons/fa';
import Modal from './_component/modal';
import '@/app/style/page/create.scss';
import { useMutation } from '@tanstack/react-query';
import customFetch from '@/app/_hook/customFetch';

function Create() {
  const [image, setImage] = React.useState<string | null>(null);
  const [menuActive, setMenuActive] = React.useState(false);
  const [moveableTarget, setMoveableTarget] = React.useState<HTMLElement[]>([]);
  const [moveableElementImg, setMoveableElementImg] = React.useState<string[]>([]);
  const [modalRibbonActive, setModalRibbonActive] = React.useState(false);
  const [modalStickerActive, setModalStickerActive] = React.useState(false);
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
      if (imageUrl) setImage(imageUrl);
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

  function drawImageOnCanvas(ctx: CanvasRenderingContext2D, src: string, element: HTMLElement) {
    const image = new window.Image();
    image.crossOrigin = 'anonymous';
    image.src = src;

    image.onload = () => {
      ctx.save();

      // element의 원본 크기 구하기 (transform 적용 전)
      const computedStyle = window.getComputedStyle(element);
      const transform = computedStyle.transform;

      // transform을 임시로 제거하여 원본 크기 구하기
      const originalTransform = element.style.transform;
      element.style.transform = 'none';

      const originalRect = element.getBoundingClientRect();
      const parentRect = createBoxRef.current?.getBoundingClientRect();

      // 원래 transform 복원
      element.style.transform = originalTransform;

      if (!parentRect) return;

      const originalWidth = originalRect.width;
      const originalHeight = originalRect.height;

      // 현재 transform이 적용된 위치
      const currentRect = element.getBoundingClientRect();
      const x = currentRect.left - parentRect.left;
      const y = currentRect.top - parentRect.top;

      if (transform && transform !== 'none' && !transform.includes('rotate')) {
        const match = transform.match(/matrix\(([^)]+)\)/);
        if (match) {
          const values = match[1].split(',').map(Number);
          const [a, b, c, d] = values;

          // 회전 각도만 추출
          const angle = Math.atan2(b, a);

          ctx.translate(x + currentRect.width / 2, y + currentRect.height / 2);
          ctx.rotate(angle);
          ctx.drawImage(
            image,
            -originalWidth / 2,
            -originalHeight / 2,
            originalWidth,
            originalHeight,
          );
        }
      } else {
        // transform이 없는 경우
        console.log('no rotate', originalWidth, originalHeight);
        ctx.drawImage(image, x, y, originalWidth, originalHeight);
      }

      ctx.restore();
    };
  }

  const downloadClickHandler = () => {
    const childrenArray = elementWrapRef.current?.children;
    const creatBoxBoundingBox = createBoxRef.current?.getBoundingClientRect();
    const targetImg = targetRef.current;

    if (creatBoxBoundingBox) {
      const canvas = document.createElement('canvas');
      const originalWidth = creatBoxBoundingBox.width;
      const originalHeight = creatBoxBoundingBox.height;
      canvas.width = originalWidth;
      canvas.height = originalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 둥근 모서리 클리핑 적용 (8px radius)
      const radius = 8;
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

      // 클리핑 영역에 하얀색 배경 설정
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (targetImg && image) {
        drawImageOnCanvas(ctx, image, targetImg);
      }

      if (childrenArray && childrenArray.length > 0) {
        Array.from(childrenArray).forEach((item) => {
          if (!item) return;
          const src = item.getAttribute('src');
          if (!src) return;

          drawImageOnCanvas(ctx, src, item as HTMLElement);
        });
      }

      // 새로운 캔버스 크기
      const newWidth = 360;
      const newHeight = 500;

      // 스케일 비율 계산
      const scaleX = newWidth / originalWidth;
      const scaleY = newHeight / originalHeight;

      if (scaleX > 1 || scaleY > 1) {
        // 캔버스 크기 변경
        canvas.width = newWidth;
        canvas.height = newHeight;

        // 스케일 적용
        ctx.scale(scaleX, scaleY);
      }

      setTimeout(() => {
        const link = document.createElement('a');
        link.download = 'photocard.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      }, 500);
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
      setStickerImageList(res.result.images);
    },
  });

  const ribbonMutation = useMutation({
    mutationFn: () => getImagePhoto('Ribbon'),
    onSuccess: (res) => {
      setRibbonImageList(res.result.images);
    },
  });

  const onClickStickerHandler = async () => {
    setModalStickerActive(true);
    setModalClick({ sticker: true, ribbon: false });
    // if (!stickerMutation.isPending) stickerMutation.mutate();
  };

  const onClickRibbonHandler = async () => {
    setModalRibbonActive(true);
    setModalClick({ sticker: false, ribbon: true });
    // if (!ribbonMutation.isPending) ribbonMutation.mutate();
  };

  React.useEffect(() => {
    if (targetRef.current) {
      setMoveableTarget([targetRef.current]);
    } else {
      setMoveableTarget([]);
    }
  }, [image]);

  const [modalClick, setModalClick] = React.useState({
    sticker: false,
    ribbon: false,
  });

  return (
    <div className="create_page" onClick={blurHandler}>
      <div className="create_box_wrap">
        <div className="create_box" ref={createBoxRef}>
          {image ? (
            <div className="create_box_image" onClick={moveableTargetClickHandler}>
              <img src={image} alt="uploaded_image" ref={targetRef} />
            </div>
          ) : (
            <Dropzone onDrop={dropHandler}>
              {({ getRootProps, getInputProps }) => (
                <div className="create_box_icon_wrap" {...getRootProps()}>
                  <input {...getInputProps()} />
                  <i className="create_box_icon">
                    <LuImagePlus />
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
              <LuPlus />
            </i>
          </span>
          {menuActive ? (
            <>
              <span className="create_box_menu_item">
                <i className="create_box_menu_icon">
                  <LuImage />
                </i>
              </span>
              <span className="create_box_menu_item" onClick={onClickRibbonHandler}>
                <i className="create_box_menu_icon">
                  <FaRibbon />
                </i>
              </span>
              <span className="create_box_menu_item" onClick={onClickStickerHandler}>
                <i className="create_box_menu_icon">
                  <LuSticker />
                </i>
              </span>
              <span className="create_box_menu_item" onClick={downloadClickHandler}>
                <i className="create_box_menu_icon">
                  <LuArrowDownToLine />
                </i>
              </span>
            </>
          ) : null}
        </div>
      </div>

      <Modal
        className={clsx({ ['is-active']: modalClick.sticker })}
        onClick={() => {
          setModalClick({ sticker: true, ribbon: false });
        }}
        elementClick={(val) => {
          setMoveableElementImg([...moveableElementImg, val]);
        }}
        imageList={stickerImageList}
        open={modalStickerActive}
        onClose={() => setModalStickerActive(false)}
      />

      <Modal
        className={clsx({ ['is-active']: modalClick.ribbon })}
        onClick={() => {
          setModalClick({ sticker: false, ribbon: true });
        }}
        elementClick={(val) => {
          setMoveableElementImg([...moveableElementImg, val]);
        }}
        imageList={ribbonImageList}
        open={modalRibbonActive}
        onClose={() => setModalRibbonActive(false)}
      />
    </div>
  );
}

export default Create;
