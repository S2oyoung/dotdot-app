// 새 버전 서비스워커가 설치되면 기다리지 않고 바로 교체하고,
// 예전 버전을 보고 있던 창(휴대폰 홈 화면 앱·크롬 탭)을 한 번 새로고침해서 새 화면을 보여줌
let hadPrevious = false;
self.addEventListener('install', () => {
  hadPrevious = !!self.registration.active;
  self.skipWaiting();
});
self.addEventListener('activate', (event) => {
  const claimed = self.clients.claim();
  event.waitUntil(claimed);
  if (!hadPrevious) return; // 처음 설치할 때는 새로고침하지 않음
  // 활성화가 끝난 뒤에 새로고침 (활성화 중에 새로고침하면 그 요청이 활성화를 기다려 멈춤)
  claimed.then(() =>
    setTimeout(async () => {
      const wins = await self.clients.matchAll({ type: 'window' });
      wins.forEach((w) => w.navigate(w.url).catch(() => {}));
    }, 300)
  );
});
