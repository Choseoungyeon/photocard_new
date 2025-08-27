import { BiSolidError } from 'react-icons/bi';
import '@/app/style/ui/error.scss';

export default function Error() {
  return (
    <div className="errorWrap">
      <BiSolidError className="errorIcon" />
      <h2>ERROR</h2>
      <p>문제가 계속되면 다시 시도하거나 문의해 주세요</p>
    </div>
  );
}
