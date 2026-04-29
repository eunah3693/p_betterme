-- ============================================
-- Supabase SQL Editor용 테이블 생성 스크립트
-- Prisma schema.prisma 기반 (PostgreSQL 변환)
-- ============================================
-- 사용법: Supabase 대시보드 → SQL Editor → 새 쿼리 → 아래 전체 붙여넣기 → Run
-- ============================================

-- 1. member 테이블 (다른 테이블에서 member_id로 참조하므로 먼저 생성)
CREATE TABLE IF NOT EXISTS member (
  idx         SERIAL PRIMARY KEY,
  id          VARCHAR(45) NOT NULL DEFAULT '아이디',
  password    VARCHAR(255) NOT NULL DEFAULT '비밀번호',
  nickname    VARCHAR(45) NOT NULL DEFAULT '닉네임',
  job         VARCHAR(45) NOT NULL DEFAULT '직업',
  job_info    VARCHAR(255) NOT NULL DEFAULT '직업소개',
  my_badge    VARCHAR(255) NOT NULL DEFAULT '내소개'
);

-- 2. todo 테이블
CREATE TABLE IF NOT EXISTS todo (
  idx         SERIAL PRIMARY KEY,
  member_id   VARCHAR(45) DEFAULT '아이디',
  subject     VARCHAR(45) DEFAULT '투두리스트 제목',
  content     VARCHAR(45) DEFAULT '투두리스트 내용',
  finish      VARCHAR(45) DEFAULT '투두리스트 완료여부',
  start_date  DATE,
  finish_date DATE
);

-- 3. blog_category 테이블
-- 참고: "order"는 PostgreSQL 예약어라서 큰따옴표로 감쌈
CREATE TABLE IF NOT EXISTS blog_category (
  idx           SERIAL PRIMARY KEY,
  member_id     VARCHAR(25) NOT NULL,
  category_name VARCHAR(100),
  "order"       INTEGER
);

-- 4. blog 테이블
CREATE TABLE IF NOT EXISTS blog (
  idx          SERIAL PRIMARY KEY,
  member_id    VARCHAR(45),
  category_idx INTEGER NOT NULL,
  subject      VARCHAR(255) DEFAULT '블로그 제목',
  content      TEXT,
  tag          VARCHAR(45),
  view_count   VARCHAR(45),
  like_count   VARCHAR(45),
  date         DATE
);

-- 5. diary 테이블
CREATE TABLE IF NOT EXISTS diary (
  idx       SERIAL PRIMARY KEY,
  member_id VARCHAR(45) DEFAULT '아이디',
  subject   VARCHAR(255) DEFAULT '일기제목',
  content   TEXT,
  date      DATE
);

-- ============================================
-- (선택) Row Level Security 활성화
-- Supabase는 보안을 위해 RLS를 권장합니다.
-- 아래 주석을 해제하면 해당 테이블에 RLS가 켜지며, 정책을 따로 추가하기 전까지는 모든 행이 비노출될 수 있습니다.
-- ============================================
-- ALTER TABLE member ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE todo ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE blog_category ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE blog ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE diary ENABLE ROW LEVEL SECURITY;
