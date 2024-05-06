### 목차

1. [불필요한 Props 복사 및 연산](#불필요한-props-복사-및-연산)
2. [중괄호 사용법](#중괄호-사용법)
3. [Props 축약하기](#props-축약하기)
4. [Single Quotes(작은따옴표) vs Double Quotes(큰따옴표)](#single-quotes작은따옴표-vs-double-quotes큰따옴표)
5. [알아두면 좋은 Props 네이밍](#알아두면-좋은-props-네이밍)
6. [인라인 스타일 주의하기](#인라인-스타일-주의하기)

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
