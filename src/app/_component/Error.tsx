import { BiSolidError } from 'react-icons/bi';
import style from './Error.module.css';
export default function Error() {
  return (
    <div className={style.errorWrap}>
      <BiSolidError className={style.errorIcon} />
      <h2>ERROR</h2>
      <p>Please try again or contact us if the problem persists.</p>
    </div>
  );
}
