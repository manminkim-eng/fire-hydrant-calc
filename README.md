# 🔴 옥내소화전 펌프 용량 계산서 PWA

> **Developer MANMIN** | 대성건축사사무소  
> Blueprint Engineering Theme · Ver 3.1

## 📦 파일 구성

```
indoor-hydrant-pwa/
├── index.html          ← 메인 앱 (React 포함, Ver 3.1)
├── manifest.json       ← PWA 매니페스트
├── sw.js               ← 서비스 워커 (오프라인 지원 + 업데이트 감지)
├── README.md
└── icons/              ← 아이콘 20종 (옥내소화전 이미지 기반)
    ├── favicon.ico / favicon-16.png / favicon-32.png
    ├── apple-touch-icon.png
    ├── icon-144x144.png / icon-152x152.png / icon-192x192.png  ← 앱 내부 참조용
    ├── icon-72 ~ 384.png
    └── icon-512.png     ← 마스커블 / 스플래시
```

## 🚀 GitHub Pages 배포 방법

1. 이 폴더 전체를 GitHub 저장소 루트에 업로드
2. `Settings` → `Pages` → `Source: main branch / (root)` 선택
3. 배포된 **HTTPS URL** 로 접속 *(HTTP에서는 PWA 설치 불가)*
4. 우하단 **📲 앱 설치** FAB 버튼 클릭 → 즉시 설치

## 📱 PWA 설치 지원 환경

| 환경 | 설치 방법 |
|------|----------|
| Android Chrome / Edge | 📲 앱 설치 FAB 버튼 또는 하단 배너 |
| Windows Chrome / Edge | 주소창 우측 설치 아이콘 ⊕ |
| macOS Chrome | 주소창 우측 설치 아이콘 ⊕ |
| iOS Safari | 공유 버튼 → "홈 화면에 추가" *(FAB 미지원)* |

## 🆕 Ver 3.1 변경사항

| 항목 | 내용 |
|------|------|
| **📲 설치 FAB 버튼** | 우하단 레드 고정 버튼, 팝-인 애니메이션 |
| **🟡 NEW 뱃지** | 앰버 펄싱 뱃지로 설치 유도 강화 |
| **📐 계산식 FAB** | bottom 80→102px 상향 (버튼 겹침 방지) |
| **alt 속성** | 이미지 alt="앱" → "옥내소화전 앱 아이콘" 보완 |
| **버전 스탬프** | Ver-3.0 → Ver-3.1 전체 업데이트 (6개소) |
| **아이콘 세트** | jfif 원본에서 20종 자동 생성 (기존 앱 참조 파일명 포함) |

## ⚙️ 기술 스택

- **React 18** (UMD, unpkg CDN)
- **Service Worker** (오프라인 캐싱, 자동 업데이트 감지)
- **Web App Manifest** (설치, 아이콘, 바로가기)
- **Hazen-Williams 공식** 기반 배관 마찰손실 계산
- **NFPC 102 / NFTC 102** (옥내소화전) + NFTC 604 (고층건축물)

## 🎨 MANMIN 시리즈 FAB 색상 가이드

| 앱 | 설치 FAB 색상 |
|----|-------------|
| 옥외소화전 | 🔵 파랑 `#1d4ed8` |
| 스프링클러 | 🔵 파랑 `#1d4ed8` |
| 간이스프링클러 | 🔵 파랑 `#1d4ed8` |
| 겸용[옥내+스프] | 🟣 퍼플 `#7c3aed` |
| 겸용[옥내+간이] | 🟢 틸 `#0d9488` |
| 겸용[옥내+옥외] | 🌸 로즈 `#be185d` |
| 통합 포털 | 🟤 앰버 `#b45309` |
| **옥내소화전** | **🔴 레드 `#DC2626`** |

---
*MANMIN · Blueprint Engineering Theme · Ver 3.1*
