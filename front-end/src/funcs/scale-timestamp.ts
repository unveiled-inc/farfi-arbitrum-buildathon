export function generateScaledTimestampURL(scaleInMinutes = 5) {
  // 현재 시간을 밀리초 단위로 가져옵니다.
  const now = new Date().getTime();
  // 밀리초를 분으로 변환하고, 스케일링 단위로 나누어 내림합니다.
  const scaledTimestamp = Math.floor(now / (scaleInMinutes * 60 * 1000));
  // 스케일링된 타임스탬프를 URL에 포함시킵니다.
  return scaledTimestamp;
}
