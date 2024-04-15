### 목차

1. [일단, 상태가 무엇일까?](#일단-상태가-무엇일까)
2. [상태 초기값이란](#상태-초기값이란)
3. [업데이트되지 않는 값](#업데이트되지-않는-값)
4. [플래그 상태](#플래그-상태)
5. [불필요한 상태](#불필요한-상태)

### 일단, 상태가 무엇일까?

상태는 일단 종류가 너무 많다. 컴포넌트 상태, 전역 상태, 서버 상태(tanStack query 에서 나오는 개념) 등. 그리고 이런 상태들을 관리하기 위한 행동들이 있다. 상태 변경과 최적화, 렌더링 최적화, 불변성, 상태 관리자 등.. 생각할 것들이 다양하다!

### 상태 초기값이란

- 가장 먼저 렌더링될 때 순간적으로 보여질 수 있는 값
- (당연히) 초기에 렌더링 되는 값

초기값 설정은 컴포넌트의 상태를 예측가능하게 만들고, 런타임에러나 불필요한 조건문을 쓰는 것을 방지하는 데에 핵심적인 역할을 한다.

### 초기값을 지키지않을 경우

- 렌더링 이슈, 무한 루프, 타입 불일치로 의도치 않는 동작, 런타임에러가 발생할 수 있다.
  - 예를 들어 `useEffect` 같은 hook 을 사용할 때 상태가 변경되면서 반복적으로 트리거되는 문제(무한루프)가 발생할 수 있다.
- 초기값이 없을 경우 `undefined` 상태가 된다.
  예) 초기값 설정안한 상태로 `.map()` 같은 배열 함수를 호출하면 `undefined` 상태에서는 작동하지 않아서 에러가 발생할 것이다.
- 상태를 CRUD → 상태를 지울때 초기값을 잘 기억해놔야 원상태로 잘 돌아간다.
- 초기값이 없으면 불러온 데이터가 있는지 없는지 유무를 검사하는 조건문이 추가되어야해서 불필요한 코드를 추가해야한다.

결론: 상태의 초기 상태를 올바르게 설정해줄 필요가 있다.

### 업데이트되지 않는 값

변수를 컴포넌트 내부에 직접적으로 가지고 있을 때를 생각해보자.

보통 상수를 다루거나 방치를 하는 상황일 텐데, 업데이트가 되지않는 일반적인 객체일 것이다.

```tsx
function MyComponent() {
	const INFO = { ... }
	...
}
```

만약 위와 같은 상황이라면, `MyComponent` 라는 컴포넌트가 렌더링 될 때마다 `INFO` 객체를 재참조 하게 된다. 따라서 `INFO` 객체는 외부로 내보내는 것이 좋다.

<aside>
💡 재참조되는 것이 왜 안 좋은지 톺아보기

만약 `MyComponent` 컴포넌트 내부에서 `INFO` 객체를 정의할 경우, INFO 는 MyComponent 가 렌더링될 때마다 새로운 메모리 주소를 객체로 생성된다. JavaScript 의 객체가 레퍼런스 타입이기 때문에 이런 현상이 발생한다.

문제점

1. 매 렌더링 마다 `INFO` 객체가 새로 생성되어서 기존에 있던 `INFO` 객체는 가비지 컬렉션의 대상이 된다.
   → 메모리 사용량이 증가

2. 만약에 `INFO` 객체를 자식 컴포넌트로 넘겨주면, 부모 컴포넌트(`MyComponent`)가 렌더링 될 때마다 자식 컴포넌트는 새로운 `INFO` 객체를 받기 때문에 자식컴포넌트 또한 불필요한 리렌더링을 겪을 수 있다.
   → 컴포넌트 최적화 방해

</aside>

만약에 `INFO` 객체를 컴포넌트의 외부로 빼내면, 외부에 정의된 `INFO` 는 애플리케이션이 로드될 때 한 번만 생성된다. → 여러 컴포넌트에서 재사용할 수 있다.

그리고 `INFO` 객체의 참조가 변경되지 않아서 컴포넌트들의 불필요한 리렌더링을 줄일 수 있다.

결론: 변경되지 않는 데이터는 리액트 상태로 만들거나 아예 외부로 내보내는 것이 좋다.

### 플래그 상태

플래그 값 : 프로그래밍에서 주로 특정 조건 혹은 제어를 위한 조건을 불리언으로 나타내는 값

보통 무조건 상태를 만들어서 데이터를 관리할 생각을 한다. 하지만 상태가 아닌 내부 변수로 관리할 수 있는 값이라면 내부 변수로 관리하는 것이 더 좋다.

예를 들어서 `isLogin` 이라는 로그인 상태를 나타내는 데이터를 관리하는 방식을 생각해보자.

```tsx
import React, { useState } from 'react';

function LoginComponent() { // 상태가 변경될 때마다 컴포넌트가 재렌더링 된다.
  const [isLogin, setIsLogin] = useState(false);

	useEffect(() => {
    if (hasToken && hasCookie && isValidCookie) {
      setIsLogin(true);
    } else {
      setIsLogin(false);
    }
  }, [hasToken, hasCookie, isValidCookie]);

  ...

}
```

위처럼 `useState` 를 사용하는 방식은, 상태가 변경될 때마다 컴포넌트가 재렌더링된다. 상태가 변경될 때마다 변화를 UI에 즉시 반영할 수 있다는 점에서는 좋을 것이다. 하지만 로그인상태가 즉각적인 UI 업데이트에 영향을 주어야할까? 그건 아니다.

아래의 방식처럼 바꿔보자.

```tsx
import React, { useRef } from 'react';

function LoginComponent() {
	const hasToken = true;
  const hasCookie = true;
  const isValidCookie = true;
  const isLogin = hasToken && hasCookie && isValidCookie

  ...

  );
}

```

이 방식은 내부 변수를 사용했다. `useState` 를 사용하지 않기 때문에 **불필요한 재렌더링을 피할 수 있다**. `isLogin` 이 일종의 플래그 값이 된 것이다.

따라서 UI에 즉각적인 반영이 필요한 것이 아니라면, 내부 변수 방식을 사용하는 것이 좋을 수 있다.

결론: 플래그 값을 만들 때 굳이 `useState`를 이용해서 상태로 만들지 않고, **컴포넌트 내부 변수로 플래그를 정의**하자.

### 불필요한 상태

컴포넌트 내부에서의 변수는 렌더링마다 고유한 값을 가진다.

```tsx
const [userList, setUserList] = useState(MOCK_DATA);
const [compUserList, setCompUserList] = useState(MOCK_DATA);

useEffect(() : void => {
	const newList = compUserList.filter((user) : boolean => user.completed === true);
	setUserList(newList);
}, [userList]);

...
```

위 코드에서는 `compUserList` 에서 완료된 사용자만 필터링해서 `userList` 로 설정하는 로직을 포함한다.

이러한 코드는 큰 낭비일 수 있다. `compUserList` 가 업데이트 되는 값이고, 렌더링 마다 고유의 값을 가질 수 있다면 내부의 변수로 사용하는 것이 더 나을 수 있다.

아래와 같이 내부변수로 코드를 수정해보자.

```tsx
const [userList, setUserList] = useState(MOCK_DATA);
const compUserList = compUserList.filter((user) : boolean => user.completed === true);

...
```

`compUserList` 를 상태가 아닌, 변수로 처리했다. 이 변수는 컴포넌트의 렌더링마다 고유의 `compUserList` 값으로 새롭게 계산된다. 상태로 관리될 필요가 없기에, 불필요한 리렌더링을 방지하는 것이다. 따로 `useState` 의 `set` 을 해줄 필요도 없다.

(다른 프레임워크에서는 `computed value` 라고 흔히 부르는데, React 에서 공식적인 용어는 아니다.)

결론: 하드하게 계속 `set` 으로 상태를 수정하지 않고 변수에 표현식을 이용해서 담아도 좋다.
