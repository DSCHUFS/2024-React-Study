## 1. 컴포넌트란?
리액트를 구성하는 필수 요소
- 구 버전(?) React 문서의 컴포넌트 설명
  - 스스로 상태를 관리하는 `캡슐화`된 컴포넌트(like 알약)
  - 이 컴포넌트를 조합하고, 복잡한 UI를 캡슐화
  - 컴포넌트 로직은 템플릿이 아닌, JS로 작성한다 (JS XML -> JSX)
    - HTML을 JS 안에 넎는다
  - 결론
    - 다양한 데이터를 앱 안에서 손쉽게 전달하고 DOM 과는 별개로 상태를 관리할 수 있는 도구

- 새로운 버전 React 문서의 컴포넌트 설명
  - `기존에는`
    - 웹 페이지 제작시 개발자가 컨텐츠를 마크업한 다음 JS를 뿌려(Ajax 같은 인터렉션) 상호작용을 추가

  - `이제는`
    - 많은 사이트, 모든 앱에서의 상호작용을 기대
    - React는 동일한 기술 사용과 동시에 상호작용을 우선시
    - React 컴포넌트 =  마크업으로 뿌릴 수 있는 JS 함수

기존에는 많은 인터렉션이 필요 없었기에 상태관리가 굳이 필요하지 않았음  
요새의 모던 앱에서는 모바일, 태블릿, 데탑등 다양한 플랫폼 지원과 동시에 수많은 인터렉션이 발생

- 실제 사례에서의 컴포넌트
  - 무언가를 `구성하는`, `구성요소, 성분`이라는 사전적의미  
  - 즉 element와 같은 요소를 얽고 구성한다.  
  - 즉 HTML의 요소를 구성하고 붙인다.(like 레고블럭, 밀키트)

---
- Thinking in React 공식문서  
리액트 개발팀이 리액트의 사고방식으로 어떻게 컴포넌트를 만들어 나갈까?  
상태를 어떻게 만들어 나갈까?  

