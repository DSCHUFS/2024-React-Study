# import react

```javascript
import React form react
```

리액트 17버전부터는 import React를 쓰지 않아도 됨

이유는??

```javascript
import React from 'react'

function App(){
    return <h1>Hello world</hi>;
}// 이거를

function App(){
    return React.createElement('h1', null, 'Hello world');
}// 컴파일 과정에서 이렇게 만들어주는 과정이 필요했음
```

불필요한 모듈을 가져오지 않기 때문에 조금이라도 번들된 사이즈를 줄일 수 있음!

&nbsp;

&nbsp;

***
# 디렉터리 구조

기본 컴포넌트 구조

```javascript
// bad!
comopnents/
    - MyButton.vue
    - VueTable.vue
    - Icon.vue

// good!
comopnents/
    - BaseButton.vue
    - BaseTable.vue
    - BaseIcon.vue

comopnents/
    - AppButton.vue
    - AppTable.vue
    - AppIcon.vue

comopnents/
    - VButton.vue
    - VTable.vue
    - VIcon.vue
```

&nbsp;

결합도가 높을 때
```javascript
// bad!!
comopnents/
    - TodoList.vue
    - TodoItem.vue
    - TodoButton.vue

comopnents/
    - SearchSidevar.vue
    - NavigationForSearchSidebar.vue

// good!
comopnents/
    - TodoList.vue
    - TodoListItem.vue
    - TodoListItemButton.vue

comopnents/
    - SearchSidevar.vue
    - SearchSidevarNavigation.vue
```

어떻게 분리해야하는지 어떻게 모아야 하는지 잘 생각해보자!

&nbsp;

&nbsp;

***
# SPA에서의 새로고침

```javascript
const handleLogin = async() => {
    try {
        if (isSuccess === true) {
            setIsLoggedIn(true);
            window.location.reload() // 이거 사용해도 되는걸가?
        }
    } catch (errer) {
        alert('로그인에 실패했습니다.')
    }
}
```
해당 API를 사용하면 내가 만들고 있는 SPA를 완전히 재가동 시킴

=> 앱을 새로 다시 시행하는 행위는 매우 위험!!


- 만든 state와 router들이 싹 날라갈 수 있음

**SPA에서 window.location.reload를 사용하면 성능 저하 , 상태 손실, 불필요한 서버 요청 등의 문제가 발생할 수 있다**


&nbsp;

&nbsp;


***
# Primitive UI

나중을 위한 디자인 확작성을 위해 컴포넌트를 primitive하게 잘 만들어야 한다
```javascript
// X
<TodoList/>
<TodoItem/>

//O
<List/>
<Item/>
```

도메인 네임보다는
> Sematic한 Primitive UI를 표현하자

> 생김새를 묘사한다(Box, Circle, List 등등 )


**Sematic HTML , Primitive UI를 준수하자**