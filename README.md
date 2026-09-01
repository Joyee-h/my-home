# my-home

조이현 개인 포트폴리오 홈페이지 (정적 사이트)

## 구성

| 파일 | 설명 |
|---|---|
| `index.html` | 페이지 본문 |
| `styles.css` | 디자인 토큰 · 컴포넌트 · 반응형 스타일 |
| `main.js` | 스크롤 등장 효과, 진행률 바, 모바일 메뉴, 아코디언 |
| `profile.jpg` | 프로필 사진 |
| `netlify.toml` | Netlify 배포 설정 (빌드 없이 루트 그대로 배포) |

## 로컬에서 보기

빌드 도구가 필요 없습니다. `index.html` 을 브라우저로 열거나,
간단한 정적 서버를 띄워 확인하면 됩니다.

## 배포

Netlify 에 저장소를 연결하면 자동 배포됩니다.
빌드 명령은 비우고, publish directory 는 `.` 로 설정합니다.

## 수정이 필요한 항목

- `index.html` 의 `mailto:your-email@example.com` → 실제 이메일 주소
