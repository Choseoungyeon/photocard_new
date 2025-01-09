import Button from '@/app/_component/Button';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { FiAlignLeft } from 'react-icons/fi';

const user = userEvent.setup();

it('Button 컴포넌트 안에 내용을 쓰면 제대로 반영된채 화면에 적용된다', async () => {
  render(<Button>테스트</Button>);
  expect(screen.getByText('테스트')).toBeInTheDocument();
});

it('props로 backgroundColor에 "red"를 넘기면 버튼이 해당 색상으로 변한채로 적용된다', async () => {
  render(<Button backgroundColor="red">테스트</Button>);
  const button = screen.getByRole('button', { name: '테스트' });
  expect(button).toHaveStyle({ backgroundColor: '#ff0000' });
});

it('props로 icon에 <FiAlignLeft />을 넘기면 <FiAlignLeft />이 버튼 안에 생긴다', async () => {
  render(<Button icon={<FiAlignLeft data-testid="icon" />}>테스트</Button>);
  const icon = screen.getByTestId('icon');
  expect(icon).toBeInTheDocument();
});

it('props로 loading에 true를 넘기면 <LoadingBar />가 버튼 안에 생긴다', async () => {
  render(<Button loading={true}>테스트</Button>);
  const loading = screen.getByLabelText('loading');
  expect(loading).toBeInTheDocument();
});

it('props로 disabled에 true를 넘기면 버튼이 비활성화된다', async () => {
  render(<Button disabled={true}>테스트</Button>);
  const button = screen.getByRole('button', { name: '테스트' });
  expect(button).toBeDisabled();
});

it('버튼을 누르면 onClick이 작동된다', async () => {
  const testFn = vi.fn();
  render(<Button onClick={testFn}>테스트</Button>);
  const button = screen.getByRole('button', { name: '테스트' });
  await user.click(button);
  expect(testFn).toHaveBeenCalledOnce();
});

it('버튼을 누르면 onClick이 작동된다', async () => {
  const testFn = vi.fn();
  render(<Button onClick={testFn}>테스트</Button>);
  const button = screen.getByRole('button', { name: '테스트' });
  await user.click(button);
  expect(testFn).toHaveBeenCalledOnce();
});

it('버튼이 비활성화(disabled) 상태일 때 onClick이 호출되지 않는다', async () => {
  const testFn = vi.fn();
  render(
    <Button onClick={testFn} disabled={true}>
      테스트
    </Button>,
  );
  const button = screen.getByRole('button', { name: '테스트' });
  await user.click(button);
  expect(testFn).not.toHaveBeenCalledOnce();
});
