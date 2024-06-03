## 1. JSX 에서의 공백처리
- white space 추가하기 위해 빈 깡통 엘리먼트를 넣는 경우
- 간단하게 보간법을 활용한 중괄호로 문자열을 넣어주면 간단히 빈 공백 삽입가능
- HTML의 특수기호 보단 자연스럽게 JSX의 용법을 사용하는것이 좋을 수 있다.
```jsx
Welcome Clean Code&nbsp;

Welcome Clean Code{' '}
```

## 2. 0은 JSX에서 유효한 값
- JS에서 0 은 Falsy value
- JSX에서 0은 유효한 값이기에 렌더링의 대상이 됨.
- 리액트에서 JSX를 렌더링할때 렌더링의 대상이 되는 값을 확인하는 것이 핵심
- 0이 넘을때 혹은 삼항연산자를 사용
- JSX에서 null은 렌더링의 대상이 아님
```jsx
  <div>{items.length && items.map(item)}</div>

  <div>{items.length > 0 && items.map(item)}</div>
  // 조건부 렌더링을 True 일때, false일때 명확히 구분하는 것이 좋음
  <div>{items.length > 0 ? items.map(item) : Elememt => <Item item={item} /> : null}</div>
```
- 결국 조건부 렌더링할때는 명확하게 T/F를 구분할 것!

## 3. 리스트 내부에서의 Key
- 리스트 렌더링시 흔히 볼수 있는 에러
`Warning: Each child in a list should have a unique "key" prop`
- 리스트의 아이템을 렌더링할때 고유의 key가 필요함 ---> 왜?
- React는 가상돔을 활용, 무수히 많은 아이템이 렌더링 되도 모른다.
  - 변경된 부분을 추가,삭제,수정시 고유의 식별자가 없다면 리액트는 이를 구분하지 못함
- 이를 위해 index를 넣어줌
  - 규모가 작다면 문제가 없지만, 댓글이나 대댓글같은 유사한 것들은 문제가 될 수 있음

```jsx
// X 단순 인덱스 삽입 지양
  <ul>
    {list.map((item, index): Elememt => (
      <li key={index}>{item}</li>
    ))}
  </ul>
// O (그나마 낫다...?)
  <ul>
    {list.map((item, index): Elememt => (
      <li key={"card-item" + index}>{item}</li>
    ))}
  </ul>
// X, 문자열 형태를 바로 인라인 형태로 넣는 경우
// 우리는 렌더링 최적화를 위해 다양한 기법을 시도
// 이런 코드는 렌더링 시마다 고유값을 생성 -> 성능 낭비
  <ul>
    {list.map((item, index): Elememt => (
      <li key={new Date().toString()}>{item}</li>
    ))}
  </ul>

```
- 고유한 값을 생성하는 시점을 렌더링시점으로 잡으면 안됨.
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

## 4. 안전하게 Raw HTML 다루기
- Raw HTML -> Raadme 마크타운 문법
  - 렌더링될 데이터
  - 유저가 다시 한번 입력 모드로 수정할 수 있는 데이터
    - input, textarea
- HTML Sanitizer API, DOM Purify
- ESLint-Plugin-risxss
```jsx
function DangerouslySetInnerExamle() {
  const post = {
    // XSS(Cross Site Scripting )
    content: `<img src="" onerror='alert("you were hacked")>`
  };
  
  const markup = {__html: SERVER_DATA};
  const sanitizedContent = {__html: DOMPurify.sanitize(SERVER_DATA)};
  setContentHTML(DOMPurify.sanitize(SERVER_DATA))


  // XSS 공격 방지 불가
  return <div>{markup}</div>;
  // XSS 를 거를 수는 있는데 더 좋은 방법이 없을까?
  return <div dangerouslySetInnerHTML={markup} />;
  // DOMpurifier
  return <textarea>{contentHTML}</textarea>
}
```

