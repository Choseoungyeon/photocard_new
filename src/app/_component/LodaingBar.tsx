import '@/app/style/ui/loading.scss';
import clsx from 'clsx';
type Props = {
  width?: string;
  height?: string;
  color?: string;
  className?: string;
};
export default function Loading({ width, height, color, className }: Props) {
  return (
    <div className={clsx('loadingBarSpinner', className)} style={{ width: width, height: height }}>
      <div className="spinnerIcon" style={{ borderLeftColor: color, borderTopColor: color }}></div>
    </div>
  );
}
