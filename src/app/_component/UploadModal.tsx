'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { FiArrowLeft, FiUpload, FiX } from 'react-icons/fi';
import Input from '@/app/_component/Input';
import Button from '@/app/_component/Button';
import customFetch from '@/app/_hook/customFetch';
import '@/app/style/page/upload.scss';

type FormValues = {
  title: string;
  content: string;
};

interface UploadData {
  imageData: string;
  originalImage: string;
  stickers: string[];
}

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  uploadData: UploadData | null;
  // 편집 모드용 props
  isEditMode?: boolean;
  photocardId?: string;
  initialTitle?: string;
  initialContent?: string;
  onEditComplete?: (updatedData: any) => void;
}

function UploadModal({
  isOpen,
  onClose,
  uploadData,
  isEditMode = false,
  photocardId,
  initialTitle = '',
  initialContent = '',
  onEditComplete,
}: UploadModalProps) {
  const { data: session } = useSession();
  const [generalError, setGeneralError] = React.useState('');

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      title: initialTitle,
      content: initialContent,
    },
    mode: 'onChange',
  });

  const titleValue = watch('title');
  const contentValue = watch('content');

  // 업로드 데이터가 변경될 때마다 초기화
  React.useEffect(() => {
    if (uploadData) {
      reset({
        title: initialTitle,
        content: initialContent,
      });
      setGeneralError('');
    }
  }, [uploadData, reset, initialTitle, initialContent]);

  // 포토카드 업로드/수정 함수
  const uploadPhotocard = async (data: FormValues) => {
    if (!session?.user?.email) {
      throw new Error('사용자 정보를 찾을 수 없습니다.');
    }

    if (isEditMode) {
      // 편집 모드: PUT 요청으로 수정
      const editUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/photocard/${photocardId}`;
      const result = await customFetch.put(editUrl, {
        body: {
          title: data.title,
          content: data.content,
        },
      });

      // API 응답에서 photocard 데이터 반환
      return result.data.photocard;
    } else {
      // 업로드 모드: POST 요청으로 새로 생성
      if (!uploadData?.imageData) {
        throw new Error('이미지가 없습니다.');
      }

      // 이미지 데이터를 Blob으로 변환
      const response = await fetch(uploadData.imageData);
      const blob = await response.blob();

      // FormData 생성
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('content', data.content);
      formData.append('image', blob, 'photocard.png');

      // customFetch를 사용한 API 호출
      const uploadUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/photocard/save-formdata`;
      const result = await customFetch.post(uploadUrl, {
        body: formData,
      });

      return result;
    }
  };

  // 업로드 mutation
  const uploadMutation = useMutation({
    mutationFn: uploadPhotocard,
    onSuccess: (data) => {
      // 성공 시 모달 닫기
      onClose();

      // 편집 모드인 경우 콜백 호출
      if (isEditMode && onEditComplete) {
        onEditComplete(data);
      }
    },
    onError: (error) => {
      console.error('업로드 오류:', error);
      setGeneralError(error.message || '업로드 중 오류가 발생했습니다. 다시 시도해주세요.');

      // 5초 후 에러 메시지 자동 제거
      setTimeout(() => {
        setGeneralError('');
      }, 5000);
    },
  });

  // 업로드 핸들러
  const handleUpload = async (data: FormValues) => {
    setGeneralError('');
    uploadMutation.mutate(data);
  };

  if (!isOpen || !uploadData) return null;

  return (
    <div className="upload_modal_overlay">
      <div className="upload_page">
        <div className="upload_container">
          {/* 헤더 */}
          <div className="upload_header">
            <button className="upload_back_btn" onClick={onClose}>
              <FiArrowLeft />
            </button>
            <h1 className="upload_title">{isEditMode ? '포토카드 수정' : '포토카드 업로드'}</h1>
            <div className="upload_spacer"></div>
          </div>

          {/* 일반 에러 메시지 */}
          {generalError && (
            <div className="upload_error">
              <FiX className="upload_error_close" onClick={() => setGeneralError('')} />
              <span>{generalError}</span>
            </div>
          )}

          {/* 이미지 미리보기 */}
          {uploadData?.imageData && (
            <div className="upload_image_preview">
              <img src={uploadData.imageData} alt="업로드할 포토카드" />
            </div>
          )}

          {/* 입력 폼 */}
          <form onSubmit={handleSubmit(handleUpload)} className="upload_form">
            <Input
              control={control}
              rules={{
                required: '제목을 입력해주세요.',
                maxLength: {
                  value: 50,
                  message: '제목은 최대 50자입니다.',
                },
              }}
              label="제목"
              name="title"
              placeholder="포토카드 제목을 입력하세요"
              size="large"
              error={errors.title?.message}
              suffixIcon={
                <span style={{ fontSize: '12px', color: '#8b949e' }}>
                  {titleValue?.length || 0}/50
                </span>
              }
            />

            <Input
              control={control}
              rules={{
                required: '내용을 입력해주세요.',
                maxLength: {
                  value: 500,
                  message: '내용은 최대 500자입니다.',
                },
              }}
              label="내용"
              name="content"
              type="textarea"
              placeholder="포토카드에 대한 설명을 입력하세요"
              rows={4}
              size="large"
              error={errors.content?.message}
              suffixIcon={
                <span style={{ fontSize: '12px', color: '#8b949e' }}>
                  {contentValue?.length || 0}/500
                </span>
              }
            />

            {/* 업로드 버튼 */}
            <Button
              type="submit"
              disabled={uploadMutation.isPending}
              loading={uploadMutation.isPending}
              icon={<FiUpload />}
              size="large"
              className="upload_submit_btn"
            >
              {uploadMutation.isPending
                ? isEditMode
                  ? '수정 중...'
                  : '업로드 중...'
                : isEditMode
                ? '수정'
                : '업로드'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UploadModal;
