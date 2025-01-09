import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import userEvent from '@testing-library/user-event';
import Input from '@/app/_component/Input';
import { FiCheckCircle } from 'react-icons/fi';

const user = userEvent.setup();

describe('기본 랜더링 테스트', () => {
  it('label과 input 필드가 placeholder가 렌더링된다', () => {
    const inputId = 'test-input';
    render(<Input label="테스트 라벨" placeholder="테스트" name={inputId} />);
    expect(screen.getByPlaceholderText('테스트')).toBeInTheDocument();
    expect(screen.getByText('테스트 라벨')).toBeInTheDocument();
  });
});

describe('입력 테스트', () => {
  it('입력한 값이 input 필드에 반영된다', async () => {
    const inputId = 'test-input';
    render(<Input label="테스트" placeholder="테스트" name={inputId} />);
    const inputDom = screen.getByPlaceholderText('테스트');
    await user.type(inputDom, '테스트 입력');
    expect(screen.getByDisplayValue('테스트 입력')).toBeInTheDocument();
  });

  it('input에 값을 입력하면 onChange 이벤트가 발생한다.', async () => {
    const inputId = 'test-input';
    const testFn = vi.fn();
    render(<Input label="테스트" placeholder="테스트" name={inputId} onChange={testFn} />);
    const inputDom = screen.getByPlaceholderText('테스트');
    await user.type(inputDom, '테스트 입력');
    expect(screen.getByDisplayValue('테스트 입력')).toBeInTheDocument();
    expect(testFn).toHaveBeenCalled();
  });
});

describe('유효성 검사 확인', () => {
  const setup = (props = {}) => {
    const Wrapper = () => {
      const {
        control,
        handleSubmit,
        formState: { errors },
      } = useForm({
        defaultValues: { testInput: '' },
      });

      const onSubmit = vi.fn();

      return (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            control={control}
            name="testInput"
            label="Test Input"
            error={errors.testInput?.message}
            {...props}
          />
          <button type="submit">Submit</button>
        </form>
      );
    };

    return render(<Wrapper />);
  };

  it('rules에서 required 설정 시, 빈 값으로 제출하면 에러 메시지가 나타난다.', async () => {
    setup({ rules: { required: '내용을 입력해주세요' } });
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    expect(screen.getByText('내용을 입력해주세요')).toBeInTheDocument();
  });

  it('값이 입력되면 에러 메시지가 사라진다.', async () => {
    setup({ rules: { required: '내용을 입력해주세요' } });
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    const errorTxt = screen.getByText('내용을 입력해주세요');
    expect(errorTxt).toBeInTheDocument();

    const inputDom = screen.getByLabelText('Test Input');
    await user.type(inputDom, '내용입력');
    expect(errorTxt).not.toBeInTheDocument();
  });
});

describe('비밀번호 표시/숨기기 기능 테스트', () => {
  it('type=password이고 showPassword=false일때는 비밀번호 토글 버튼이 없다', () => {
    const inputId = 'test-input';
    render(<Input label="테스트" name={inputId} type="password" showPassword={false} />);
    expect(screen.queryByLabelText('Show password')).not.toBeInTheDocument();
  });

  it('비밀번호 토글 버튼 클릭 시 type 속성이 text로 변경된다.', async () => {
    const inputId = 'test-input';
    render(
      <Input
        label="테스트"
        name={inputId}
        type="password"
        placeholder="테스트"
        showPassword={true}
      />,
    );
    const passwordButton = screen.getByLabelText('Show password');
    await user.click(passwordButton);
    expect(screen.getByLabelText('Hide password')).toBeInTheDocument();
  });

  it('비밀번호 토글 버튼 클릭 시 type 속성이 text로 변경된경우, 다시 비밀번호 토글 버튼을 클릭하면 type 속성이 password로 바뀐다.', async () => {
    const inputId = 'test-input';
    render(<Input label="테스트" name={inputId} type="password" showPassword={true} />);
    const passwordButton = screen.getByLabelText('Show password');
    const passwordInput = screen.getByLabelText('테스트');
    expect(passwordInput.getAttribute('type')).toBe('password');

    await user.click(passwordButton);
    expect(screen.getByLabelText('Hide password')).toBeInTheDocument();
    expect(passwordInput.getAttribute('type')).toBe('text');
  });
});

describe('disabled 상태 테스트', () => {
  it('disabled가 활성화된 경우 필드에 입력할 수 없고, onChange 이벤트가 발생하지 않는다.', async () => {
    const inputId = 'test-input';
    const onChange = vi.fn();
    render(
      <Input label="테스트" name={inputId} type="password" disabled={true} onChange={onChange} />,
    );
    const testInput = screen.getByLabelText('테스트');
    await user.type(testInput, '테스트 내용 입력');
    expect(screen.queryByDisplayValue('테스트 내용 입력')).not.toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe('에러 메시지 표시 테스트', () => {
  it('에러 메시지가 전달되면 하단에 텍스트로 렌더링된다.', () => {
    const inputId = 'test-input';
    render(<Input label="테스트" name={inputId} type="password" error="테스트 에러메세지" />);
    expect(screen.getByText('테스트 에러메세지')).toBeInTheDocument();
  });
});

describe('textarea 동작 테스트', () => {
  it('textarea가 렌더링되고, 입력 값이 정상적으로 업데이트되고, onChange 이벤트가 발생한다', async () => {
    const inputId = 'test-input';
    const inputEvent = vi.fn();
    render(<Input label="테스트" name={inputId} type="textarea" onChange={inputEvent} />);
    const testInput = screen.getByLabelText('테스트');
    await user.type(testInput, '테스트 내용 입력');
    expect(screen.getByDisplayValue('테스트 내용 입력')).toBeInTheDocument();
    expect(inputEvent).toHaveBeenCalled();
  });

  it('textarea에 text를 채우면 input이 늘어난다', async () => {
    const inputId = 'test-input';
    render(<Input label="테스트" name={inputId} type="textarea" />);
    const testArea = screen.getByLabelText('테스트');
    const initialHeight = testArea.style.height;
    await user.type(testArea, '첫 번째 줄\n두 번째 줄\n세 번째 줄');
    expect(testArea.style.height).not.toBe(initialHeight);
  });

  it('resizeTextArea가 false일 경우 textarea에 text를 채우면 input이 늘어나지 않는다', async () => {
    const inputId = 'test-input';
    render(<Input label="테스트" name={inputId} type="textarea" resizeTextArea={false} />);
    const testArea = screen.getByLabelText('테스트');
    const initialHeight = testArea.style.height;
    await user.type(testArea, '첫 번째 줄\n두 번째 줄\n세 번째 줄');
    expect(testArea.style.height).toBe(initialHeight);
  });
});

describe('prefixIcon 테스트', () => {
  it('prefixIcon으로 전달된 아이콘이 input 필드 왼쪽에 렌더링된다.', () => {
    const inputId = 'test-input';
    const prefixIcon = <FiCheckCircle data-testid="icon" />;

    render(
      <Input
        label="테스트"
        name={inputId}
        type="textarea"
        resizeTextArea={false}
        prefixIcon={prefixIcon}
      />,
    );

    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });
});
