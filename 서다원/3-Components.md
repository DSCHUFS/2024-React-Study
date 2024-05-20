### 목차

1. [컴포넌트 소개](#컴포넌트-소개)
2. [Self-Closing Tags](#self-closing-tags)
3. [Fragment 지향하기](#fragment-지향하기)
4. [Fragment 지양하기](#fragment-지양하기)

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
