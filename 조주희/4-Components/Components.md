# 컴포넌트 소개

컴포넌트란? 스스로 상태를 관리하는 캡슐화된 컴포넌트 by 옛날 리액트 문서


### 기존에는 웹페이지를 만들 때 웹 개발자가 컨텐츠를 마크업한 다음 JavaScript를 뿌려 상호작용을 추가했다
이는 웹에서 상호작용이 중요했던 시절에 효과적이었음


이제는 많은 사이트와 모든 앱에서 상호작용을 기대합니다
React는 동일한 기술을 사용하면서도 상호작용을 우선시 한다

### React 컴포넌트는 마크업으로 뿌릴 수 있는 Javascript 함수이다


상태관리가 필요한가요?

예전에는 사이트에서 많은 인터랙션이 필요 없었음

but! 요즘에는 데스크탑, 태블릿 모바일 까지 다양한 플랫폼을 지원해야함 => 따라서 수많은 인터랙션이 따름

![alt text](image.png)

Thinking in React(https://react.dev/learn/thinking-in-react)라는 사이트에 가면 리액트에서 컴포넌트를 어떻게 나누고 상태를 어떻게 만드는지 설명되어 있음 읽어보는 것을 추천합니닷


***

# Self-Closing Tags

```javascript
<Img></Img>  
    👇
   <Img/>
```

MDN 문서에 void element라는 칸을 보면 하위노드들을 가지지 않는 태그들의 목록이 있음
=> 이런 태그들은 열고 닫을 필요가 없음

기본 HTML 요소인지 아닌지 명확한 차이를 가지도록 해봅시다

## 결론 : 자식 요소를 가질 수 없는 Void Element에 대해 알고, 닫는 태그가 정말 필요한지 파악하자



# Fragment 지향하기

```javascript
function Component(){
    return(
        <div>
            <ChildA/>
            <ChildB>
        </div>
    )
}
```
👇
```javascript
function Component(){
    return(
        <React.Fragment>
            <ChildA/>
            <ChildB>
        </React.Fragment>
        (대신 <></> 이것도 가능)
    )
}
```

Fragment를 사용하면 Dom에 별도의 노드를 추가히지 않고 여러 자식을 그룹화할 수 있다

Fragment 사용 이유

1. Fragment 사용 대신 div를 사용했을 때 스타일이 깨질 수 있음
2. 코드 한줄이 줄어듦

Fragment는 16버전부터 사용이 가능하므로 버전 확인을 잘 해봅시닷

key를 반인딩해야 하는 경우는 아래와 같이 사용가능하고 숏컷은 사용 불가능!
```javascript
<React.Fragment key = {id}>
```

***
# Fragment 지양하기

~~아깐 지향하라더니 이젠 지양이네?~~

나쁜 경우
```javascript
function Component(){
    return(
        <>
            <div>
                <ChildA/>
                <ChildB>
            </div>
        </>
    )
}
```
```javascript
return <>hello world</>
```
```javascript
return <h1>{isLoggedIn ? "User" : <></>} </h1>
```



좋은 경우
```javascript
function Component(){
    return(
        <>
            <ChildA/>
            <ChildB>
        </>
    )
}
```
```javascript
return "hello world"
```
```javascript
return isLoggedIn && <h1>User</h1>
```

불필요하게 사용된 Fragment가 없는지 잘 확인하자!!