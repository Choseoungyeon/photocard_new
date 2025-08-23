export function formatDate(dateString: string): string {
  const date = new Date(dateString);

  // 서버와 클라이언트에서 일관된 포맷 사용
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}. ${month}. ${day}.`;
}
