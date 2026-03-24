/* ═══════════════════════════════════════════════════════════════
   Service Worker — 옥내소화전 펌프 용량 계산서
   Developer MANMIN · Ver-3.3

   ▣ Ver 3.2 핵심 개선 — 재설치 문제 원천 차단
   ① INSTALL  : skipWaiting() 즉시 호출 → 대기 없이 바로 활성화
   ② ACTIVATE : 현재 버전 외 캐시 전부 삭제 (버전명 불문)
                clients.claim() → 열린 탭 즉시 새 SW 적용
   ③ FETCH    : Network-First (오프라인 폴백)
   ④ MESSAGE  : SKIP_WAITING / CLEAR_CACHE 모두 처리
   ⑤ SYNC     : 앱 재설치 후 첫 방문 시 캐시 강제 갱신
═══════════════════════════════════════════════════════════════ */

const CACHE_VER    = 'v3.3';
const CACHE_NAME   = `manmin-indoor-hydrant-${CACHE_VER}`;
const STATIC_CACHE = `manmin-indoor-hydrant-static-${CACHE_VER}`;

/* ── 선캐싱 URL 목록 ── */
const PRECACHE_URLS = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-32.png',
  './icons/favicon-16.png',
  './icons/favicon.ico',
];

/* ════════════════════════════════════════════════════════
   INSTALL : 캐시 선적재 후 skipWaiting() 즉시 호출
   → 대기 SW 없이 바로 활성화 (재설치 후 첫 방문에서도 동작)
════════════════════════════════════════════════════════ */
self.addEventListener('install', (event) => {
  console.log(`[SW ${CACHE_VER}] Installing...`);
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        return cache.addAll(PRECACHE_URLS).catch((e) => {
          console.warn(`[SW ${CACHE_VER}] Pre-cache 일부 실패:`, e);
        });
      })
      /* ★ 핵심: 즉시 skipWaiting → 이전 SW를 밀어내고 바로 activate */
      .then(() => self.skipWaiting())
  );
});

/* ════════════════════════════════════════════════════════
   ACTIVATE : 이전 버전 캐시 전부 삭제
   → "이미 설치됨" 오판 방지, 재설치 후 깨끗한 상태 보장
════════════════════════════════════════════════════════ */
self.addEventListener('activate', (event) => {
  console.log(`[SW ${CACHE_VER}] Activating — cleaning old caches...`);
  event.waitUntil(
    caches.keys()
      .then((keys) => {
        const deletions = keys
          .filter((k) => k !== CACHE_NAME && k !== STATIC_CACHE)
          .map((k) => {
            console.log(`[SW ${CACHE_VER}] 구버전 캐시 삭제:`, k);
            return caches.delete(k);
          });
        return Promise.all(deletions);
      })
      /* ★ 핵심: clients.claim() → 현재 열린 모든 탭에 즉시 적용 */
      .then(() => self.clients.claim())
      .then(() => console.log(`[SW ${CACHE_VER}] 활성화 완료`))
  );
});

/* ════════════════════════════════════════════════════════
   FETCH : Network-First 전략
   온라인 → 네트워크 응답 캐시 저장 후 반환
   오프라인 → 캐시 폴백 (없으면 index.html)
════════════════════════════════════════════════════════ */
self.addEventListener('fetch', (event) => {
  const { request } = event;

  /* GET 요청만 처리 */
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  /* 외부 CDN (Google Fonts, unpkg 등) — Network-First with cache fallback */
  if (url.origin !== self.location.origin) {
    event.respondWith(
      fetch(request)
        .then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((c) => c.put(request, copy));
          }
          return res;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  /* 로컬 리소스 — Network-First */
  event.respondWith(
    fetch(request)
      .then((res) => {
        if (!res || res.status !== 200 || res.type === 'opaque') return res;
        const copy = res.clone();
        caches.open(CACHE_NAME).then((c) => c.put(request, copy));
        return res;
      })
      .catch(() =>
        caches.match(request).then(
          (cached) => cached || caches.match('./index.html')
        )
      )
  );
});

/* ════════════════════════════════════════════════════════
   MESSAGE : 클라이언트에서 보내는 명령 처리
════════════════════════════════════════════════════════ */
self.addEventListener('message', (event) => {
  if (!event.data) return;

  /* SKIP_WAITING : 업데이트 배너에서 "업데이트" 클릭 시 */
  if (event.data.type === 'SKIP_WAITING') {
    console.log(`[SW ${CACHE_VER}] SKIP_WAITING 수신 → 즉시 활성화`);
    self.skipWaiting();
  }

  /* CLEAR_CACHE : 강제 캐시 초기화 (재설치 문제 발생 시 클라이언트에서 호출) */
  if (event.data.type === 'CLEAR_CACHE') {
    console.log(`[SW ${CACHE_VER}] CLEAR_CACHE 수신 → 전체 캐시 삭제`);
    event.waitUntil(
      caches.keys()
        .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
        .then(() => {
          /* 삭제 완료 후 클라이언트에 알림 */
          self.clients.matchAll().then((clients) =>
            clients.forEach((c) => c.postMessage({ type: 'CACHE_CLEARED' }))
          );
        })
    );
  }
});