[Thinking in React(React Official Docs)](https://react.dev/learn/thinking-in-react)
1. UI를 컴포넌트 계층으로 쪼개기
2. Interaction 없이 UI 렌더링 구현(정적인 버전 구현)
3. 최소한의 데이터만 이용, UI 의 State 표현
  - `State가 될 요소`를 결정하는 3가지 질문
    - `시간이 지나도 변치 않나요?`
    - `부모로 부터 Props통해 전달 되나요?`
    - `컴포넌트 안의 다른 State, Props 갖고 계산 가능한가요?`  
  => 세가지 중 하나라도 해당되면 State가 아님
4. State의 위치 정하기
  - React = 컴포넌트 계층 구조를 따라 `부모에서 자식으로 데이터가 전달`되는 단방향 데이터 흐름 구조
    - 해당 State를 기반으로 렌더링하는 모든 컴포넌트 찾기
    - 그들의 `공통된 부모 컴포넌트` (= 모두를 포괄하는 컴포넌트 찾기)
  - `공통 부모의 State`나 `공통 부모의 상위 컴포넌트`에 그냥 두면 됨
    - 만약 적절한 컴포넌트가 없다면 상위에 하나 만들어주기
5. `역 데이터 흐름` 추가하기
  - 사용자 입력에 따라 State 변경하려면 반대방향의 흐름을 만들어야 함
    - useState 등의 Hook, 이벤트 핸들러 등 을 통해 State를 업데이트 하기

---

## 2. Self-Closing Tags
- 명시적으로 닫는 태그가 필요 없음을 의미함.
- 기본적으로 html은 여는태그, 닫는 태그의 구분이 존재함
- JSX를 사용하기 때문에 활용할 수 있는 것들이 있다.
  - 하위노드들을 갖지 않는 태그들은 self-closing tag를 가진다.

- Vue는 html의 기본태그를 jsx로 만들지 못함 (ex. `v-header`, `v-link` 등)
```jsx
<Img></Img>

<Img />
```
**결국 기본 HTML요소 인지 아닌지 명확하게 차이를 가져아 한다**
- 리액트 컴포넌트가 하위에 뭐 없으면 깔끔하게 사용해보자
- 자식 요소를 가질 수 없는 Void Element 에 알고, 닫는 태그가 진짜 필요한지 파악하자

## 3. Fragment 지향하기
- JSX를 활용할때 단일 요소가 아니면 반환할 수 없다는 중요한 규칙이 있음
- 따라서 div와 같은 요소로 감싸서 내보내기도 했음(런타임에 스타일이 깨지고 코드가 늘어나는 문제)
- 이를 `React.Fragment`를 활용해서 해결해보자.
  - 숏컷 활용 가능
    - 단, 루프를 돌릴때 인덱스가 필요하다면 숏컷말고 Fragment 호출하자
    - 또한 숏컷같은 경우 `babel버전` 에따라 활용이 불가능할 수 도 있으니 확인 꼭 할 것
    ```jsx
    <>
      <dt>{item.term}</dt>
      <dd>{item.description}</dd>
    </>

    <React.Fragment key={id}>
      <dt>{item.term}</dt>
      <dd>{item.description}</dd>
    </React.Fragment>

    ```
  - 클래스형 컴포넌트에서도 가능

``` jsx
function Component() {
  return (
    <div>
      <ChildA />
      <ChildB />
    </div>
  )
}

function Component() {
  return (
    <React.Fragment> // <> 같은 숏컷 사용도 가능
      <ChildA />
      <ChildB />
    </React.Fragment>
  )
}
```
- Fragments는 DOM에 별도의 노드를 추가하지 않고 여러자식을 그룹화 할 수 있음

## 4. Fragment 지양하기
- 굳이 사용할 필요가 없는데 사용하는 경우가 좀 있다.


- 불편한(불필요한) Fragment 사용
  - 구조가 깊어지면서 중첩이 되면 보기 불편함, 개행 하나라도 지워서 깔끔한건 어떨까?
  - 최종적으로 Fragment로 감싸는 것이 항상 의미있는 작업이 아닐 수도 있다.
  - 요새는 String Render, Array Render 도 상관이 없음.
```jsx
  return (
    <>
      <div>
        <ChildA />
        <ChildB />
      </div>
    </>
  )

  return <>hello World</>;
  // null 반환과 동일 -> 불필요한 반환
  return <h1>{isLooggedIn ? "User" : <></>}</h1>;
```

```jsx
  return (
    <>
        <ChildA />
        <ChildB />
    </>
  )

  return "hello World"

  return isLooggedIn && <h1>User</h1>
```

## 5. 알아두면 좋은 컴포넌트 네이밍

```jsx
function ComponentNaming(): Element {
  return (
    <>
      <h1></h1>
      <h2></h2>
      <div></div>
      <input />
      <MyComponent></MyComponent>
      <my-component></my-component>
    </>
  );
}
```
- 일반적 컴포넌트는 PascalCase
- 기본 HTML 요소는 lowercase  
다른 방식의 네이밍을 통해 두가지를 구분할 수 있게 됨  
- Next.js의 등장
  - routing 기반의 파일 네이밍은 kebab-case를 사용
  - ex. component-naming.jsx/index.js
- 어찌 되었든 컴포넌트 네이밍은 PascalCase의 일관된 사용을 통해 다른 개발자가 구분할 수 있도록 하는 것이 핵심
- 네이밍에도 왜 이런 네이밍을 지향하는지 생각해보는 것이 좋은 기회가 될 수 있다.

## 6. JSX 컴포넌트 함수로 반환
- 컴포넌트 안에 함수를 반환하는 JSX형태로 컴포넌트를 렌더링하는 경우
  - 문제없이 동작하기 때문에 이 안에 JSX나 표현식으로 함수를 집어넣는 경우가 더러 있음.
```jsx
return (
    <div>
      {TopRender()}
      <TopRender />
      {renderMain({
        
      })}
    </div>
  );
```
1. Scope 꼬임 문제 발생가능
2. Props를 넘기는 것이 까다로움
3. 반환 값을 바로 알기 어려움


## 7. 컴포넌트 내부에 컴포넌트 선언
```jsx
// X
function OuterComponent() {
  const InnerComponent = () => {
    return <div>Inner Component</div>;
  }
  return (
    <div>
      <InnerComponent />
    </div>
  )
}

// O -> 내부 컴포넌트를 밖으로 이동
const InnerComponent = () => {
  return <div>Inner Component</div>;
}

function OuterComponent() {
  return (
    <div>
      <InnerComponent />
    </div>
  )
}
```
- 단점
1. 결합도가 증가함 => 컴포넌트와 상위 컴포넌트가 구조적,스코프적으로 종속
  - 확장성이 생겨서 분리할때 매우 힘들어짐
2. 성능의 저하
  - 상위 컴포넌트의 리렌더링은 하위 컴포넌트 역시 재생성

- 보기 싫지만 확장성을 생각한 개발을 염두에 두고 외부로 빼버리자

## 8. displayName 속성 사용하기
- 중요한 디버깅요소!(React Devtool)
- ESLint Rule에도 존재함
```jsx
const InputText = forwardRef((props, ref): Element => {
  return <input type='text' ref={ref} />;
});
InputText.displayName = 'InputText'; // 존재유무에 따른 차이
```
- HOC 사용시에도 동적으로 바인딩 되기 때문에 display 사용하는 것이 좋다
```jsx
const withRouter = (component) : (props:any) => Element => {
  return (props):Element => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    const navigationType = useNavigationType();
    return (
      <Component 
        {...props}
        location={location}
        navigate={navigate}
        params={params}
        navigateType={navigateType}
      />
    )
  }
}

const withRouter = (component) : (props:any) => Element => {
  const WithRouter =  (props):Element => {
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();
    const navigationType = useNavigationType();
    return (
      <Component 
        {...props}
        location={location}
        navigate={navigate}
        params={params}
        navigateType={navigateType}
      />
    )
  }
  WithRouter.displayName = Component.displayName ? Component.name ?? 'WithRouterComponent';
  return WithRouter
}
```

## 9. 컴포넌트 구성하기(정답은 없음)
1. 상수는 어디에 선언할까?
2. 타입 선언시 interface와 type 중 어떤걸 사용할까?
3. 컴포넌트 Props 타입명은 어떤 규칙으로 정의하나요?
4. 컴포넌트 선언시 const와 function 중 어떤걸 사용하나요?
5. 어떤 순서로 컴포넌트 내부 변수를 선언하나요?
6. useEffect는 어디에 선언하나요?
7. JSX return 하는 규칙이 있나요?
8. styled-componenet는 어디에 선언하나요?

```jsx
import React, { useRef, useState } from 'react'

// 변하지 않는 상수값은 외부로 빼자
const DEFAULT_COUNT = 100;

// interface, type-Alias 타이핑 
interface SomeComponentProps {

}

// 화살표 함수로 표현식인지, 함수 선언문을 사용하는지
// 공식문서는 과거는 표현식 요새는 선언문
const SomeComponent = ({prop1, prop2}: SomeComponentProps) => {
  // 플래그성 상태, ref, third-party library hook들은 상위에 놔둠
  let isHold = false;

  const ref = useRef(null);

  const location = useLocation();
  const queryClient = useQueryClient();
  const state = useSelector((state) => state);
  // 커스텀 훅
  const state = useCustomHooks((state) => state);
  // 컴포넌트의 내부 상태
  const [state, setStaet] = useState("SomeState");
  // 이벤트 함수
  const onClose = () => handleClose();
  const onClose = () => handleClose();
  const onClose = () => handleClose();
  const onClose = () => handleClose();
  // Early Return JSX
  if(isHold) {
    return <div>데이터가 존재하지 않습니다</div>
  }

  // useEffect -> Main JSX와 가장 가까운 곳에 위치
  useEffect(() => {
    first
  
    return () => {
      second
    }
  }, [third])
  
  // JSX 반환은 항상 사전에 개행을 동반
  return (
    <div></div>
  )

}
```
