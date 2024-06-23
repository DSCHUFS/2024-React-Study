## 1. Import react

- 리액트 17 버전 이상: import React가 필요하지 않음.

- -> JSX 컴파일 방식의 변화로 react.createElement 호출이 자동으로 처리됨.



1. 이전 방식: JSX가 react.createElement를 호출하기 위해 import React 필요.

2. 현재 방식: JSX-runtime이 자동으로 처리, 수동 import 불필요.

17버전에서 
``` jsx
// 제거가능
// import React from 'react';

const Welcome = () => {
    return <h1> Hello </h1>;
}
```

``` jsx
import { Component } from 'react'; // 필요 모듈만 가져오기

class Welcome extends React.Component{
    render(){
        return <h1> Hello</h1>;
    }
}
```

- 불필요한 import 구문 제거 -> 코드 간결화
- 약간의 번들 사이즈 감소 효과.

리액트 17 버전 이상에서만 적용 가능!

참조 코드 확인하기 - 프로젝트 내 리액트 참조 여부 확인 후 제거.

### 요약 :  React 17버전부터 react를 반드시 import 하지 않아도 된다.

## 2. 디렉터리 구조


디렉터리 구조의 기본 원칙

정답은 없음!
-> 구조는 의존성을 보여준다. 


React 디렉터리 구조는 정해진 정답이 없고, 의존성을 잘 보여주는 구조가 중요하다.


#### 결합도와 응집도
결합도가 높은 컴포넌트는 하나의 폴더에 묶어 관리

```
components/
  TodoList.vue
  TodoListItem.vue
  TodoListItemButton.vue
  //한 폴더에!!

```
폴더 깊이 관리:

- depth가 늘어난다고해서 무조건 안정적이지 않다!

- 불필요한 폴더 깊이를 만들지 말고, 가능하면 one-depth 구조로 관리.

--- 

- 베이스 컴포넌트를 잘 확장하자 
- 처음부터 모든 것을 분리할 필요는 없으며, 필요에 따라 점진적으로 분리하자!
- 무조건 공통 컴포넌트로 빼지 말고, 필요할 때만 분리하자 


=> 시작은 간단하게, 필요에 따라 점진적으로 확장.
=>  결합도와 응집도를 고려하여 구조화.



## 3. SPA에서의 새로고침

Single Page Application(SPA)에서 새로고침
``` jsx
const handleLogin =async () =>{
  try{
    if(isSuccess === true){
      setIsLoggedIn(true);
      window.location.reload() 
    }
  }catch(error){
    alert('로그인에 실패했습니다.');
  };
}
```
window.location.reload 메서드를 사용하여 로그인을 처리하려고 하는데,

#### 문제점
window.location.reload를 사용하면 SPA가 완전히 재기동된다. 
- SPA입장에서는 앱을 완전히 종료하고 다시 실행하는 행위

- 상태(state) 초기화: SPA에서는 대부분의 상태 관리가 클라이언트 측에서 이루어지기 때문에 새로고침 시 상태가 초기화된다.

- 전체 페이지를 다시 로드하면서 불필요한 네트워크 요청이 발생하게 된다.

### SPA와 Multi Page Application의 차이점

- SPA: 네트워크 탭에서 document 형식의 요청이 한 번만 일어나고 **이후 자바스크립트를 통해 페이지가 렌더링**됩니다.

- MPA: 각 페이지 전환마다 새로운 HTML 문서를 서버로부터 받아오게 됩니다.


### SPA에서 새로고침으로 인한 상태 초기화를 방지하기 위해 

-  로컬 스토리지를 활용하여 상태를 저장하고, 

새로고침 시 이를 다시 불러와서 상태 유지한다.


### => single page application 에서 window.location.reload를 사용하면 성능저하, 상태손실, 불필요한 서버요청의 문제가 발생할 수 있다. 


## 4. Primitive UI

프론트엔드 프레임워크 사용 시 시맨틱 원칙이 소홀히 다뤄짐

Primitive UI 컴포넌트 

:  UI와 UX를 표현하는 기본적이고 범용적인 컴포넌트.

TodoList 컴포넌트에서
``` <TodoInput/>, <TodoList/> ``` 

-> 도메인 명을 컴포넌트 이름에 사용한다.

- 초기 개발 단계에서 편리할 수 있으나, 
- 장기적인 확장성과 재사용성 측면에서는 한계

###  도메인 네이밍보다는 시맨틱하고 범용적인 네이밍이 좋다. 
``` <TodoList /> ``` 보다는 

``` <List/> ```가 확장성과 재사용성 측면에서 유리하다.

### 시맨틱 태그(input, header, section, footer) 사용을 통한 구조적 접근



Radix UI와 같은 라이브러리를 활용하여, 
### 기본적이고 범용적인 UI 컴포넌트를 사용-> 더 깊은 시맨틱 구조를 적용 가능 

### React와 TypeScript의 조합 
 ButtonHTMLAttributes를 활용하여 HTML 표준 요소를 확장한다. 
 
 -> 시맨틱한 리액트 컴포넌트 표현가능

  ``` tsx
  interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>{
    ...
  }

  const Button =(props : ButtonProps) = > {
    return <button>
      {children}
      </button>
  }
  ```

웹 표준을 준수하고, 접근성을 향상시키는 방향으로 개발해야 한다! 
### => semantic HTML, Primitive UI를 준수하자 