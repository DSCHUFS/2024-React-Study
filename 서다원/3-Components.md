### 목차

1. [컴포넌트 소개](#컴포넌트-소개)
2. [Self-Closing Tags](#self-closing-tags)
3. [Fragment 지향하기](#fragment-지향하기)
4. [Fragment 지양하기](#fragment-지양하기)
5. [알아두면 좋은 컴포넌트 네이밍](#알아두면-좋은-컴포넌트-네이밍)
6. [JSX 컴포넌트 함수로 반환](#jsx-컴포넌트-함수로-반환)
7. [컴포넌트 내부의 inner 컴포넌트 선언](#컴포넌트-내부의-inner-컴포넌트-선언)
8. [displayName](#displayname)
9. [컴포넌트 구성하기](#컴포넌트-구성하기)

### 컴포넌트 소개

기존에는 웹 페이지를 만들 때 웹 개발자가 컨텐츠를 마크업한 다음(HTML 스타일링) JavaScript 뿌려(AJAX 같은 인터랙션) 상호작용을 추가했다. 이는 웹에서 상호작용이 중요했던 시절에 효과적이었다.

이제는 많은 사이트와 모든 앱에서 상호작용을 기대한다. React는 동일한 기술을 사용하긴하지만, 상호작용을 우선시한다. 따라서 **React 컴포넌트는 마크업으로 뿌릴 수 있는 JavaScript 함수이다.**

### Self-Closing Tags

Self-Closing Tags 란?

명시적으로 닫는 태그가 필요 없다는 것을 의미. MDN 문서에 void elment 관련 내용을 보면 child 노드를 가지고 있지 않은 태그 목록들이 있다. 이 태그들은 self-closing tags 의 특성을 대부분 가지고 있다.

즉, 열고 닫고 할 필요 없이 열어만 놔도 되는 경우이다.

Vue 같은 경우에는 `<app-Header>` , `<v-header>` 같은 태그를 작성한다면, React 에서는 구분하지 않고 camel case 로만 만든다. 따라서 JSX에서 만든 커스텀 컴포넌트인지, 기본 HTML 요소인지 명확한 차이가 나지 않을 수 있다.

```jsx
<Header></Header>
<header></header>
```

따라서 **React 컴포넌트인데 하위에 아무런 자식요소가 없다면, self-closing tag 를 활용**해서 구분을 두어서 헷갈리지 않도록 하는 것도 방법일 것이다.

### Fragment 지향하기

React 에서 JSX 를 사용할 때 단일 노드만 반환 가능하기 때문에 여러 요소를 반환하려면 <div> 로 감싸야 했다. 하지만 이런 규칙은 불필요한 DOM 요소를 추가하고, 코드를 결국 한 줄 더 쓰게 되며, 스타일링 문제도 일으키기 때문에 React 16.2 버전부터는 Fragment 라는 개념이 도입되었다.

```jsx
<React.Fragment>
  <h1>Title</h1>
  <p>Description</p>
</React.Fragment>
```

<React.Fragment> 는 <div> 대신 사용할 수 있으며 불필요한 DOM 요소 생성을 막을 수 있다. 또한 빈 태그 <> </> (숏컷이라고 부른다)를 사용해서 간단하게 작성할 수 있다. 하지만 이렇게 숏컷을 쓰는데 key 속성을 사용해야하는 경우에는 React.Fragment 로 작성해주어야 할 것이다.

주의 사항이 있다면 Babel 버전 7버전 이상에서 숏컷을 지원한다는 것!

### Fragment 지양하기

위에서 Fragment 를 사용하면 좋을 경우들에 대해서 살펴보았는데, 불필요하게 사용하는 사례도 알아보자

```jsx
   	<React.Fragment>
      <div className="main-container">
        <h1>Title</h1>
        <p>Description</p>
      </div>
    </React.Fragment>

    ⬇️

    <div className="main-container">
      <h1>Title</h1>
      <p>Description</p>
    </div>
```

1.  루트 컴포넌트가 싱글로 되어 있다면 이걸 감쌀 별도의 Fragment 는 필요 없으니 삭제할 수 있다.

```jsx
function MyComponent() {
  return <>"This is a string"</>;
}
⬇️
function MyComponent() {
  return "This is a string";
}
```

1. 이전에는 문자열만 렌더링하면 안되는 시절이 있긴 했으나, 현재는 문자열 그대로 반환해도 JSX에서 충분히 렌더링할 수 있다.

```jsx
<div>
	<h1>{isLoggedIn ? 'User' : <></>}</h1>
</div>
⬇️
<div>
	<h1>{isLoggedIn ? 'User' : null}</h1>
</div>
```

1. Fragment 태그로 아무것도 렌더링하지 않으면 이건 곧 null 이므로, null 로 대체할 수 있다.

Fragment 는 유용하지만 불필요하게 너무 많이 사용하면 컴포넌트의 구조가 복잡해질 수 있다. 따라서 필요하지 않은경우에는 제거함으로써 코드를 간결하게 유지해보자.

### 알아두면 좋은 컴포넌트 네이밍

일반적으로 리액트에서 컴포넌트 네이밍을 할 때에는 PascalCase(단어의 첫 글자를 대문자로 표기)를 사용한다.

리액트는 createElement 함수가 내부적으로 기본 HTML 요소를 소문자로 인식하기 때문이다.

따라서 PascalCase 로 작성된 것은 리액트 커스텀 컴포넌트로 인식되고, 소문자로 작성된 요소는 기본 HTML 요소로 인식한다. → 개발자들이 코드의 역할을 명확히 구분하는데 도움을 준다.

한편, Next.js 프레임워크에서는 라우팅을 위한 파일명에 kebab case(하이픈으로 단어를 구분)을 사용한다. 예를 들어서 component-naming.jsx 파일은 componentNaming 이라는 컴포넌트 네이밍을 할 수 있을 것이다.

컴포넌트를 포함하고 있는 폴더 안에 index.jsx 파일을 사용하는 경우가 많다. 예를들어 아래처럼 말이다.

```jsx
src / components / Button / index.jsx;
Button.css;
```

이때도 컴포넌트 네이밍은 PascalCase 를 따르는 것이 좋다. React.createElement 함수로 JSX를 자바스크립트 코드로 변환하는데, 컴포넌트를 PascalCase 로 네이밍하면 리액트가 이를 커스텀 컴포넌트로 인식하기 때문이다.

결론: 컴포넌트 네이밍 규칙을 이해하고 사용하자!

### JSX 컴포넌트 함수로 반환

```jsx
return <div>{TopRender()} // 컴포넌트를 반환하는 함수</div>;
```

가끔 컴포넌트 안에서 컴포넌트를 바로 렌더링하는 것이 아닌, 함수가 컴포넌트를 반환하게 하도록해서 렌더링을 하는 경우가 있는데 이는 꽤 많은 단점이 있을 수 있다.

첫번째로 Scope를 알아보기가 어렵다. 컴포넌트 내부에서 여러가지 변수를 사용하게 되면 스코프가 꼬일 수도 있고, 함수가 util 함수가 redux 등 다양한 곳에서 사용되어 언제 어떻게 쓰일지 알기 어렵다. ⇒ 자바스크립트 파일로 컴파일될 때 이러한 문제를 걸러내지 못하면 치명적인 이슈가 발생할 수 있다.

두번째로, 컴포넌트가 함수로 반환되면 이게 컴포넌트인지 단순히 연산된 값인지 한 눈에 알아보기가 힘들 수 있다.

세번째로는 props 를 넘기기 힘들 수 있다. 명시적으로 props 를 넘기는 것이 좋기 때문에 정상적인 패턴을 사용하는 것이 좋다.

### 컴포넌트 내부의 inner 컴포넌트 선언

```jsx
const ParentComponent = () => {
  const InnerComponent = () => {
    return <div>Inner Component</div>;
  };

  return (
    <div>
      <h1>Parent Component</h1>
      <InnerComponent />
    </div>
  );
};

export default ParentComponent;

⬇️

import InnerComponent from './InnerComponent';

const ParentComponent = () => {
  return (
    <div>
      <h1>Parent Component</h1>
      <InnerComponent />
    </div>
  );
};

export default ParentComponent;
```

컴포넌트 내부에 다른 컴포넌트를 선언하는 경우가 있는데, 이것은 좋은 습관이 아니다.

먼저, 결합도가 증가한다. 상위 컴포넌트와 하위 컴포넌트가 구조적, 스코프적으로 종속되어서 나중에 분리하기가 어려워진다. 따라서 아예 외부 컴포넌트로 분리하는 것이 결합도가 낮아서 확장성이 높아진다. 상위 컴포넌트의 상태를 props 로 하위 컴포넌트에 전달하는 것이 오히려 구조를 명확히 할 수 있다.

다음으로, 성능이 향상된다. 당연히 상위 컴포넌트가 랜더링될 때, 내부의 하위 컴포넌트들도 재생성 되기 때문에 성능이 저하될 수 있다.

외부 컴포넌트로 분리하면 결국 파일을 하나 더 만드는 것이라 부담스럽다고 느낄 수 있지만 확장성과 가독성 등의 부분에서 더 많은 이점을 얻을 수 있다.

### displayName

displayName 이란 리액트 컴포넌트의 이름을 명시적으로 지정해서, 리액트 devtools 로 디버깅할 때 컴포넌트를 구별하기 쉽게하는 속성이다. 만약 displayName 을 지정하지 않으면 컴포넌트가 익명으로 표시되기 때문에 디버깅을 할 때 쉽지 않을 수 있다.

🔽 기본 컴포넌트에 displayName 설정한 예시

```jsx
const MyComponent = () => {
  return <div>My Component</div>;
};
MyComponent.displayName = "MyComponent";
```

🔽 forwardRef 사용 시 displayName 설정한 예시

```jsx
const Input = React.forwardRef((props, ref) => {
  return <input ref={ref} {...props} />;
});
Input.displayName = "Input";
```

<aside>
💡 forwardRef 이란?
일반적으로 리액트에서 부모 컴포넌트는 자식 컴포넌트 내부 요소에 직접 접근할 수 없다. 하지만 특정 상황에서는 부모 컴포넌트가 자식 컴포넌트의 DOM 요소에 접근해야 할 때가 있다.

forwardRef 는 이러한 상황을 해결하기 위해 사용된다. 이 기능을 사용하면, 부모 컴포넌트가 자식 컴포넌트의 특정 요소에 대한 참조를 직접 전달할 수 있다.

예시는 아래와 같다

```jsx
import React, { forwardRef } from "react";

const MyInput = forwardRef((props, ref) => <input ref={ref} {...props} />);

export default MyInput;
```

MyInput 컴포넌트는 forawrdRef 를 사용해서 파라미터로 받은 ref 요소를 input 요소에 연결한다.

```jsx
import React, { useRef } from "react";
import MyInput from "./MyInput";

const ParentComponent = () => {
  const inputRef = useRef(null);

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div>
      <MyInput ref={inputRef} />
      <button onClick={focusInput}>Focus the input</button>
    </div>
  );
};

export default ParentComponent;
```

위 예시에서 부모 컴포넌트는 useRef 를 사용해서 inputRef 를 생성하고, 이걸 MyInput 컴포넌트로 전달한다. 만약 버튼을 클릭하면 inputRef.current.focus() 를 호출해서 MyInput 컴포넌트의 input 요소에 focus 를 설정한다.

정리하면…
자식컴포넌트에서 forwardRef 를 사용해서 받아온 파라미터인 ref 를 DOM 요소에 연결하고, 부모 컴포넌트에서는 useRef 를 사용해서 만든 참조를 자식 컴포넌트로 전달한다.

</aside>

### 컴포넌트 구성하기

리액트 컴포넌트를 구성하는 방법에 대해서 몇 가지 알아보자

- 변하지 않는 상수는 컴포넌트 외부로 분리하자. ⇒ 리액트나 백엔드에 의해서 변경되지 않기 때문
- 타입스크립트 사용할 때 interface 나 Type alias를 사용해서 타입을 선언하자
- 컴포넌트를 선언할 때 함수표현식(화살표 함수)나 함수 선언문을 사용할 수 있다. 리액트 공식 문서에서는 함수 선언문을 권장한다고 한다
- flag 성의 상태나 ref, 그리고 서드 파티 라이브러리의 hook 을 사용하는 것들은 상단에 놓자
- 커스텀 hook 은 그 아래에 놓고, 내부 상태 관리는 그 아래에 놓자.
- 이벤트 핸들러 함수는 컴포넌트 내부에 선언하자. 리액트와 관련 없는 함수는 외부로 분리할 수 있다
- useEffect 는 최소한으로 사용하며, main JSX와 가까운 곳에 놓자.
- return (JSX를 렌더링하는 부분) 부터는 한번 개행을 통해서 명확히 구분하자.
- 스타일 컴포넌트는 컴포넌트의 하단에 놓거나 파일로 분리하자

But 정답은 없다!
