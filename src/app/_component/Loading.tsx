import '@/app/style/ui/loading.scss';
import LoadingBar from '@/app/_component/LodaingBar';
export default function Loading() {
  return (
    <div className="loadingWrap">
      <LoadingBar />
      <p>Loading</p>
    </div>
  );
}
