import '@/app/style/ui/loading.scss';
type Props = {
  width?: string;
  height?: string;
};
export default function Loading({ width, height }: Props) {
  return (
    <div className="loadingBarSpinner" style={{ width: width, height: height }}>
      <div className="spinnerIcon"></div>
    </div>
  );
}
