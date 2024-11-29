import type { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode } from 'react';
import { IoMdEye } from 'react-icons/io';
import { IoMdEyeOff } from 'react-icons/io';
import { Controller } from 'react-hook-form';
import type { Control, RegisterOptions } from 'react-hook-form';
import clsx from 'clsx';
import * as React from 'react';
import '@/app/style/ui/input.scss';

type Props = {
  label?: string;
  name?: string;
  prefixIcon?: ReactNode;
  showPassword?: boolean;
  error?: string | null | undefined;
  disabled?: boolean;
  control?: Control<any>;
  rules?: RegisterOptions;
  onFocus?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
} & TextareaHTMLAttributes<HTMLTextAreaElement> &
  InputHTMLAttributes<HTMLInputElement>;

interface InputRef {
  focus: () => void;
  blur: () => void;
  inputRef: HTMLInputElement | HTMLTextAreaElement | null;
}

export default React.forwardRef<InputRef, Props>(function Input(props, ref) {
  const inputRef = React.useRef<HTMLInputElement | HTMLTextAreaElement>(null);
  const [passwordVisible, setPasswordVisible] = React.useState<boolean>(false);
  const {
    type = 'text',
    label,
    name,
    prefixIcon,
    showPassword,
    value,
    onChange,
    placeholder,
    error,
    disabled,
    control,
    rules,
    onFocus,
    onBlur,
    ...restProps
  } = props;

  React.useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    },
    blur: () => {
      inputRef.current?.blur();
    },
    inputRef: inputRef.current,
  }));

  return (
    <div className={clsx('inputContainer', disabled && 'disabled', error && 'error')}>
      {label && <label htmlFor={name}>{label}</label>}
      <div className={clsx('inputWrap', error && 'error')}>
        {prefixIcon}
        {type !== 'textarea' ? (
          <>
            <div className="inputFormWrap">
              {control && name ? (
                <Controller
                  control={control}
                  name={name}
                  rules={rules}
                  render={(data) => (
                    <input
                      type={showPassword ? (passwordVisible ? 'text' : 'password') : type}
                      name={name}
                      value={data.field.value}
                      onChange={(value) => {
                        data.field.onChange(value);
                        if (onChange) onChange(value);
                      }}
                      onFocus={onFocus}
                      onBlur={onBlur}
                      placeholder={placeholder}
                      disabled={disabled}
                      ref={inputRef as React.LegacyRef<HTMLInputElement>}
                    />
                  )}
                />
              ) : (
                <input
                  type={showPassword ? (passwordVisible ? 'text' : 'password') : type}
                  name={name}
                  value={value}
                  onChange={onChange}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  placeholder={placeholder}
                  disabled={disabled}
                  ref={inputRef as React.LegacyRef<HTMLInputElement>}
                />
              )}
            </div>
            {showPassword && (
              <div className="password-icon" onClick={() => setPasswordVisible(!passwordVisible)}>
                {passwordVisible ? <IoMdEyeOff /> : <IoMdEye />}
              </div>
            )}
          </>
        ) : (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            ref={inputRef as React.LegacyRef<HTMLTextAreaElement>}
          />
        )}
      </div>
      {error && <p className="input_error_message">{error}</p>}
    </div>
  );
});
