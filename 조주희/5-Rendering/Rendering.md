# JSX에서의 공백처리

공백처리는 `&nbsp` 대신 `{' '}`을 이용하자

```javascript
export default function App(){
    return 
    <div>
        hello &nbsp hahaha
    </div>
}

👇

export default function App(){
    return 
    <div>
        hello {' '} hahaha
    </div>
}
```

&nbsp;

&nbsp;
***
# 0(Zero)는 JSX에서 유효한 값
```javascript
return <div>{items.length && items.map(item=>어쩌고저쩌고)}</div>

👇

return <div>{items.length > 0 && items.map(item=>어쩌고저쩌고)}</div>
return {items.length > 0 ? items.map(item=><div>어쩌고저쩌고</div>) :null}
```

위 같은 경우 items.length = 0일 경우  그냥 0이 렌더링 될 것임

따라서 items의 길이를 0보다 클때 렌더링하는 거로 바꾸거나 삼항연산자를 쓰도록 해야함

**결론: 0은 JSX내에서 유효하기 때문에 렌더링된다. 주의하도록!**



&nbsp;

&nbsp;
***
# 리스트 내부에서의 key

```javascript
list.map((item,index)=>
    <li key = {index}>{item}</li>
)
```

index를 그대로 써도 될까?

=> 수많은 DOM 요소가 렌더링되면 리액트 입장에서 이것을 구분하기가 어려움 따라서 위와 같은 형식으로 key값을 넣는 것을 권장하지 않음

그나마 좋은거
- '구분되는 문자열' + index 로 구분하기

별로 옳지 않은 방법
- new Date().toString : 이렇게 하면 매번 고유의 값을 계속 찍어내야 해서 비효율임
- uuidv4() : 이것도 더미데이트 마구마구 찍어내는 행위임

&nbsp;

가장 좋은 방법은 서버에서 리스트 받아올때 해당 id의 값을 이용하는 것!

id값이 없다면 useEffect해서 받아올 때 임의의 값 생성해서 넣어줌



```javascript

const handleAddItem = (value) => {
    setList(prev=>[
        ...prev,
        {
            id:crypto.randomUUID(),
            value:vaule
        }
    ])
}
useEffect(()=>{
    axios.get(어저꼬.then(res=>{
        setList(res.data.map(item=>handleAddItem(item)))
    }))
    
})

list.map((item)=>
    <li key = {item.id}>{item.string}</li>
)
```

**결론: 순회 시 key를 넣을 때, 단순 인덱스를 넣거나 렌더링마다 항상 새로운 값을 넣는 것을 경계하자**

&nbsp;

&nbsp;

# 안전하게 Raw HTML 다루기

raw HTML 이란? 쉽게 생각해서 html 기본 태그들 같은거 생각하면 된다

```javascript
const SERVER_DATA = '<p>some raw html</p>'

function DangerousySetInnerHTMLexample() {
    const post = {
        // XSS(악성 스크립트 공격)
        content : '<img src="" onerror='alert("you were hacked")'/>'
    }

    const markup = {__html: SERVER_DATA}

    return <div>{markup}</div> // 최악의 예시
    return <div dangerousySetInnerHTMLexample = {markup}/> // 그나마 나은 예시
}

```

어떻게 해야 더 좋은 예시일까요?

```javascript
function DangerousySetInnerHTMLexample() {
    const post = {
        content : '<img src="" onerror='alert("you were hacked")'/>'
    }

    const santizeContent = {__html: DOMPurify.sanitize(SERVER_DATA)}
    // 이렇게 하면 더 안전하게 컨텐츠를 소독해줌

    setContentHTML(DOMPurify.sanitize(SERVER_DATA))

    return <div>{contentHTML}</div> 
    return <div dangerousySetInnerHTMLexample = {contentHTML}/> 
}
```

**결론 : HTML Santinizer API, DOMPurify, eslint-plugin-risxx를 사용하면 XSS 공격의 위험을 줄일 수 있다**