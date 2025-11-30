### 스크립트

- 시작

1. npm 패키지 설치

   ```
   yarn install
   ```

   1-1. 개발 모드로 시작 시 빌드 없이 다음 실행 (소스 수정이 필요한 경우 개발 모드로 실행해 주세요.)

   ```
   yarn dev
   ```

2. production 빌드

   ```
   yarn build
   ```

3. production mode로 시작

   ```
   yarn start
   ```
   
### Git

- main - 프로덕션 라이브용 브랜치 입니다.
- dev - 개발용 브랜치 입니다.
- feature, fix - develop 브랜치에서 분기되는 브랜치 입니다. 기능 단위로 분기 시에 사용합니다.

### 환경변수

- .env.\* 은 각 환경에 필요한 키값 저장 파일 입니다.
- .env.development - yarn dev(개발모드) 실행 시 적용되는 env 파일
- .env.production - yarn start(운영모드) 실행 시 적용되는 env 파일

---

## 폴더 구성

각 디렉토리가 관리하는 내용입니다.

    pages/ - 디렉토리, 파일 이름으로 라우트가 바인딩 됩니다.(ex pages/test/index.tsx -> http://localhost:3000/test)

    public/ - root 디렉토리입니다. 프로덕션 빌드시에 nextjs환경에 맞게 컴파일됩니다.

    src/ - 페이지에 사용되는 소스코드 폴더입니다.
        components/ - 컴포넌트 디렉토리
        constants/ - 상수 관리 디렉토리
        functions/
            apis/ - API 관리 디렉토리(api controller 기준으로 디렉토리 구분)
            hooks/ - React hooks 관리 디렉토리
            utils/ - 데이터 가공을 위한 함수 디렉토리
        interfaces/ - API 요청 및 응답 interface 정의 디렉토리(functions/apis 디렉토리와 1:1 구분)
        models/ - 응답 interface와 컴포넌트 interface를 바인딩 해주는 DTO 디렉토리
        store/ - React state 관리를 위한 zustand 라이브러리 디렉토리

---

## 기타

소스를 효율적으로 관리하기 위해 사용되는 라이브러리 입니다. (링크를 클릭하여 문서를 참고하세요.)

1. [React Query](https://react-query-v3.tanstack.com) - http 요청 시 로딩 및 에러, 콜백 등을 간편하게 처리해주는 라이브러리
2. [Zustand](https://zustand.docs.pmnd.rs/getting-started/introduction) - React 전역 상태 관리를 위한 라이브러리
3. [Next.js Image Component and Image Optimization](https://nextjs.org/docs/basic-features/image-optimization) - 이미지 최적화를 위한 NextJS 내장 라이브러리

Swagger URL - {API_ROOT_URL}/api-docs

- 사용하고 있는 API의 host에 api-docs로 진입시 swagger 문서를 확인할 수 있습니다.
