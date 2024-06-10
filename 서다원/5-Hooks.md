### 목차

1. [Hooks API 소개](#hooks-api-소개)
2. [useEffect() 기명 함수와 함께 사용하기](#useeffect-기명-함수와-함께-사용하기)
3. [한 가지 역할만 수행하는 useEffect()](#한-가지-역할만-수행하는-useeffect)
4. [Custom Hooks 반환의 종류](#custom-hooks-반환의-종류)
5. [useEffect() 내부의 비동기](#useeffect-내부의-비동기)

### Hooks API 소개

요즘은 클래스 컴포넌트를 경험하지 않고 리액트를 배우는 사람들이 많지만, 그래서 클래스 컴포넌트의 필요성과 Hooks API로의 전환 이유를 이해하는 것이 중요하다.

HOC(Higher-Order Component)

- HOC는 컴포넌트 로직을 재사용하기 위한 패턴으로, 리액트 공식 API 가 아닌 구성 요소이다. 컴포넌트 로직을 유연하게 확장하기 위해 HOC와 Render Props 패턴을 사용한다.

클래스 컴포넌트의 문제점: 컴포넌트를 만들 때 React.Component를 확장하고 render() 를 호출하는 등 무거운 작업이 필요하다

→ 문제 해결을 위해 StatelessComponent(단순히 props 를 렌더링만 해주는 컴포넌트의 개념) 개념이 등장했다

Hooks 의 등장

- Dan Abramov 를 비롯한 리액트 개발진이 함수형 컴포넌트에서 state 와 lifecycle을 관리할 수 있는 방법을 모색했다.
- Hooks API가 공식적으로 도입되면서 클래스 컴포넌트는 점점 뒷전으로 밀려나게 되었다. 이런 Hooks 는 Vue에도 영향을 주었다고 한다.

### useEffect() 기명 함수와 함께 사용하기

기명함수(Named Funciton)란? 이름이 존재하는 함수! 자바스크립트에서 함수는 변수에 담거나 다른 함수의 인자로 전달할 수 있다. 모던 자바스크립트에서는 화살표 함수도 많이 사용된다.

```jsx
// 기명 함수
function namedFunction() {
  console.log("This is a named function");
}

// 익명 함수
const anonymousFunction = function () {
  console.log("This is an anonymous function");
};
```

`useEffect`로 담은 로직 부분(익명 함수)을 네이밍해서 기명 함수로 만들어보자. ⇒ 로직을 직접 살펴보지 않아도 코드를 읽는 사람이 어떤 역할을 하는지 한눈에 알 수 있다.

```jsx
useEffect(function addEvent() {
  document.addEventListener("eventName", eventHandler);

  return function removeEvent() {
    document.removeEventListener("eventName", eventHandler);
  };
}, []);
```

**이 방법의 가장 큰 장점은?**

⇒ 에러가 터져서 디버깅을 할 때 함수 네이밍이 로그에 콜 스택으로 쌓이기 때문에, 사용하는 useEffect에 어떤 함수들에 문제가 생겼는지 쉽게 확인이 가능하다.

### 한 가지 역할만 수행하는 useEffect()

한번에 하나의 역할만 수행하는 `useEffect` 를 만들어보자. 객체지향 프로그래밍의 단일 책임 원칙처럼 `useEffect` 도 원칙을 따르면 얻을 수 있는 이점이 있다.

1. `useEffect`에 넘기는 첫번째 콜백에 기명함수를 적용해보자
2. dependency arrays 에 너무 많은 관찰대상이 들어가고 있는게 아닌지 점검한다.

```jsx
import React, { useEffect, useState } from "react";

function MyComponent() {
  const [token, setToken] = useState(null);
  const [newPath, setNewPath] = useState("/home");

  useEffect(
    function handleLogin() {
      if (token) {
        console.log("Logging in with token:", token);
        // 로그인 처리 로직...
      }
    },
    [token]
  );

  useEffect(
    function handleRedirect() {
      if (newPath) {
        console.log("Redirecting to:", newPath);
        // 리다이렉트 로직...
      }
    },
    [newPath]
  );

  return <div>My Component</div>;
}
```

위 예시에서는 `useEffect` 가 하나의 역할만 수행하도록 분리해서 코드의 명확성을 높인 것을 알 수 있다.

### Custom Hooks 반환의 종류

리액트에서는 커스텀 훅을 사용할 때 다양한 반환 형태를 만들 수 있는데, 상황에 맞게 적절하게 반환 형태를 정하는 것이 좋다.

1. 배열 구조 분해 할당

보통 배열 형태로 반환하는 방식은 useState 와 같은 훅에서 사용된다. getter 와 setter 형태로 반환하는 것이 일반적인데, 첫번째를 getter, 두번째를 setter 로 반환하자. 인덱스 위치가 달라지면 순서 헷갈리기 쉽다.

```jsx
function useCustomHook() {
  const [value, setValue] = useState(0);
  return [value, setValue];
}
```

2. 하나의 value 만 있는 경우

반환할 값이 하나의 value 뿐인데도 배열이나 객체로 싸서 보내는 경우가 있는데, 하나의 value 만 반환해도 괜찮다.

3. 객체로 반환하기

배열 형태로 반환하면, 배열은 인덱스를 기반으로 하기 때문에 확장성이 좀 떨어질 수도 있다. 따라서 객체 형태로 반환하면 각 요소에 이름을 붙여서 사용할 수 있기 때문에 필요한 값만 추출하고 싶은 상황에 유용하게 쓰일 수 있다. 코드의 명확성과 유지보수성이 높아질 수 있을 것이다.

```jsx
const useSomeHooks = (bool) => {
	return {
		first,
		second,
		third,
		rest,
	}
}

function ReturnCustomHooks(){
	const {first: fisrtValue, second: secondValue, rest: thirdValue} = useSomeHooks(true);
```

정답은 없겠지만 무리해서 배열 형태로만 커스텀 훅 반환을 만들지는 말고 배열 구조 분해 할당, 객체 구조 분해 할당 모두 적절히 상황에 따라 사용하자!

### useEffect() 내부의 비동기

`useEffect` 내부에서 직접적으로 `async` 를 사용할 수 없다. `useEffect` 의 첫번째 인자로 넘기는 콜백함수가 비동기 함수면 `promise` 를 반환하게 되기 때문이다(`useEffect` 는 `promise` 반환을 허용하지 않는다. 대신 반환값으로 함수나 `undefined` 만 허용한다.)

```jsx
useEffect(async () => {
  const response = await fetchData();
  // 이렇게 하면 안됩니다.
}, []);

⬇️

useEffect(() => {
  const fetchData = async () => {
    const response = await fetchData();
    // 데이터 처리 로직
  };
  fetchData();
}, []);
```

위처럼 비동기 작업은 `useEffect` 내부에서 일반함수로 만들고, 함수 내부에서 비동기 작업을 처리해야한다.

따라서 아래처럼 즉시 실행 함수 표현(IIFE)를 사용해서 비동기 작업을 처리할 수도 있다.

```jsx
useEffect(() => {
  (async () => {
    const response = await fetchData();
    // 데이터 처리 로직
  })();
}, []);
```

또는 TanStack Query 같은 data fetching 라이브러리를 사용하는 것이 권장되기도 한다.

결론: `useEffect`의 콜백함수로 비동기 함수를 바로 넣을 수 없다. 동작이 불안정해지기 때문이다.
