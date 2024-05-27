## week 5

# 1. 컴포넌트 소개

- 캡슐화된 컴포넌트를 만들기 위해서 조합하고
- 또 복잡한 UI를 잘 캡슐화한다

컴포넌트 로직은 템플릿이 아니라 자바스크립트로 작성된다
 
 -> 다양한 형식의 데이터를 앱 안에서 손쉽게 전달 가능
 
 -> DOM과는 별개로 상태 관리 가능 


기존에는
- 컨텐츠를 마크업 -> JS 뿌려 상호작용 추가

이제는
- 컴포넌트는 마크업으로 뿌릴 수 있는 JS 함수

#### Thinking in React => 리액트 공식 문서 챕터의 튜토리얼 
리액트 개발팀의 리액트 사고방식 



# 2. Self-Closing Tags

: 명시적으로 닫는 태그가 필요 없음

기본적으로 HTML은 여는 태그가 있으면 닫는 태그가 존재해야 한다.


### Self-Closing Tags
- 닫는 태그와 여는 태그를 구분하지 않고
-  열어만 놔도 된다.


React 에서

HTML 기본 태그인지 JSX에서 만든 나만의 커스텀 컴포넌트인지 구분이 어려움

### 기본 HTML 요소인지 아닌지 명확한 구분하자 

- 기본 HTML 요소인지
- 요소 중에서도 이미 닫는 태그가 지원 안 되는 self-closing tags인지

=> 구분할 수 있어야 한다. 

### 요약 :  자식 요소를 가질 수 없는 Void Element 에 대해 알고, 닫는 태그가 정말 필요한지 파악하자 


# 3. Fragment 지향하기

JSX -> 단일 요소가 아닌 노드를 반환할 수 없다

JSX를 활용할 때 div 태그와 같은 요소들로 강제로 감싸서 내보내야 했다. 


불편한 이유는 
- 런타임에 division element가 같이 나가기 때문에 스타일이 깨질 수도 있고

- 코드 한 줄이 늘어나게 된다.

```jsx  
<React.Fragment>
```
division 태그를 쓰는것보다 React.Fragment를 애용하자

React.Fragment에 숏컷 활용가능
```jsx  
return <> clean code react </>;
```

그리고 함수 컴포넌트만이 아니라
클래스 컴포넌트에서도 리액트
Fragment를 사용할 수가 있다.

```jsx  
return <>{this.state.toISOString()} </>;
```

루프를 돌릴 때 인덱스가 필요한 경우에 바로 Fragment로 호출해서
id를 넣어줄 수가 있다.

- 리액트 Fragment를 활용
- 숏컷은 사용 불가
```jsx  
return (
    <dl>
        {items.map(({id, term, description }) : Element => (

            <React.Fragment key={id}>
                <dt>{item.term}</dt>
            </React.Fragment>
        ))}
    </dl>
);
```

### 요약 :  Fragment는 DOM에 별도의 노드를 추가하지 않고 여러 자식을 그룹화 할 수 있다. 


# 4. Fragment 지양하기 


리액트 Fragment가 불필요하게 남아있는 경우가 있다.

불필요한 컴포먼트 계층은 이렇게 줄여주자

```jsx  
return <> clean code react </>;
```

문자열 그대로 반환해도

JSX에서 렌더링 가능하다 


``` jsx
function ConditionalRenderingExample({isLoggedIn}) :Element{
    return(
        <h1>{isLoggedIn ? 'User' : <></>}</h1>
        <h1>{isLoggedIn ? 'User' :null}</h1>
        <h1>{isLoggedIn &&'User'}</h1>
    )
}
```
아무것도 렌더링 하지 않는 걸 이렇게 표현하는 경우에는 

null로 명시적으로 반환하는 것과 같다.



```jsx
return(
        {isLoggedIn && <h1>'User' </h1>}
    )
```
h1 태그가 구조적으로 렌더링 될 필요없다.


Fragment를 항상 무조건 쓰는 것보다는 좀 시기적절하게 사용해보자

### 요약 : 불필요하게 사용된 Fragment가 없는지 확인하자