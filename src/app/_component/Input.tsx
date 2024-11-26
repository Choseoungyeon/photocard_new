import type { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode } from 'react';
import { IoMdEye } from 'react-icons/io';
import { IoMdEyeOff } from 'react-icons/io';
import * as React from 'react';
import '@/app/style/ui/input.scss';

type Props = {
  label?: string;
  name?: string;
  prefixIcon?: ReactNode;
  showPassword?: boolean;
} & TextareaHTMLAttributes<HTMLTextAreaElement> &
  InputHTMLAttributes<HTMLInputElement>;

interface InputRef {
  focus: () => void;
  blur: () => void;
  input: HTMLInputElement | HTMLTextAreaElement | null;
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
    ...restProps
  } = props;

  React.useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    },
    blur: () => {
      inputRef.current?.blur();
    },
    input: inputRef.current,
  }));

  return (
    <div className="inputContainer">
      {label && <label htmlFor={name}>{label}</label>}
      <div className="inputWrap">
        {prefixIcon}
        {type !== 'textarea' ? (
          <>
            <div className="inputFormWrap">
              <input
                type={showPassword ? (passwordVisible ? 'text' : 'password') : type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                ref={inputRef as React.LegacyRef<HTMLInputElement>}
              />
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
            placeholder={placeholder}
            ref={inputRef as React.LegacyRef<HTMLTextAreaElement>}
          />
        )}
      </div>
    </div>
  );
});
