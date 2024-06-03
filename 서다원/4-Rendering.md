### 목차

1. [JSX에서의 공백 처리](#jsx에서의-공백처리)
2. [0(Zero)는 JSX에서 유효한 값](#0zero는-jsx에서-유효한-값)
3. [리스트 내부에서의 Key](#리스트-내부에서의-key)
4. [안전하게 Raw HTML 다루기](#안전하게-raw-html-다루기)

### JSX에서의 공백처리

공백 문자를 추가하고 싶을 때 HTML에서 특별하게 허락하는 특수기호인 `&nbsp;` 를 쓰는 방법 외에, 간편하게 JSX 를 이용해서 `{’ ‘}` 로 작성하는 대안도 있다.

### 0(Zero)는 JSX에서 유효한 값

0은 JSX 에서 유효한 값이다. JavaScript에서는 숫자 데이터 타입이며 false 와 같은 의미로 사용되지만 JSX는 JavaScript 표현식을 평가할 때 DOM 요소로 렌더링한다. 숫자 0은 유효한 값으로 간주되어서 {0}으로 작성하면 실제로 0이 화면에 나온다. falsy 값이긴 하지만 그 자체로 의미있는 값이기 때문이다.

그래서 화면에 출력해보면 `false`, `null`, `undefined` 와 다르게 0만 출력되는 것을 확인할 수 있다.

```jsx
const Example = () => {
  return (
    <div>
      {0} {/* 0은 실제로 렌더링 되어 화면에 표시됩니다. */}
      {false} {/* false는 렌더링되지 않습니다. */}
      {null} {/* null은 렌더링되지 않습니다. */}
      {undefined} {/* undefined는 렌더링되지 않습니다. */}
    </div>
  );
};
```

예를 들어서 `items.length` 가 0보다 클 때에만 어떤 실행이 되도록 구현했더라도, `item.length` 가 0일 때에도 실행이 되는 것을 확인할 수 있다. 따라서 이런 경우에는 `items.lenght > 0` 처럼 작성하거나 삼항연산자를 사용할 수 있을 것이다.

결론: 0 은 JSX에서 유효하기 때문에 렌더링된다.

### 리스트 내부에서의 Key

리액트에서 리스트 렌더링할 때, 각 항목에는 고유한 key 가 필요하다. → 비슷한 DOM 요소를 구분하기 위한 키

```jsx
const items = ["Apple", "Banana", "Cherry"];
return (
  <ul>
    {items.map((item, index) => (
      <li key={index}>{item}</li>
    ))}
  </ul>
);
```

위처럼 `map` 함수를 돌며 생기는 index 를 넣어줘도 문제는 없지만 프로덕션 레벨에서는 큰 문제가 생길 수 있다. 따라서 접두사로 구분자를 넣어주거나 유니크 값을 생성해주는 장치를 추가하는 것을 권장한다. 아래는 prefix 식별자를 추가해주는 예시 코드이다

```jsx
import React from "react";

const SimpleExample = () => {
  const items = ["Apple", "Banana", "Cherry"];

  return (
    <ul>
      {items.map((item, index) => (
        <li key={`item-${index}`}>{item}</li>
      ))}
    </ul>
  );
};

export default SimpleExample;
```

또한 이 유니크 값을 생성하는 시점을 렌더링하는 시점으로 잡으면 안된다 ⇒ 렌더링은 컴포넌트마다 2,3회 많으면 10회 까지도 발생할 수 있기 때문에 유니크 한 값을 너무 많이 찍어내면 안되기 때문이다.

예를 들어서 아래와 같이 아이템을 추가할 때 고유한 ID를 생성하거나, 서버에서 받아온 ID 를 사용하는 것이 좋다. 아래의 코드에서는 `handleAddItem` 함수가 렌더링 시점이 아니라 사용자 상호작용(버튼 클릭) 시에 호출되기 때문에 컴포넌트 렌더링마다 새로운 값을 찍어내지 않는다.

```jsx
import { useState } from "react";

const Example = () => {
  const [items, setItems] = useState([
    { id: "1", name: "Apple" },
    { id: "2", name: "Banana" },
    { id: "3", name: "Cherry" },
  ]);

  const handleAddItem = (name) => {
    const newItem = {
      id: crypto.randomUUID(),
      name,
    };
    setItems((prevItems) => [...prevItems, newItem]);
  };

  return (
    <div>
      <ul>
        {items.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
      <button onClick={() => handleAddItem("Date")}>Add Item</button>
    </div>
  );
};
```

결론: 순회 시 key를 넣을 때 단순 index 를 넣거나 렌더링마다 항상 새로운 값을 넣는 것을 경계하자

### 안전하게 Raw HTML 다루기

Raw HTML 이란 텍스트 형식으로 작성된, 서버에서 내려오는 HTML 코드이다. 이런 Raw HTML 을 그대로 렌더링하면 악성 스크립트 공격에 취약해진다. ⇒ 보안상 위험하다!

악성 스크립트 공격이라하면, XZZ 공격(Cross-Site Scripting) 과 같은 것을 예시로 들 수 있다.

```jsx
const content = '<script>alert("XSS")</script>';
return <div dangerouslySetInnerHTML={{ __html: content }} />;
```

만약 위처럼 코드를 작성하면 악성 스크립트(alert)이 실제로 사용자의 브라우저에서 실행되게된다.

따라서 서버에서 내려온 HTML 데이터를 한번 검증(소독)하는 것이 필요하다. 그 도구로 HTML Sanitizer API, DOMPurify, ESLint 플러그인 등이 있다. HTML Sanitizer API 는 아직 실험적이라 DOMPurify 를 사용하는 것을 권장한다고 한다. 이렇게 리액트 애플리케이션 내에서 raw HTML 을 더 안전하게 다뤄보자!!

결론: HTML Sanitizer API, DOMPurify, eslint-plugin-risxx 를 사용하면 XSS 공격의 위험을 줄일 수 있다.
