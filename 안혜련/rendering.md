## JSX 에서의 공백처리 

``` jsx
welcome Clean code &nbsp;

welcome Clean code{' '}
```

```&nbsp;``` :  white space 

보간법```{' '} ```: 빈 공백 만들 수 있다.

HTML에서 특별하게 허락하는 특수기호를 넣기보다는

-->  JSX를 사용해 주시는 것 추천```{' '} ```


## 0(zero)는 JSX에서 유효한 값


0   : JSX에서 유효한 값

- 자바스크립트에서 falsy,  거짓 같은 값으로 생각됨

- 반복문에서는 0이 렌더링 됨

-> 그렇기 때문에 0이 들어가면 0은 렌더링의 대상으로 평가


``` jsx
  <div>{items.length > 0 ? items.map((item) : Elememt => <Item item={item} /> )}</div>;
  //0이 넘을 때로 바꾸거나

  <div>{items.length > 0 ? items.map((item) : Elememt => <Item item={item} /> ):null }</div>
  // 삼항연산자로 렌더링 표현 -> 명확하게 표현
  ```


1. 리액트에서 조건부 렌더링은 True냐 False이냐 구분지어서 렌더링 한다
    - 정확하게 값으로 귀결되도록 조건을 이용하면 불필요한 렌더링 줄일 수 있다.

2. JSX 내부에서 0은 유효하기 때문에 렌더링 해야 할 대상으로 판단된다



## 리스트 내부에서의 Key

리액트 입장에선 virtual dom, 가상 돔을 활용하기 때문에

많은 아이템들이 렌더링이 돼도 알기가 힘들다


=> 리스트 형태에서 반복적으로 비슷하게 생긴 것들이 렌더링 될 때

그걸 구분 짓기 위해서 약속한 것처럼 인덱스라는 걸 넣어준다.

``` jsx
//x   prefix 식별자를 넣는 경우- 그나마 낫지만 베스트는 아님 
  <ul>
    {list.map((item, index): Elememt => (
      <li key={"card-item" + index}>{item}</li>
    ))}
  </ul>
  ```

prefix 식별자를 넣는 경우

그나마 낫다 

하지만 이것도 이 사이에서 best는 아니다. 



``` jsx
//최악의 행동 
<ul>
    {list.map((item, index): Elememt => (
      <li key={new Date().toString()}>{item}</li>
    ))}
  </ul>
  ```

new Date() 그리고 toString()

문자열 형태를 바로  인라인 형태로 넣는것 = 정말 좋지 않다. 


React 컴포넌트는 렌더링이 자주 발생하는데

렌더링 될 때마다 고유의 값을 계속해서 찍어내게 됩니다


``` jsx
// uuid 패키지 사용
<ul>
    {list.map((item, index): Elememt => (
      <li key={uuidv4()}>{item}</li>
    ))}
  </ul>
  ```



이것도 더미 데이터를 렌더링 할 때마다 찍어내는 행위

렌더링 할 때는 최소한 아이템의 아이디를 받아와야 한다.



``` jsx
<ul>
    {list.map((item,id): Elememt => (
      <li key={id}>{item}</li>
    ))}
  </ul>
  ```


가장 베스트는  ID 값을 꺼내오는 것
ID는 서버에서 값을 받아올 때 넣을 수 있다.


```jsx 
function KeyInList({list}):Element {

  useEffect(() => {
    // 리스트 만들때 꼭 ID 부여할것
    // 새로운 아이템 추가하는 함수를 만들때 그때 고유한 값을 넣어주기

    const handleAddItem = (value) :void => {
      setItems((prev): any[] => [
        ...prev,
        {
          id: crypto.randomUUID(),
          value: value,
        },
      ])
    }

  }, [list])
  
  return (
  <ul>
    {list.map((item): Elememt => (
      <li key={item.id} onClick={(): any => handleDelete(item.id)}>
        {item}</li>
    ))}
  </ul>

  )
}
```

### 하지만 이 유니크 값을 생성을 하는 이 시점을 렌더링 하는 시점으로 잡으면 절대 안 된다



 리스트를 렌더링 하기 전에 미리 아이디를 생성을 해놓는 방법을 마련하자


### 요약 :  순회 시 key를 넣을때 단순 index를 넣거나 렌더링마다 항상 새로운 값을 넣는것을 경계하자 


## 안전하게 Raw HTML 다루기 

Raw HTML이란?
HTML 문법을 그대로 포함한 데이터
서버에서 내려오는 데이터에 HTML 태그가 포함될 수 있다.


Raw HTML을 그대로 렌더링하면 XSS(Cross-Site Scripting) 공격에 취약
XSS 공격은 악성 스크립트를 삽입해 사용자의 데이터를 탈취하거나 사이트를 손상시킬 수 있다.


``` jsx
function DangerouslySetInnerExample() {
  const post = {
    // XSS(악성 스크립트 공격 )
    content: `<img src="" onerror='alert("you were hacked")>`
  };
  
  const markup = {__html: SERVER_DATA};

  //DOMPurify에서 sanitize를 통해 소독해줄 수 있다.
  const sanitizedContent = {__html: DOMPurify.sanitize(SERVER_DATA)};
  // x
  return <div>{markup}</div>;

  // o
  return <div dangerouslySetInnerHTML={markup} />;
}
```

HTML Sanitizer API, DOMPurify, ESlint도구를 사용해서 XSS 공격의 위험을 줄일 수 있다. 