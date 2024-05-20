# 1. 컴포넌트 소개

### 컴포넌트란?
* 스스로 상태를 관리하는 캡슐화된 컴포넌트
* 컴포넌트 로직은 템플릿이 아닌 JavaScript로 작성됨.

### 기존의 컴포넌트
* 웹 개발자가 컨텐츠를 마크업한 다음 JavaScript를 뿌려 상호작용 추가
### 현재
* 많은 사이트, 모든 앱에서 상호작용 기대
* 똑같은 앱이어도 데스크탑, 태블릿, 모바일까지 다양한 플랫폼 지원 필요
* 그렇기 때문에 수많은 인터랙션이 있음. (별표 표시 체크, 디바이스에 따른 터치 이벤트 등)
* React 컴포넌트는 마크업으로 뿌릴 수 있는 JavaScript 함수

### Thinking in React
* 리액트에서 컴포넌트를 어떻게 나누고 상태를 만드는지에 대한 튜토리얼

# 2. Self-Closing Tags

### 명시적으로 닫는 태그가 필요없는 태그들
* 형식: <Img></Img>  =>  <Img />
* <area>, <base>, <br>, <col> 등등..

### Vue와의 차이
* 기본 HTML element를 사용할 수 없게 되어있음.
* <header></header> => <app-header></app-header> or <v-header></v-header>
* 그러나 React에서는 camel case를 사용하여 컴포넌트를 표기하므로, 기본 HTML 태그와 커스텀 컴포넌트를 구분하기 어려움. (실수 주의!)

** 자식 요소를 가질 수 없는 Void Element에 대해 알고, 닫는 태그가 정말 필요한지 파악하자.



# 3. Fragment 지향하기

### Fragment의 필요성
* JSX에서는 단일요소만 반환할 수 있기 때문에 <div> 태그를 활용하여 강제로 감싸서 내보내야함.
* 스타일이 깨질 수도 있고, 코드 한 줄이 늘어나는 불편함 초래


### Fragment의 장점
* <React.Fragment>를 사용하여 리액트를 빌드하고 배포했을 때 실제로 런타임으로 돌아가 있는 문서에서는 내부 요소만 작성되어 있음.
* 숏컷 활용 가능(<>...</>)
* 루프를 돌릴 때 인덱스가 필요한 경우 <React.Fragment key={id}>...</React.Fragment> 사용
* 함수 컴포넌트뿐만 아니라 클래스 컴포넌트에서도 사용 가능

### Fragment의 단점
* React 16 이하 버전에서는 Fragment를 사용할 수 없음
* 숏컷 또한 babel 7버전 이상부터 가능

** Fragments는 DOM에 별도의 노드를 추가하지 않고 여러 자식을 그룹화할 수 있다.


# 4. Fragment 지양하기

### 잘못된 Fragment 사용사례
1. 컴포넌트 구조가 변경되어 더이상 Fragment가 필요하지 않은 경우 
* 나도 모르게 컴포넌트 계층이 바뀌면서 불필요하게 Fragment가 남아있는 경우가 있음.
```
return (
    <>  // 필요없는 Fragment
        <div className="main-container">
            <h1>Outer Component</h1>
            <div>
            ...
            </div>
        </div>
    </>
);
```

2. 문자열 반환
* 과거에는 JSX에서 문자열을 반환할 수 없었지만, 현재는 문자열을 직접 반환할 수 있음.
```
return <>Clean Code React</>; //X
return 'Clean Code React';  //O
return ['Clean', 'Code', 'React'];  //배열도 반환 가능
```

3. null 반환
* 아무것도 렌더링하지 않는 경우 
```
return (
    <div>
        <h1>{isLoggedIn ? 'User' : <></>}</h1>
        <h1>{isLoggedIn ? 'User' : null}</h1>
        <h1>{isLoggedIn && 'User'}</h1>
        {isLoggedIn && <h1>User</h1>}
    </div>
);
```

** 불필요하게 사용된 Fragments가 없는지 확인하자