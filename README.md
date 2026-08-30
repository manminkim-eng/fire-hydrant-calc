# 🔴 옥내소화전 펌프 용량 계산서 PWA — **Ver 5.0**

> **Developer MANMIN** | ㈜대성건축사사무소
> MANMIN WAP 디자인 통일 **마스터 기준본** · 39종 확산의 원본

---

## 🆕 Ver 5.0 — 디자인 통일 마스터 + 출력물 3판형 정합

MANMIN WAP 39종의 디자인 통일 작업에서 **소방웹이 마스터로 확정**되었고,
그 마스터를 이 도구에서 먼저 완성했다. 이후 38종이 이 파일의 패턴을 복제한다.

> **계산 로직은 1바이트도 변경하지 않았다.** 수식·상수·검증식·법령 인용문 모두 v3.4와 동일하다.
> 변경 범위는 `<style>` 블록 · 출력 래퍼 · 폰트 토큰 · JPG 저장 기능뿐이다.

### 조정 내역

| # | 항목 | 기존 (v3.4) | 변경 (v5.0) |
|---|------|------------|------------|
| ① | **A4 좌우 초과** | `@page` 좌우여백 26mm + `.rpt-inner{width:794px}` = 필요폭 236mm > 용지 210mm → 우측 잘림 | 인쇄 시 `width:auto` 로 해제 → 유효폭 **184mm** 자동 정합 |
| ② | **하단 버전 각인** | `@page{@bottom-right{content:...}}` — Chrome 미구현이라 **인쇄물에 찍히지 않음** | `#dev-stamp` 를 `position:fixed` 로 전환 → **매 페이지 출력** |
| ③ | **모바일 JPG 저장** | 없음 | `🖼️ JPG 저장` 버튼 추가 — 인쇄와 **동일 DOM** 캡처 |
| ④ | **고정폭 폰트** | `Noto Sans Mono` | `JetBrains Mono` + `Noto Sans KR` 폴백 (39종 공통 결정) |
| ⑤ | **화면 계산서 여백** | `padding:44px 52px` | `padding:14mm 12mm 22mm 14mm` → **화면·인쇄 콘텐츠폭 동일 184mm** |
| ⑥ | **버전 체계** | Ver-3.4 / CACHE v3.4 | **Ver-5.0 / CACHE v5.0** (전 39종 5.0에서 재출발) |

### MANMIN A4 규격 (전 39종 공통)

| 항목 | 값 |
|------|-----|
| 용지 | A4 portrait 210 × 297mm |
| 여백 | 상 14 · 우 12 · 하 22 · 좌 14mm |
| 유효 영역 | **184 × 261mm** |
| 하단 각인 | `MANMIN-Ver5.0` · Orbitron 8pt · `#9CA3AF` · 우측 하단 |
| 쪽번호 | **2매 이상일 때만** 좌측 하단 `n / 총장수` |
| 강조색 | 소방·기본단 `#B91C1C` |

### JPG 저장 동작

`.page-break` 를 경계로 페이지를 나눠 **A4 비율(210×297mm) 이미지를 장수만큼** 저장한다.
인쇄 쪽나눔과 같은 경계를 쓰므로 PDF와 JPG의 페이지 구성이 일치한다.

```
옥내소화전_{공사명}_{YYYYMMDD}[_n].jpg      해상도 : 페이지당 1588 × 2246px (scale 2)
```

구현에서 지킨 4가지 — 이 순서를 어기면 이미지가 깨진다.

1. **`rpt-inner` 의 transform 해제** — 모바일 축소배율이 이미지에 박히는 것을 막는다
2. **`document.fonts.ready` 대기** — 웹폰트 로딩 전 캡처하면 시스템 폰트로 굳는다
3. **`backgroundColor:'#FFFFFF'`** — 기계계열의 다크 카드 캡처 방식은 폐기했다
4. **`.no-print` 제외** — 버튼·힌트가 이미지에 찍히지 않게 한다

`html2canvas` 는 CDN 로드이나 Service Worker 의 Network-First 가 첫 온라인 실행 시 캐시하므로,
이후 오프라인·차단망에서도 저장이 동작한다.

### 백업

| 파일 | 내용 |
|------|------|
| `index_백업_2026-08-30_v3.4원본.html` | v5.0 작업 직전 원본 |
| `../../버전H-3.0/` | v3.4 폴더 전체 무변경 보존 |

---

## 📚 이전 이력 — Ver 3.2

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
