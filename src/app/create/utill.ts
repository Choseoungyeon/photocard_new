import React from 'react';

export function drawImageOnCanvas(
  ctx: CanvasRenderingContext2D,
  src: string,
  element: HTMLElement,
  createBoxRef: React.RefObject<HTMLDivElement | null>,
) {
  const image = new window.Image();
  image.crossOrigin = 'anonymous';
  image.src = src;

  image.onload = () => {
    ctx.save();

    const computedStyle = window.getComputedStyle(element);
    const transform = computedStyle.transform;

    const originalTransform = element.style.transform;
    element.style.transform = 'none';

    const originalRect = element.getBoundingClientRect();
    const parentRect = createBoxRef.current?.getBoundingClientRect();

    element.style.transform = originalTransform;

    if (!parentRect) return;

    const originalWidth = originalRect.width;
    const originalHeight = originalRect.height;

    const currentRect = element.getBoundingClientRect();
    const x = currentRect.left - parentRect.left;
    const y = currentRect.top - parentRect.top;

    if (transform && transform !== 'none') {
      const match = transform.match(/matrix\(([^)]+)\)/);
      if (match) {
        const values = match[1].split(',').map(Number);
        const [a, b, c, d] = values;

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
      ctx.drawImage(image, x, y, originalWidth, originalHeight);
    }

    ctx.restore();
  };
}

export function downloadClickHandler(
  createBoxRef: React.RefObject<HTMLDivElement | null>,
  elementWrapRef: React.RefObject<HTMLDivElement | null>,
  targetRef: React.RefObject<HTMLImageElement | null>,
  image: string | null,
  moveableElementImg: string[],
  drawImageOnCanvasFn: (
    ctx: CanvasRenderingContext2D,
    src: string,
    element: HTMLElement,
    createBoxRef: React.RefObject<HTMLDivElement | null>,
  ) => void,
) {
  const childrenArray = elementWrapRef.current?.children;
  const creatBoxBoundingBox = createBoxRef.current?.getBoundingClientRect();
  const targetImg = targetRef.current;

  if (creatBoxBoundingBox) {
    const canvas = document.createElement('canvas');
    canvas.width = creatBoxBoundingBox.width;
    canvas.height = creatBoxBoundingBox.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

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

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (targetImg && image) {
      drawImageOnCanvasFn(ctx, image, targetImg, createBoxRef);
    }

    if (childrenArray && childrenArray.length > 0) {
      Array.from(childrenArray).forEach((item) => {
        const imgTag = (item as HTMLElement).querySelector('img');
        if (!imgTag) return;
        const src = imgTag.getAttribute('src');
        if (!src) return;

        drawImageOnCanvasFn(ctx, src, item as HTMLElement, createBoxRef);
      });
    }

    setTimeout(() => {
      const link = document.createElement('a');
      link.download = 'photocard.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }, 500);
  }
}
