### 목차

1. [일단, 상태가 무엇일까?](#일단-상태가-무엇일까)
2. [상태 초기값이란](#상태-초기값이란)
3. [업데이트되지 않는 값](#업데이트되지-않는-값)
4. [플래그 상태](#플래그-상태)
5. [불필요한 상태](#불필요한-상태)
6. [useState 대신 useRef](#usestate-대신-useref)
7. [연관된 상태 단순화 하기](#연관된-상태-단순화하기)
8. [연관된 상태 객체로 묶어내기](#연관된-상태-객체로-묶어내기)
9. [useState에서 useReducer로 리팩터링](#usestate에서-usereducer로-리팩터링)
10. [상태 로직 Custom Hooks 로 뽑아내기](#상태-로직-custom-hooks-로-뽑아내기)
11. [이전 상태 활용하기](#이전-상태-활용하기)

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

### usestate 대신 useRef

컴포넌트의 전체적인 수명과 동일하게 지속된 정보를 일관적으로 제공해야하는 경우.

예를 들어 `isMount` 와 같은 값을 만들어서 관리하고 싶은 경우 `useState` 를 사용할 수도 있다. 아래와 같이 말이다.

```jsx
function RefInsteadState() : Element {
	count [isMount, setIsMount] = useState(false);

	useEffect(() : void => {
		if (!isMount){
			setIsMount(true); // isMount 상태가 변경되며 리렌더링된다.
			}
	}, [isMount]);

	return <div>{isMount && '컴포넌트 마운트 완료'}</div>'
}
```

하지만 위의 예시와 같은 경우는 `useState` 이기 때문에 상태 변경시 컴포넌트의 리렌더링을 유발한다. 따라서 `useState` 대신에 `useRef` 를 사용하는 방식을 생각해볼 수 있다. `useRef` 는 리렌더링을 불필요하게 유발하지 않기 때문이다.

```jsx
function RefInsteadState() : Element {
	count isMount = useRef(false);

	useEffect(() : () => boolean => {
		isMount.current = true;

		return () : boolean => (isMount.current = false); // 컴포넌트가 언마운트될 때 false 로 재설정함
	}, []);

	return <div>{isMount && '컴포넌트 마운트 완료'}</div>'
}
```

수정한 코드를 보자. `useEffect` 를 사용해서 컴포넌트가 마운트될 때 `isMount.current` 를 `true`로 설정하고, 컴포넌트가 언마운트될 때 false로 재설정한다. 이 경우에는 `useRef`가 리렌더링을 유발하지 않을 것이다.

`useRef` 는 DOM에만 붙일 수 있는 API는 아니다! 이렇게 컴포넌트의 전체적인 수명이랑 동일하게 생명주기를 움직이도록 해서 일관적인 값을 안전하게 제공할 수 있겠다.

### 연관된 상태 단순화하기

KISS : Keep It Simple Stupid ! 단순하고 멍청한게 복잡한 것보다 낫다.

```jsx
function FlatState() {
  const [isLoading, setIsLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isError, setIsError] = useState(false);

  const fetchData = () => {
    setIsLoading(true);

    fetch(url)
      .then(() => {
        setIsLoading(false);
        setIsFinished(true);
      })
      .catch(() => {
        setIsError(true);
      });
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error</div>;
  if (isFinished) return <div>Finished</div>;
}
```

위 코드에서 문제를 찾아본다면 `isLoading`, `isFinished`, `isError` 가 모두 연관이 되어있다는 것이다. 예를들어 데이터를 가져오는데 성공할 경우에는 `isFinished` 만 성공일 것을 기대하는 것처럼.

이 연관된 상태를 열거형 데이터로 나타내서 코드를 개선해보자. 간단하게 문자열로 묶어서 관리할 것이다.

```jsx
const PROMISE_STATES = {
  INIT: "init",
  LOADING: "loading",
  FINISHED: "finished",
  ERROR: "error",
};

function FlatState() {
  const [promiseState, setPromiseState] = useState(PROMISE_STATES.INIT);

  const fetchData = () => {
    setPromiseState(PROMISE_STATES.LOADING);

    fetch(url)
      .then(() => {
        setPromiseState(PROMISE_STATES.FINISHED);
      })
      .catch(() => {
        setPromiseState(PROMISE_STATES.ERROR);
      });
  };

  if (promiseState === PROMISE_STATES.LOADING) return <div>Loading...</div>;
  if (promiseState === PROMISE_STATES.ERROR) return <div>Error!</div>;
  if (promiseState === PROMISE_STATES.FINISHED) return <div>Finished!</div>;
}
```

훨씬 개선된 것을 볼 수 있다.

결론: 리액트의 상태를 만들 때 연관된 것들끼리 묶어서 처리하면 에러를 방지하고 코드가 간결 해진다.

### 연관된 상태 객체로 묶어내기

방금 위의 코드에서는 열거열 문자열 데이터를 사용해서 data fetch에 대한 상태를 관리했다. 이번에는 연관된 상태를 객체로 묶어내어 좀 더 코드를 개선해볼거다.

```jsx
function FlatState() {
  const [fetchState, setFetchState] = useState({
    // 객체
    isLoading: false,
    isError: false,
    isFinished: false,
  });

  const fetchData = () => {
    setFetchState((prevState) => ({
      ...prevState,
      isLoading: true,
    }));

    fetch(url)
      .then(() => {
        setFetchState((prevState) => ({
          ...prevState,
          isFinished: true,
        }));
      })
      .catch(() => {
        setFetchState((prevState) => ({
          ...prevState,
          isError: true,
        }));
      });
  };

  return (
    <div>
      {fetchState.isLoading && <p>Loading...</p>}
      {fetchState.isError && <p>Error</p>}
      {fetchState.isFinished && <p>Finished</p>}
    </div>
  );
}
```

개선한 코드에서는 상태 관리를 위해서 객체를 사용했다. 상태변화가 될 때에는 이전 상태를 유지하는 …(스프레드 연산자)를 사용해서 업데이트될 부분만 한정해서 업데이트를 해줬다. 훨씬 직관적이다.

이렇게 상태들끼리 관련이 있다면(어떤게 true로 변할 때 다른 것은 false 여야하는 등의) 객체로 묶어서 관리하는 것이 유용할 수있다. 코드의 가독성도 향상되고 좀 더 선언형 프로그래밍 스타일이다.

평소에 상태를 만들 때 항상 1대1의 관계를 만들려고 했었는데, 강의 내용을 들으니 한가지 상태가 무조건 하나의 `useState` 로 뽑힐 필요는 없는 것 같다. 여러 상태를 하나의 `useState` 로 표현할 수 있음을 기억하자!

결론: 리액트의 상태를 만들 때 **객체로 연관된 것들끼리 묶어서 처리**할 수 있다.

### useState에서 useReducer로 리팩터링

```jsx
const [isLoading, setIsLoading] = useState(false);
const [isFinished, setIsFinished] = useState(false);
⬇️
const [state, dispatch] = useReducer(reducer, INIT_STATE);
```

상태를 이번에는 useReducer 를 사용해서 관리해보자

```jsx
const INIT_STATE = {
  isLoading: false,
  isSuccess: false,
  isFail: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_LOADING":
      return {
        isLoading: true,
        isSuccess: false,
        isFail: false,
      };
    case "FETCH_SUCCESS":
      return {
        isLoading: false,
        isSuccess: true,
        isFail: false,
      };
    case "FETCH_FAIL":
      return {
        isLoading: false,
        isSuccess: false,
        isFail: true,
      };
    default:
      return state;
  }
};

function StateToReducer() {
  const [state, dispatch] = useReducer(reducer, INIT_STATE); // 인자: 조작하는 함수, 초기값

  dispatch({ type: "FETCH_LOADING" });
  fetch(url)
    .then(() => {
      dispatch({ type: "FETCH_SUCCESS" });
    })
    .catch(() => {
      dispatch({ type: "FETCH_FAIL" });
    });

  if (state.isLoading) {
    return <div>Loading...</div>;
  }
  if (state.isSuccess) {
    return <div>Success</div>;
  }
  if (state.isFail) {
    return <div>Fail</div>;
  }
}
```

`useReducer` 는 `useState` 처럼 작동하지만 복잡한 상태 로직을 외부의 함수로 분리할 수 있다. Redux 에서 쓰는 reducer 와 문법적으로 유사하며, 순수 자바스크립트로 구현한 함수이기 때문에 hook 이나 React 에 의존적인 코드가 아니어서 다른 곳에서도 재사용할 수 있는 코드라는 장점도 있다.

결론: 여러 상태가 연관 됐을 때 `useState` 대신 `useReducer`를 사용하면 상태를 구조화할 수 있다.

### 상태 로직 Custom Hooks 로 뽑아내기

컴포넌트 내부에서 사용되던 fetchData 와 state 로직을 useFetchData 라는 커스텀 훅으로 분리해보자. 화면에 렌더링되는 JSX를 제외하고 로직에 관련된 부분만 분리해보는 훈련이 지속적으로 필요하다. 이를 통해 코드의 재사용성을 높일 수 있다.

```jsx
const INIT_STATE = {
  isLoading: false,
  isSuccess: false,
  isFail: false,
};

const ACITON_TYPE = {
  FETCH_LOADING: "FETCH_LOADING",
  FETCH_SUCCESS: "FETCH_SUCCESS",
  FETCH_FAIL: "FETCH_FAIL",
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACITON_TYPE.FETCH_LOADING:
      return { ...state, isLoading: true, isSuccess: false, isFail: false };
    case ACITON_TYPE.FETCH_SUCCESS:
      return { ...state, isLoading: false, isSuccess: true, isFail: false };
    case ACITON_TYPE.FETCH_FAIL:
      return { ...state, isLoading: false, isSuccess: false, isFail: true };
    default:
      return INIT_STATE;
  }
};

const useFetchData = (url) => {
  const [state, dispatch] = useReducer(reducer, INIT_STATE);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: ACITON_TYPE.FETCH_LOADING });

      await fetch(url)
        .then(() => {
          dispatch({ type: ACITON_TYPE.FETCH_SUCCESS });
        })
        .catch(() => {
          dispatch({ type: ACITON_TYPE.FETCH_FAIL });
        });
    };
    fetchData();
  }, [url]);

  return state; // 객체로 활용될 예정
};

function CustomHooks() {
  const { isLoading, isFail, isSuccess } = useFetchData("url");

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isFail) {
    return <div>Fail...</div>;
  }
  if (isSuccess) {
    return <div>Success...</div>;
  }
}
```

use ~ 에 익숙하다보니까 무조건 return 이 튜플 형태가 되어야한다라고 생각할 수 있지만 그렇지 않다. 위 코드처럼 객체 형태로 내보내도 된다.

결론: Custom Hooks 를 사용하면 코드를 확장성 있고 재사용 가능하게 작성할 수 있다.

### 이전 상태 활용하기

```jsx
function PrevState() {
  const [age, setAge] = useState(21);

  function updateState() {
    setAge(age + 1);
  }

  function updateFunction() {
    setAge((prevAge) => prevAge + 1);
  }
}
```

react update 시에 웬만하면 `updateFunction` 처럼 prevState 를 가져와서 사용하는 것을 권장함.(`updater function`). `updateState` 같은 방식은 기존의 state 를 참조해서 업데이트하는 방식인데 이 방식에서 `setState` 자체가 비동기적 처리 과정을 거칠 수 있기 때문에 이전 상태 를 참고하는게 아니라 업데이트되기 전의 상태를 계속 바라볼 수도 있다. 그래서 이런 타이밍적인 실수를 하지 않으려면 prevState 를 가져와서 업데이트해주는 방법이 좋다.

결론: `updater function` 을 이용해 prev state를 고려하면 예상치 못한 결과를 예방할 수 있다.
