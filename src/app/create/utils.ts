import { useModal } from '../_context/ModalContext';

export function drawImageOnCanvas(
  ctx: CanvasRenderingContext2D,
  src: string,
  element: HTMLElement,
  finalWidth?: number,
  finalHeight?: number,
  originalCanvasWidth?: number,
  originalCanvasHeight?: number,
  createBoxRef?: React.RefObject<HTMLDivElement | null>,
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
          // targetImg의 경우 createBoxRef를 부모로 사용, 그 외에는 element.parentElement 사용
          const parentRect =
            createBoxRef?.current?.getBoundingClientRect() ||
            element.parentElement?.getBoundingClientRect();

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
          let x = currentRect.left - parentRect.left;
          let y = currentRect.top - parentRect.top;

          // targetImg의 경우 createBoxRef의 border를 고려
          if (createBoxRef) {
            x -= 2; // 좌측 border 2px
            y -= 2; // 상단 border 2px
          }

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

export const convertSvgToImage = (
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

export const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

export const downloadClickHandler = async (
  image: string | null,
  childrenArray: HTMLCollection | undefined,
  createBoxRef: React.RefObject<HTMLDivElement | null>,
  targetRef: React.RefObject<HTMLImageElement | null>,
  showModal: ReturnType<typeof useModal>['showModal'],
) => {
  try {
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

    // border 2px 제외
    const originalWidth = creatBoxBoundingBox.width - 4; // 좌우 border 2px씩
    const originalHeight = creatBoxBoundingBox.height - 4; // 상하 border 2px씩

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
        createBoxRef,
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
          createBoxRef,
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

export const saveClickHandler = async (
  image: string | null,
  childrenArray: HTMLCollection | undefined,
  createBoxRef: React.RefObject<HTMLDivElement | null>,
  targetRef: React.RefObject<HTMLImageElement | null>,
  moveableElementImg: string[],
  showModal: ReturnType<typeof useModal>['showModal'],
  setUploadData: (
    data: {
      imageData: string;
      originalImage: string;
      stickers: string[];
    } | null,
  ) => void,
  setUploadModalOpen: (open: boolean) => void,
) => {
  try {
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

    // border 2px 제외
    const originalWidth = creatBoxBoundingBox.width - 4; // 좌우 border 2px씩
    const originalHeight = creatBoxBoundingBox.height - 4; // 상하 border 2px씩

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
        createBoxRef,
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
          createBoxRef,
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
