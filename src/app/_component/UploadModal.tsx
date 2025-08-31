'use client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { FiArrowLeft, FiUpload, FiX } from 'react-icons/fi';
import Input from '@/app/_component/Input';
import Button from '@/app/_component/Button';
import customFetch from '@/app/_hook/customFetch';
import { useModal } from '@/app/_context/ModalContext';
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
  const queryClient = useQueryClient();
  const { showModal } = useModal();
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

  React.useEffect(() => {
    if (uploadData) {
      reset({
        title: initialTitle,
        content: initialContent,
      });
      setGeneralError('');
    }
  }, [uploadData, reset, initialTitle, initialContent]);

  const uploadPhotocard = async (data: FormValues) => {
    if (!session?.user?.email) {
      throw new Error('사용자 정보를 찾을 수 없습니다.');
    }

    if (isEditMode) {
      const editUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/photocard/${photocardId}`;
      const result = await customFetch.put(editUrl, {
        body: {
          title: data.title,
          content: data.content,
        },
      });

      return result.data.photocard;
    } else {
      if (!uploadData?.imageData) {
        throw new Error('이미지가 없습니다.');
      }
      const response = await fetch(uploadData.imageData);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('content', data.content);
      formData.append('image', blob, 'photocard.png');

      const uploadUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/photocard/save-formdata`;
      const result = await customFetch.post(uploadUrl, {
        body: formData,
      });

      return result;
    }
  };

  const uploadMutation = useMutation({
    mutationFn: uploadPhotocard,
    onSuccess: (data) => {
      queryClient.refetchQueries({ queryKey: ['photocards'] });
      queryClient.refetchQueries({ queryKey: ['my-photocards'] });

      onClose();

      // 성공 모달 표시
      showModal({
        type: 'success',
        title: isEditMode ? '수정 완료' : '업로드 완료',
        message: isEditMode
          ? '포토카드가 성공적으로 수정되었습니다.'
          : '포토카드가 성공적으로 업로드되었습니다.',
        confirmText: '확인',
      });

      if (isEditMode && onEditComplete) {
        onEditComplete(data);
      }
    },
    onError: (error) => {
      console.error('업로드 오류:', error);
      setGeneralError(error.message || '업로드 중 오류가 발생했습니다. 다시 시도해주세요.');

      setTimeout(() => {
        setGeneralError('');
      }, 5000);
    },
  });

  const handleUpload = async (data: FormValues) => {
    setGeneralError('');
    uploadMutation.mutate(data);
  };

  if (!isOpen || !uploadData) return null;

  return (
    <div className="upload_modal_overlay">
      <div className="upload_page">
        <div className="upload_container">
          <div className="upload_header">
            <button className="upload_back_btn" onClick={onClose}>
              <FiArrowLeft />
            </button>
            <h1 className="upload_title">{isEditMode ? '포토카드 수정' : '포토카드 업로드'}</h1>
            <div className="upload_spacer"></div>
          </div>

          {generalError && (
            <div className="upload_error">
              <FiX className="upload_error_close" onClick={() => setGeneralError('')} />
              <span>{generalError}</span>
            </div>
          )}

          {uploadData?.imageData && (
            <div className="upload_image_preview">
              <img src={uploadData.imageData} alt="업로드할 포토카드" />
            </div>
          )}

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
