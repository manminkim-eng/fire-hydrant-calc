# 🔴 옥내소화전 펌프 용량 계산서 PWA — Ver 3.2

> **Developer MANMIN** | 대성건축사사무소  
> Blueprint Engineering Theme · **재설치 문제 원천 차단 버전**

---

## 🆕 Ver 3.2 — 재설치 문제 완전 해결

### 문제 원인 (Ver 3.1 이하)
앱을 홈화면에서 삭제해도 브라우저 내 Service Worker와 캐시가 남아 있어,
브라우저가 "이미 설치된 사이트"로 오인 → `beforeinstallprompt` 미발생 → FAB 버튼 미표시 → 재설치 불가

### Ver 3.2 해결책

| 위치 | 개선 내용 |
|------|----------|
| **sw.js** | `CACHE_VER = 'v3.2'` — 캐시 버전 명시적 구분 |
| **sw.js INSTALL** | `skipWaiting()` 즉시 호출 → 대기 SW 없이 바로 활성화 |
| **sw.js ACTIVATE** | 현재 버전 외 **모든 이전 캐시 전부 삭제** |
| **sw.js ACTIVATE** | `clients.claim()` → 열린 탭 즉시 새 SW 적용 |
| **sw.js MESSAGE** | `CLEAR_CACHE` 명령 추가 — 긴급 초기화 가능 |
| **index.html SW** | 등록 시 `reg.waiting` 감지 → 즉시 `SKIP_WAITING` 전송 |
| **index.html SW** | `appinstalled` 이벤트 → `sessionStorage` 설치 플래그 기록 |
| **index.html SW** | `window.clearPwaCache()` 긴급 함수 노출 (콘솔 호출 가능) |
| **index.html React** | `beforeinstallprompt` 시 `sessionStorage` 플래그 초기화 |
| **index.html React** | 설치 완료 시 `sessionStorage` 기록 → 배너 중복 방지 |

---

## 📦 파일 구성

```
indoor-hydrant-v32/
├── index.html          ← 메인 앱 (React 포함, Ver 3.2)
├── manifest.json       ← PWA 매니페스트
├── sw.js               ← 서비스 워커 (Ver 3.2 — 재설치 문제 해결)
├── README.md
└── icons/              ← 아이콘 20종
    ├── favicon.ico / favicon-16.png / favicon-32.png
    ├── apple-touch-icon.png
    ├── icon-144x144.png / icon-152x152.png / icon-192x192.png
    ├── icon-72 ~ 384.png
    └── icon-512.png
```

## 🚀 GitHub Pages 배포 방법

1. 이 폴더 전체를 GitHub 저장소 루트에 업로드
2. `Settings` → `Pages` → `Source: main branch / (root)` 선택
3. 배포된 **HTTPS URL** 로 접속
4. 우하단 **📲 앱 설치** FAB 버튼 클릭 → 즉시 설치

## 🛠️ 재설치 문제 발생 시 긴급 해결법

### 사용자 입장
브라우저 콘솔(`F12`)에서:
```javascript
clearPwaCache()  // 전체 캐시 초기화 → 자동 새로고침
```

### 개발자 입장 (다음 버전 배포 시)
```javascript
// sw.js 한 줄만 변경
const CACHE_VER = 'v3.3';  // 숫자 올리기
```

---
*MANMIN · Blueprint Engineering Theme · Ver 3.2*
