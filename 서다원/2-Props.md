### 목차

1. [불필요한 Props 복사 및 연산](#불필요한-props-복사-및-연산)
2. [중괄호 사용법](#중괄호-사용법)
3. [Props 축약하기](#props-축약하기)
4. [Single Quotes(작은따옴표) vs Double Quotes(큰따옴표)](#single-quotes작은따옴표-vs-double-quotes큰따옴표)
5. [알아두면 좋은 Props 네이밍](#알아두면-좋은-props-네이밍)
6. [인라인 스타일 주의하기](#인라인-스타일-주의하기)
7. [CSS in JS 인라인 스타일 지양하기](#css-in-js-인라인-스타일-지양하기)
8. [객체 Props 지양하기](#객체-props-지양하기)
9. [HTML Attribute 주의하기](#html-attribute-주의하기)
10. [...props 주의할 점](#props-주의할-점)
11. [많은 Props 일단 분리하기](#많은-props-일단-분리하기)
12. [객체보다는 단순한 Props의 장점](#객체보다는-단순한-props-의-장점)

### 불필요한 Props 복사 및 연산

props 를 받아와서 사용하는, 안좋은 예시들을 살펴보자

먼저 불필요하게 props 를 복사하는 경우이다.

```jsx
function CopyProps({value}) {
    const [copyValue] = useState(무거운_연산(value));

    return <div>{copyValue}</div>
}

⬇️

function CopyProps({value}) {
    return <div>{value}</div>
}
```

위 코드를 본다면 copyValue 로 굳이 복사를 할 이유가 없다. 그대로 value 값을 사용하면 좋을 것이다.

물론 복사를 하는 이유가 있는 경우도 있을 것이다. 저 props 값을 하위 컴포넌트에서 조작을 해야하는 경우이다.

```jsx
function CopyProps({ value }) {
  const [copyValue] = useState(무거운_연산(value));

  return <div>{copyValue}</div>;
}
```

위 예시에서는 무거운 연산을 통해 나온 값을 state 에 넣어 사용하고 있다. 굳이 상태로 만들어야할까? 라는 생각으로 useState 를 빼서 그냥 변수에 값을 넣는 로직으로 수정했다고 해보자.

```jsx
function CopyProps({value}) {
    const copyValue = 무거운_연산(value);

    return <div>{copyValue}</div>
```

하지만 이러면 렌더링이 될 때마다 저 무거운\_연산이 수행될 것이란걸 예측할 수 있다.

이런 경우에는 useMemo 훅을 사용할 수 있다.

```jsx
function CopyProps({ value }): Element {
  const copyValue = useMemo(() => 무거운_연산(value), [value]);

  return <div>{copyValue}</div>;
}
```

이러면 좀 합당한 코드가 될 수 있겠다.

결론:

1. props 를 복사하는걸 지양하자. → 데이터의 흐름을 끊는 느낌임
2. 무거운 연산을 한다면 그 값은 컴포넌트에 들어오기 전에 처리되는게 좋다.
3. 컴포넌트에 들어와서 처리해야하는 이유가 있는 경우에는 굳이 `useState` 를 사용하려고하진 말자.
4. 단순히 변수에 넣어 쓰기에는 렌더링에 지장이 갈 정도로 무거운 연산이다-라면 `useMemo` 으로 최적화해보는건 어떨까

### 중괄호 사용법

중괄호 { } 를 JSX에서 언제 사용해야하고, 언제 사용하지 않아도 되는걸까?

1. 문자열의 경우

JSX에서 문자열은 따옴표 안에 들어가기 때문에 중괄호 사용하지 않아도 된다.

2. 표현식의 경우

숫자, Boolean, 객체, 함수 등의 경우에는 중괄호로 감싸서 사용한다. JSX 에 값을 동적으로 주입할 수 있다.

3. 더블 중괄호

객체를 인라인으로 JSX에 직접 넣을 때, 객체를 중괄호로 감싸서 표현한다.

```jsx
import React from "react";

const MyComponent = () => {
  return (
    <div style={{ backgroundColor: "blue", color: "white" }}>
      <p>Hello, World!</p>
    </div>
  );
};

export default MyComponent;
```

### Props 축약하기

props 을 사용할 때 `props` 로 받아서 `name={props.name}` 이런식으로 하나하나 넣을 수도 있겠지만,
단축해서 쓰는 것에 집중한다면 스프레드 구문을 사용할 수 있다.

```jsx
function ShorthandProps(props){
    return (
        <header
            className="clean-header"
            title="This is a header"
            isDardMode={true}
            isLogin={true}
            hasPadding={true}
        >
            <ChildComponent {...props} />
        </header>
    )
}

⬇️

function ShorthandProps({isDardMode, isLogin, ...props}){
    return (
        <header
            className="clean-header"
            title="This is a header"
            isDardMode={isDardMode}
            isLogin={isLogin}
            hasPadding // 항상 true 임을 보장함
        >
            <ChildComponent {...props} />
        </header>
    )
}
```

위 예시와 같이 `isDardMode`, `isLogin` 그리고 나머지 props(`…props`)로 나눠서, props 를 객체구조 분해 할당으로 사용할 수 있다.

### Single Quotes(작은따옴표) vs Double Quotes(큰따옴표)

의미없는 논쟁일 수도 있지만 팀에서 일관적인 규칙이 있으면 된다.

예를 들어 백엔드는 “ 를 쓰고, 프론트엔드에서는 ‘ 를 쓰는 곳도 있다고 한다.

```jsx
import React from "react";

function javascript() {
  const obj = {
    hello: "world",
  };
  return (
    <div>
      <a href="http://www.google.com">Google</a>

      <input class="asdf" type="button" value="Click me!" />

      <Clean style={{ backgroundPosition: "left" }} />
    </div>
  );
}

export default javascript;
```

첫번째 `a` 태그에서 큰따옴표를 쓰고 있다. HTML 에서는 기본적으로 큰따옴표를 많이 쓰고 있다.

두번째 `input` 태그는 좋지 않은 예시이다. 작은따옴표와 큰따옴표가 혼용돼서 사용되고 있기 때문이다.

세번째 `Clean` 이라는 컴포넌트를 보면 `style` 속성 안에서는 큰따옴표인데, 맨 위 `obj` 객체에서는 작은 따옴표를 쓰기 때문에 이것도 좋지 않은 예시이다.

정답은 없다고 볼 수 있지만 에어비앤비 ESLint 에서는, JSX도 HTML 을 위한 구문이기 때문에 HTML 에 대한 관용을 따라갈거다-라고 적혀있다.

즉, JSX에서는 큰따옴표를 쓰고 JS에서는 작은따옴표를 쓰겠다는 것이다.

결론: 정답은 없다. 팀끼리의 규칙을 정하고 공유하자. 그리고 정한 규칙을 ESLint 나 포맷팅 도구에 설정해두고, 개발이나 비즈니스 로직에 집중하자(소모적인 논쟁일 수 있다!)

### 알아두면 좋은 Props 네이밍

props 의 네이밍에서 실수할만한 부분들을 살펴보자

```jsx
function PropsNaming() {
  return (
    <ChildComponent
      class="mt-0" // class -> className
      Clean="code" // Clean -> clean
      clean_code="code" // clean_code -> cleanCode
      CLEAN_CODE="code" // CLEAN_CODE -> cleanCode
      otherComponent={OtherComponent} // otherComponent -> OtherComponent
      isShow={true} // can omit isShow={true} -> isShow
    ></ChildComponent>
  );
}
```

1. class 는 className 으로 사용해야한다
2. camel case 로 사용하자.
3. 무조건 true 일 경우에는 `isShow={true}` 가 아닌 `isShow` 로 축약하자
4. 컴포넌트라면 대문자로 시작하자

결국 React 는 자바스크립트로 만들어진 라이브러리이기 때문에 자바스크립트에 대한 관습이 따라오는 편이다.

### 인라인 스타일 주의하기

보통 우리는 객체를 인라인으로 넘길 때 너무 무의식적으로 중괄호 두번 {{ }} 쓰면 돼-라고 외우는 경우가 있는데, 때문에 실수를 하는 경우가 있다. 그래서 아래의 내용을 좀 더 확실히 알고 넘어가는게 좋다.

자바스크립트로 HTML 를 작성할 수 있는 JSX 는 중괄호 안에 표현식을 삽입하며, 객체를 넣을 수 있다.

그렇다보니 객체를 표현하기 위해서 중괄호를 사용하는 것이다.

```jsx
function InlineStyle() {
  return <div style={{ color: 'red' }}>Hello, world!</div>;
}

🟰 // 같은 의미이다

function InlineStyle() {
    const myStyle = { color: 'red' };
    return <div style={myStyle}>Hello, world!</div>;
  }
```

위처럼 JSX에서 인라인 스타일을 쓰려면 중괄호 안에 camelCase key 를 가진 객체를 넣어야한다.

하지만 위처럼 작성한다면, 컴포넌트안에 `myStyle` 이 있기 때문에 렌더링을 할 때 마다 계속 비교되기 때문에 좋지 못하다.

심지어 CSS 가 수정되는 값이 아니기 때문에, 컴포넌트 밖으로 빼서 좀 더 개선할 수 있겠다.

```jsx
// myStyle 을 컴포넌트 밖으로 빼낸 코드
const myStyle = { color: "red" };

function InlineStyle() {
  return <div style={myStyle}>Hello, world!</div>;
}
```

위는 개선한 코드이다.

### CSS in JS 인라인 스타일 지양하기

```jsx
return (
  <button
    css={css`
      background-color: ${primary ? 'blue' : 'gray'};
      color: white;
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      font-size: 16px;
      cursor: pointer;
    `}
  >
    {label}
  </button>
);

⬇️

return (
    <button
      css={[buttonStyles, primary && primaryButtonStyles]}
    >
      {label}
    </button>
  );
```

CSS in JS 에서 인라인 스타일을 사용하는 것보다, 객체로 분리해서 사용하는 방식을 추천한다. 이 방식은 다음과 같은 장점이 있다.

- 스타일의 재사용성을 높이고, 코드의 가독성을 향상시킨다(로직을 집중해서 볼 수 있기 때문에). 동적인 스타일을 실수로 건드는 확률이 적어진다. → DX 개선
- 인라인 스타일의 경우 계산 로직이 매 렌더링마다 실행된다.

### 객체 Props 지양하기

객체를 Props 로 넘기는 것을 왜 지양해야하는지 알아보자.

아래의 예시 코드를 보자.

```jsx
Object.is(
  { name: "John" }, // 초기 렌더링
  { name: "John" } // 두번째 렌더링
);

Object.is(
  ["hello"], // 초기 렌더링
  ["hello"] // 두번째 렌더링
);

// result: false, false
```

사람이 보았을 때에는 같다고 보지만 둘다 결과는 `false` 가 나온다. 자바스크립트에서 `Object.is` 메서드는 두 값을 엄격하게 비교하기 때문에, 완전히 같은 객체나 값일 때에만 true 를 반환한다.

<aside>
💡 이때 완전히 같다-라는 말은 두 변수가 동일한 메모리 주소를 참조하고 있어야 함을 의미한다.

</aside>

먼저 첫번째 객체 리터럴을 보자. 각각의 객체는 코드가 실행될 때마다 새로운 메모리 주소에 생성된다. 따라서 객체의 내용은 같을지라도 서로 다른 메모리 위치에 있기 때문에 `false` 를 반환한다. 두번째 배열 리터럴도 마찬가지이다. 이것 또한 실행될 때마다 새로운 메모리 주소에 생성된다.

리액트에서 Props 로 객체를 전달하면 컴포넌트가 렌더링될 때마다 새로운 객체가 생성된다. 리액트가 props 를 비교할 때에는 기본적으로 얕은 비교를 한다. 하지만 새로운 객체는 매번 다른 메모리 주소를 갖기 때문에 리액트는 props가 변경되었다고 판단하고 컴포넌트를 불필요하게 리렌더링할 것이다.

그러면 어떻게 해야할까?

1. 변하지 않는 값이라면, 컴포넌트 외부로 옮기자.

컴포넌트가 리렌더링 될 때마다 새로 생성되는 것을 방지할 수 있다. → 불필요한 메모리 할당을 줄이고 성능을 향상시킬 수 있다.

```jsx
const staticData = { key: "value" }; // 외부에 선언

function MyComponent(props) {
  return <div>{staticData.key}</div>;
}
```

`MyComponent` 가 리렌더링 되더라도 `staticData` 는 변하지 않기 때문에, `staticData` 를 사용하는 부분에서 불필요한 리렌더링이 발생하지 않는다.

1. 필요한 값만 객체를 분해해서 Props 로 내려주자.

```jsx
import React, { useState } from "react";

function ParentComponent() {
  const [userList, setUserList] = useState(["John", "Jane", "Doe"]);

  return <ChildComponent firstName={userList.at(0)} />;
}
```

위 예시처럼 필요한 것만 props로 내려주는 방법도 있겠다.

```jsx
function SomeComponent({ heavyState }) {
  const computedState = useMemo(
    () => ({
      computedState: heavyState,
    }),
    [heavyState]
  );

  return <ChildComponent computedState={computedState} />;
}
```

1. 값 비싼 연산, 잦은 연산이 있을 경우 `useMemo()` 활용

아니면 `useMemo`를 사용할 수도 있다. `heavyState` 의 변화가 있을 때에만 `computedState` 가 다시 계산되기에 개선할 수 있다.

### HTML Attribute 주의하기

HTML, JS에서 정의한 예약어와 커스텀 컴포넌트 props 가 혼용되지 않도록 하자

### …props 주의할 점

스프레드 연산자는 객체를 구조 분해할 수 있는 자바스크립트 문법이다. 이 문법으로 하위 컴포넌트에 props 를 넘기는 일이 많은데 주의할 점이 코드를 예측하기 어렵다는 것이다.

props 가 뭔지 알려면 타고 올라가야한다. props drilling 가 다를게 없으며 리팩토링을 포기해야할 수도 있다.

```jsx
const ParentComponent = () => {
  const { 관련없는_props, 관련있는_props, ...나머지_props } = props;

  return <ChildComponent 관련있는_props={관련있는_props} {...나머지_props} />;
};
```

따라서 위와 같이 props 에서 스프레드 연산자가 쓰이는 경우,

관련 없는 props, 관련 있는 props, 나머지 props 로 구분을 해서 자식 컴포넌트에 넘기는 방법을 추천한다.

관련 없는 props 는 버리고(하위 컴포넌트로 보내지 않고), 관련 있는 props 는 명시적으로 내려 보내는 것이다.(유지보수할 때 더 편해진다.)

관련 없는 props 를 버리는 것이 불필요한 행위아닐까-라고 생각할 수 있지만 불필요한 객체 더미를 내려 보내는 것보다는 나을 수 있다.

### 많은 Props 일단 분리하기

너무 많은 props 를 넘기는 경우 상태관리 라이브러리를 사용하고, 구조를 바꿔야하고… 이런 부분에 신경을 많이 쓰려고 하는 편인데 이것보단 일단 1차적으로 one depth 분리를 해보는 것이 좋다.

```jsx
const App = () => {
  return(
    <JoinForm
    user={user}
    auth={auth}
    location={location}
    favorite={favorite}
    handleSubmit={handleSubmit}
    handleReset={handleReset}
    handleCancel={handleCancel}
    />
  )
}

⬇️

const App = () => {
  return (
    <JoinForm
      onSubmit={handleSubmit}
      onReset={handleReset}
      onCancle={handleCancel}
    >
      <CheckBoxForm formData={user} />
      <CheckBoxForm formData={auth} />
      <RadioButtonForm formData={location} />
      <SectionForm formData={favorite} />
    </JoinForm>
  );
};
```

변경된 코드에서는 `JoinForm` 이 처리해야할 핸들러만 직접 관리하고, 다른 데이터항목은 별도의 컴포넌트로 분리해서 전달한다.

특히 별도의 컴포넌트로 분리를 할 때, 이 컴포넌트들에는 도메인 네임이 들어가지않도록 해서 확장하기 용이하도록 할 수 있다. 도메인 로직은 별도의 컨텍스트나 훅으로 분리하는 것이다(위 예시에서 `formData`로 관리하는 것처럼)

### 객체보다는 단순한 Props 의 장점

아래의 예시처럼 객체 하나를 통으로 props 로 내려주는 경우가 있을 수 있다. 하지만 props 를 단순하게 줄여보는 것을 추천한다.

```jsx
const UserInfo = ({ user }) => {
  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
    </div>
  );
}

⬇️

const UserInfo = ({ name, email }) => {
  return (
    <div>
      <h1>{name}</h1>
      <p>{email}</p>
    </div>
  );
}
```

정말 큰 컴포넌트라면 이 객체가 필요한 데이터만 받아오고 있는 것일지 의심될 수 있고, 그렇게 되면 `UserInfo` 컴포넌트의 위에 있는 상위 컴포넌트들에 따라서 불필요한 생명 주기를 따라가지는 게 아닐까 의심될 수도 있다(`user` 객체가 다시 생성되면 `UserInfo` 컴포넌트가 리렌더링 되기 때문)

따라서 부모 컴포넌트에서 내려오는 props 를 좀 평탄화하는 것이 좋을 수 있다 → 사용할 것만 가져오는 것이다.

나중에 쓸까봐 한번에 가져오는 걸 선호할 수도 있지만, 사용할 것만 가져오면 `memo`로 최적화 하는 것도 더 쉽고 가져오는 props 도 명확해져서 불필요한 렌더링을 줄일 수 있다.
