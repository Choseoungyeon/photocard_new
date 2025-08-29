'use client';
import React from 'react';
import Moveable, { OnDrag, OnResize, OnRotate, OnRender } from 'react-moveable';
import { TextElement, TextElementSize } from '../types';

interface MoveableComponentProps {
  moveableTarget: HTMLElement[];
  isRotating: boolean;
  setIsRotating: (isRotating: boolean) => void;
  textElementSizes: Record<string, TextElementSize>;
  setTextElements: React.Dispatch<React.SetStateAction<TextElement[]>>;
}

export default function MoveableComponent({
  moveableTarget,
  isRotating,
  setIsRotating,
  textElementSizes,
  setTextElements,
}: MoveableComponentProps) {
  // 핸들 크기 계산 함수
  const getHandleSize = (element: HTMLElement | SVGElement) => {
    const rect = element.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // 요소의 크기에 따라 핸들 크기 조정
    const minSize = Math.min(width, height);

    if (minSize < 30) {
      return 6; // 매우 작은 요소
    } else if (minSize < 60) {
      return 8; // 작은 요소
    } else if (minSize < 100) {
      return 10; // 중간 요소
    } else {
      return 12; // 큰 요소 (기본값)
    }
  };

  // 핸들 크기 조정 함수
  const adjustHandleSize = (target: HTMLElement | SVGElement) => {
    const moveableElement = document.querySelector('.create_box_moveable');
    if (moveableElement) {
      const handleSize = getHandleSize(target);
      const controls = moveableElement.querySelectorAll('.moveable-control');
      controls.forEach((control) => {
        const element = control as HTMLElement;
        element.style.width = `${handleSize}px`;
        element.style.height = `${handleSize}px`;

        // 크기에 따른 클래스 추가
        element.classList.remove('small-handle', 'medium-handle', 'large-handle', 'default-handle');
        if (handleSize <= 6) {
          element.classList.add('small-handle');
        } else if (handleSize <= 8) {
          element.classList.add('medium-handle');
        } else if (handleSize <= 10) {
          element.classList.add('large-handle');
        } else {
          element.classList.add('default-handle');
        }
      });
    }
  };

  const handleDrag = ({ target, transform }: OnDrag) => {
    target!.style.transform = transform;
  };

  const handleResize = ({ target, width, height, delta }: OnResize) => {
    if (delta[0]) target!.style.width = `${width}px`;
    if (delta[1]) target!.style.height = `${height}px`;

    if (target!.classList.contains('create_box_text_element')) {
      const textId = target!.getAttribute('data-text-id');
      if (textId) {
        const initialSize = textElementSizes[textId];
        if (initialSize) {
          const widthRatio = width / initialSize.width;
          const heightRatio = height / initialSize.height;
          const scaleRatio = Math.min(widthRatio, heightRatio);
          const newFontSize = Math.round(initialSize.fontSize * scaleRatio);

          if (newFontSize < 12) {
            const minScaleRatio = 12 / initialSize.fontSize;
            const adjustedWidth = Math.round(initialSize.width * minScaleRatio);
            const adjustedHeight = Math.round(initialSize.height * minScaleRatio);

            target!.style.width = `${adjustedWidth}px`;
            target!.style.height = `${adjustedHeight}px`;

            setTextElements((prev) =>
              prev.map((textElement) => {
                if (textElement.id === textId) {
                  return {
                    ...textElement,
                    fontSize: 12,
                  };
                }
                return textElement;
              }),
            );
          } else {
            setTextElements((prev) =>
              prev.map((textElement) => {
                if (textElement.id === textId) {
                  return {
                    ...textElement,
                    fontSize: newFontSize,
                  };
                }
                return textElement;
              }),
            );
          }
        }
      }
    }
  };

  const handleRotate = ({ target, transform }: OnRotate) => {
    target!.style.transform = transform;
  };

  const handleRender = ({ target }: OnRender) => {
    if (isRotating) return;
    adjustHandleSize(target);
  };

  React.useEffect(() => {
    if (moveableTarget.length > 0) {
      adjustHandleSize(moveableTarget[0]);
    }
  }, [moveableTarget]);

  return (
    <Moveable
      target={moveableTarget}
      className="create_box_moveable"
      draggable={true}
      onDrag={handleDrag}
      keepRatio={true}
      resizable={true}
      onResize={handleResize}
      rotatable={true}
      onRotate={handleRotate}
      onRotateStart={() => setIsRotating(true)}
      onRotateEnd={() => setIsRotating(false)}
      pinchable={true}
      pinchThreshold={0}
      pinchOutside={true}
      onRender={handleRender}
    />
  );
}
