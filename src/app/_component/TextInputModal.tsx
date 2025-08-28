'use client';

import React, { useState } from 'react';
import Modal from './Modal';
import Input from './Input';
import Button from './Button';
import { useForm } from 'react-hook-form';
import '@/app/style/ui/text-input-modal.scss';

interface TextInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddText: (textData: {
    text: string;
    color: string;
    fontSize: number;
    fontFamily: string;
    fontWeight: string;
    textAlign: string;
  }) => void;
}

interface FormValues {
  text: string;
  color: string;
  fontSize: number;
  fontFamily: string;
  fontWeight: string;
  textAlign: string;
}

const fontFamilies = [
  { value: 'Arial, sans-serif', label: 'Arial' },
  { value: 'Times New Roman, serif', label: 'Times New Roman' },
  { value: 'Courier New, monospace', label: 'Courier New' },
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: 'Verdana, sans-serif', label: 'Verdana' },
  { value: 'Impact, sans-serif', label: 'Impact' },
  { value: 'Comic Sans MS, cursive', label: 'Comic Sans MS' },
];

export default function TextInputModal({ isOpen, onClose, onAddText }: TextInputModalProps) {
  const [selectedColor, setSelectedColor] = useState('#FFFFFF');
  const [selectedFontSize, setSelectedFontSize] = useState(24);
  const [selectedFontFamily, setSelectedFontFamily] = useState('Arial, sans-serif');
  const [selectedFontWeight, setSelectedFontWeight] = useState('bold');
  const [selectedTextAlign, setSelectedTextAlign] = useState('center');

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
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log('텍스트 추가:', {
      text: data.text,
      color: selectedColor,
      fontSize: selectedFontSize,
      fontFamily: selectedFontFamily,
      fontWeight: selectedFontWeight,
      textAlign: selectedTextAlign,
    });
    onAddText({
      text: data.text,
      color: selectedColor,
      fontSize: selectedFontSize,
      fontFamily: selectedFontFamily,
      fontWeight: selectedFontWeight,
      textAlign: selectedTextAlign,
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
              />
            </div>

            <div className="text_input_modal_field">
              <label className="text_input_modal_label">폰트</label>
              <select
                value={selectedFontFamily}
                onChange={(e) => setSelectedFontFamily(e.target.value)}
                className="text_input_modal_font_select"
              >
                {fontFamilies.map((font) => (
                  <option key={font.value} value={font.value}>
                    {font.label}
                  </option>
                ))}
              </select>
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
                  fontFamily: selectedFontFamily,
                  fontWeight: selectedFontWeight,
                  textAlign: selectedTextAlign as 'left' | 'center' | 'right',
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
