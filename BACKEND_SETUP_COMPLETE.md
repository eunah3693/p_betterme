# 백엔드 구조 생성 완료!

## 📁 생성된 폴더 구조

```
art-find-web/
├── src/
│   ├── lib/                    # 백엔드 유틸리티
│   │   ├── db.ts              # 데이터베이스 연결 설정
│   │   ├── api.ts             # API 응답 헬퍼 함수
│   │   └── validation.ts      # 입력 검증 스키마
│   ├── models/                 # 데이터 모델
│   │   ├── Art.ts             # 전시회 모델
│   │   ├── Place.ts           # 장소 모델
│   │   ├── User.ts            # 사용자 모델
│   │   └── Common.ts          # 공통 모델
│   ├── repositories/           # 데이터 접근 계층
│   │   ├── artRepository.ts   # 전시회 데이터 접근
│   │   ├── placeRepository.ts # 장소 데이터 접근
│   │   └── baseRepository.ts  # 기본 리포지토리
│   ├── services/               # 비즈니스 로직
│   │   ├── artService.ts      # 전시회 서비스
│   │   ├── placeService.ts    # 장소 서비스
│   │   └── searchService.ts    # 검색 서비스
│   └── middleware/             # 미들웨어
│       ├── api.ts              # API 미들웨어
│       ├── auth.ts             # 인증 미들웨어
│       └── errorHandler.ts     # 에러 처리 미들웨어
├── pages/api/                  # API 엔드포인트
│   ├── art/                    # 전시회 관련 API
│   │   ├── index.ts           # GET /api/art (목록)
│   │   ├── [id].ts            # GET /api/art/[id] (상세)
│   │   ├── free.ts            # GET /api/art/free (무료)
│   │   └── recommend.ts       # GET /api/art/recommend (추천)
│   ├── place/                  # 장소 관련 API
│   │   ├── index.ts           # GET /api/place (목록)
│   │   └── map.ts             # GET /api/place/map (지도)
│   ├── admin/                  # 관리자 API (선택사항)
│   └── search.ts               # GET /api/search (통합 검색)
└── scripts/                    # 유틸리티 스크립트
    └── init-db.ts             # 데이터베이스 초기화
```

## 🚀 다음 단계

### 1. 환경변수 설정
```bash
# .env.local 파일 생성
cp .env.example .env.local
# 비밀번호 등 실제 값으로 수정
```

### 2. 필요한 패키지 설치
```bash
yarn add zod  # 입력 검증용
yarn add jsonwebtoken @types/jsonwebtoken  # JWT 인증용 (선택사항)
```

### 3. 데이터베이스 초기화
```bash
# TypeScript 실행을 위한 패키지 설치
yarn add -D tsx

# 데이터베이스 초기화 실행
npx tsx scripts/init-db.ts
```

### 4. API 테스트
```bash
# 개발 서버 실행
yarn dev

# API 테스트
curl http://localhost:3000/api/art
curl http://localhost:3000/api/art/free
curl http://localhost:3000/api/place
```

## 📋 주요 기능

### ✅ 구현된 기능
- **데이터베이스 연결**: MySQL 연결 및 쿼리 실행
- **API 엔드포인트**: RESTful API 구조
- **계층형 아키텍처**: Repository → Service → API
- **입력 검증**: Zod 스키마 검증
- **에러 처리**: 통합 에러 처리 미들웨어
- **CORS 설정**: 크로스 오리진 요청 처리
- **로깅**: 요청/응답 로깅
- **보안**: 기본 보안 헤더 설정

### 🔧 확장 가능한 기능
- **인증/인가**: JWT 토큰 기반 인증
- **파일 업로드**: 이미지 업로드 기능
- **캐싱**: Redis 캐싱
- **검색**: 고급 검색 알고리즘
- **알림**: 이메일/SMS 알림
- **통계**: 사용자 행동 분석

## 💡 개발 팁

### 계층별 역할
- **API Layer**: HTTP 요청/응답 처리
- **Service Layer**: 비즈니스 로직 처리
- **Repository Layer**: 데이터베이스 접근
- **Model Layer**: 데이터 구조 정의

### 에러 처리
- 모든 API는 `withErrorHandler`로 감싸져 있음
- 일관된 에러 응답 형식
- 개발/운영 환경별 에러 메시지

### 확장성
- 새로운 엔티티 추가 시 패턴 복사 가능
- 미들웨어 체인으로 기능 추가 용이
- 환경변수로 설정 관리

이제 백엔드 구조가 완성되었습니다! 🎉
