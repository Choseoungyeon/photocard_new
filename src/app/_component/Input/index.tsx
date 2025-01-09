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
  resizeTextArea?: boolean;
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
    resizeTextArea = true,
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

  const inputId = name ? `${name}-input` : undefined;

  const textOnChangeHandler = (value: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (inputRef.current && type == 'textarea' && resizeTextArea) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = `${inputRef.current.scrollHeight}px`;
    }

    if (onChange) onChange(value);
  };

  return (
    <div className={clsx('inputContainer', disabled && 'disabled', error && 'error')}>
      {label && <label htmlFor={inputId}>{label}</label>}
      <div className={clsx('inputWrap', error && 'error', type == 'textarea' && 'textarea')}>
        {prefixIcon}
        {type !== 'textarea' ? (
          <>
            <div className="inputFormWrap">
              {control && name ? (
                <Controller
                  control={control}
                  name={name}
                  rules={rules}
                  render={({ field }) => (
                    <input
                      id={inputId}
                      type={showPassword ? (passwordVisible ? 'text' : 'password') : type}
                      name={name}
                      value={field.value}
                      onChange={(value) => {
                        field.onChange(value);
                        if (onChange) onChange(value);
                      }}
                      onFocus={onFocus}
                      onBlur={onBlur}
                      placeholder={placeholder}
                      disabled={disabled}
                      ref={inputRef as React.Ref<HTMLInputElement>}
                      aria-required={rules?.required ? 'true' : undefined}
                      aria-invalid={!!error}
                      {...restProps}
                    />
                  )}
                />
              ) : (
                <input
                  id={inputId}
                  type={showPassword ? (passwordVisible ? 'text' : 'password') : type}
                  name={name}
                  value={value}
                  onChange={onChange}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  placeholder={placeholder}
                  disabled={disabled}
                  ref={inputRef as React.Ref<HTMLInputElement>}
                  aria-required={rules?.required ? 'true' : undefined}
                  aria-invalid={!!error}
                  {...restProps}
                />
              )}
            </div>
            {showPassword && (
              <button
                type="button"
                className="password-icon"
                onClick={() => setPasswordVisible(!passwordVisible)}
                aria-label={passwordVisible ? 'Hide password' : 'Show password'}
              >
                {passwordVisible ? <IoMdEyeOff /> : <IoMdEye />}
              </button>
            )}
          </>
        ) : (
          <textarea
            id={inputId}
            name={name}
            value={value}
            onChange={textOnChangeHandler}
            onFocus={onFocus}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            ref={inputRef as React.Ref<HTMLTextAreaElement>}
            aria-required={rules?.required ? 'true' : undefined}
            aria-invalid={!!error}
            {...restProps}
          />
        )}
      </div>
      {error && <p className="input_error_message">{error}</p>}
    </div>
  );
});
