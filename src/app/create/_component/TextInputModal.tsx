'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Modal from '@/app/_component/Modal';
import Input from '@/app/_component/Input';
import Button from '@/app/_component/Button';
import { useForm } from 'react-hook-form';
import '@/app/style/ui/text-input-modal.scss';

interface TextInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddText: (textData: {
    text: string;
    color: string;
    fontSize: number;
    fontWeight: string;
    textAlign: string;
    lineHeight: number;
  }) => void;
}

interface FormValues {
  text: string;
  color: string;
  fontSize: number;
  fontWeight: string;
  textAlign: string;
  lineHeight: number;
}

export default function TextInputModal({ isOpen, onClose, onAddText }: TextInputModalProps) {
  const [selectedColor, setSelectedColor] = useState('#FFFFFF');
  const [selectedFontSize, setSelectedFontSize] = useState(24);
  const [selectedFontWeight, setSelectedFontWeight] = useState('bold');
  const [selectedTextAlign, setSelectedTextAlign] = useState('center');
  const [selectedLineHeight, setSelectedLineHeight] = useState(1);

  const progressBackground = useMemo(() => {
    const percentage = ((selectedFontSize - 12) / (72 - 12)) * 100;
    return `linear-gradient(to right, #5e6ad2 0%, #5e6ad2 ${percentage}%, #30363d ${percentage}%, #30363d 100%)`;
  }, [selectedFontSize]);

  const lineHeightProgressBackground = useMemo(() => {
    const percentage = ((selectedLineHeight - 0.8) / (3 - 0.8)) * 100;
    return `linear-gradient(to right, #5e6ad2 0%, #5e6ad2 ${percentage}%, #30363d ${percentage}%, #30363d 100%)`;
  }, [selectedLineHeight]);

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      text: '',
      color: '#FFFFFF',
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      lineHeight: 1,
    },
  });

  useEffect(() => {
    if (isOpen) {
      setSelectedColor('#FFFFFF');
      setSelectedFontSize(24);
      setSelectedFontWeight('bold');
      setSelectedTextAlign('center');
      setSelectedLineHeight(1);
      reset();
    }
  }, [isOpen, reset]);

  const onSubmit = (data: FormValues) => {
    onAddText({
      text: data.text,
      color: selectedColor,
      fontSize: selectedFontSize,
      fontWeight: selectedFontWeight,
      textAlign: selectedTextAlign,
      lineHeight: selectedLineHeight,
    });
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      type="custom"
      title="텍스트 추가"
      closeButton={true}
      onClose={handleClose}
      resizable={true}
      draggable={true}
      content={
        <div className="text_input_modal_container">
          <form onSubmit={handleSubmit(onSubmit)} className="text_input_modal_form">
            <div className="text_input_modal_field">
              <Input
                control={control}
                name="text"
                label="텍스트"
                placeholder="텍스트를 입력하세요 (줄바꿈 가능)"
                rules={{ required: '텍스트를 입력해주세요' }}
                error={errors.text?.message}
                type="textarea"
              />
            </div>

            <div className="text_input_modal_field">
              <label className="text_input_modal_label">색상</label>
              <div className="text_input_modal_color_picker">
                <input
                  type="color"
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="text_input_modal_color_input"
                />
                <div
                  className="text_input_modal_color_preview"
                  style={{ backgroundColor: selectedColor }}
                >
                  <span className="text_input_modal_color_value">{selectedColor}</span>
                </div>
              </div>
            </div>

            <div className="text_input_modal_field">
              <label className="text_input_modal_label">폰트 크기: {selectedFontSize}px</label>
              <input
                type="range"
                min="12"
                max="72"
                value={selectedFontSize}
                onChange={(e) => setSelectedFontSize(Number(e.target.value))}
                className="text_input_modal_font_size_slider"
                style={{
                  background: progressBackground,
                }}
              />
            </div>

            <div className="text_input_modal_field">
              <label className="text_input_modal_label">줄 간격: {selectedLineHeight}</label>
              <input
                type="range"
                min="0.8"
                max="3"
                step="0.1"
                value={selectedLineHeight}
                onChange={(e) => setSelectedLineHeight(Number(e.target.value))}
                className="text_input_modal_font_size_slider"
                style={{
                  background: lineHeightProgressBackground,
                }}
              />
            </div>

            <div className="text_input_modal_field">
              <label className="text_input_modal_label">폰트 굵기</label>
              <select
                value={selectedFontWeight}
                onChange={(e) => setSelectedFontWeight(e.target.value)}
                className="text_input_modal_font_select"
              >
                <option value="normal">보통</option>
                <option value="bold">굵게</option>
              </select>
            </div>

            <div className="text_input_modal_field">
              <label className="text_input_modal_label">텍스트 정렬</label>
              <select
                value={selectedTextAlign}
                onChange={(e) => setSelectedTextAlign(e.target.value)}
                className="text_input_modal_font_select"
              >
                <option value="left">왼쪽</option>
                <option value="center">가운데</option>
                <option value="right">오른쪽</option>
              </select>
            </div>

            <div className="text_input_modal_preview">
              <label className="text_input_modal_label">미리보기</label>
              <div
                className="text_input_modal_preview_text"
                style={{
                  color: selectedColor,
                  fontSize: `${selectedFontSize}px`,
                  fontWeight: selectedFontWeight,
                  textAlign: selectedTextAlign as 'left' | 'center' | 'right',
                  lineHeight: selectedLineHeight,
                }}
              >
                미리보기 텍스트
              </div>
            </div>

            <div className="text_input_modal_actions">
              <Button type="button" variant="secondary" onClick={handleClose}>
                취소
              </Button>
              <Button type="submit">추가</Button>
            </div>
          </form>
        </div>
      }
    />
  );
}
