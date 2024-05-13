### 1. 불필요한 Props 복사 및 연산

- 불필요한 Props 복사
```jsx
// X
function test({value}): Elememt {
  const [copyValue] = useState(value);

  return <div>{copyValue}</div>
}
// 1. 그냥 그대로 사용
function test({value}): Elememt {
  return <div>{copyValue}</div>
}
```
  - 만약 컴포넌트 내부에 와서 반드시 쳐리되어야 할 경우
    - 자식 컴포넌트에서 값을 조작하는 경우 등등 
```jsx
function test({value}): Elememt {
  // 변수화 -> 렌더링시 계속 연산을 수행하지 않을까?
  const copyValue = useState(비싼_연산());

  return <div>{copyValue}</div>
}

function test({value}): Elememt {
  // useMemo를 활용하여 메모이제이션
  const copyValue = useMemo(() : any => 비싼_연산(value), [value]);

  return <div>{copyValue}</div>
}
```

굳이 Props 복사해서 데이터의 흐름을 끊지 말기


### 2. Curly Braces
문자열이면 중괄호 생략!
```jsx
function test(): Element{
  return (
    //jsx -> 어차피 문자열, 중괄호 생략해도 ㄱㅊㄱㅊ
    <header 
      // className={'className'}
      className='className'
      id={'clean-id'}
      style={{
        backgroundColor: 'white',
      }}
      // 표현식, 객체은 중괄호 내 위치
      value = {1 + 2}
      value = {() : void => {}}
    ></header>
  )
}
```

### 3. Props 축약하기(shortHand Props)
- EX
```jsx
function component(props) {
    <HeaderComponent hasPadding = {props.hasPadding} >
      <ChildComponent hasPadding = {props.hasPadding} isLogin = {props.isLogin} />
    </HeaderComponent>;
  }

  function component({hasPadding, ...props}) {
    <HeaderComponent hasPadding = {hasPadding} >
      <ChildComponent {...props} />
    </HeaderComponent>;
  }
```
- 전개 연산자 활용
```jsx
function ShorthandProps(props) : Element{
  return (
    <header 
      className = "clean-code"
      title='Clean Code React'
      isDarkmode = {true}
      isLogin = {true}
      hasPadding = {true}
      isFixdMode = {true}
    >
      {/* 일일히 넣지 않고 전개 연산자 활용 */}
      <ChildComponent {...props} />
    </header>
  )
}
```
- shorthandProps 사용
```jsx
function ShorthandProps({isDarkmode, isLogin , hasPadding, isFixdMode}) : Element{
  return (
    <header 
      className = "clean-code"
      title='Clean Code React'
      // 이렇게 가져올 수도
      isDarkmode = {isDarkmode}
      // 만약 true 값이 보장된다면 이렇게 가져오는게 깔끔
      isLogin
      hasPadding
      isFixdMode
    >
      {/* 일일히 넣지 않고 전개 연산자 활용 */}
      <ChildComponent {...props} />
    </header>
  )
}

```

### 4. Single Quote vs Double Quote
의미없는 논쟁이긴 하지만 
1. 일관성 유지측면
2. HTML, JS에서 차이를 두는지?  

- EX
```jsx
  function Hello() {
    const obj ={
      hello: 'world'
    }
    // O
    <a href="https://github.com/">clean Code JS</a>
    // X -> 혼용, 일관성 유지 실패
    <input class = 'cccc' type="button" value='clean code React' />
    // X -> 위 JS 객체에선 single, 여기선 double? -> 일관성 X
    <Clean style = {{backgroundColor: "blue"}} />
  }
```
Prettier / ESLint 옵션으로 일관성 있게 유지할 수 있음  
결국 팀 규칙에 따르는것이 맞음.



### 5. 알아두면 좋은 Props Naming
Props
1. 하위 컴포넌트로 데이터를 넘긴다
2. 함수에 매개변수로 넘기고, 인자들을 주고 받으면서 Props로 통신
```jsx
// X
  <ChildComponent 
    class='mt-0'
    Clean = "code" // PascalCase는 컴포넌트 받을 때 사용
    clean_code = "react" // snake_case vs camelCase
    otherComponent = {otherComponent}
    isShow = {true}
  />
//  O
  <ChildrenComponent 
    className= "mt-0"
    clean = "code"
    cleanCode= "react"
    otherComponent = {otherComponent}
    isShow // 무조건 true -> shorthandProps 사용
  />
```

### 6. 인라인 스타일 주의하기
JSX -> JS로 HTML을 표현하는 방법(중괄호 안 표현식&객체를 삽입)  
JSX에서 인라인 스타일 활용시, 중괄호 안에 CamelCase Key를 가진 객체를 사용해야 함.
```jsx
// X
function InlineStyle () : Elememt {
  return (
    <button style="background-color: 'red'; font-size:'14px';">
      cc
    </button>
  )
}
// O
// 변화하지 않는값이면 컴포넌트 밖으로 빼서 계속 평가되는 것을 방지
const myStyle = {backgroundColor: 'red', fontSize: '14px'};
function InlineStyle () : Elememt {
  // const myStyle = {backgroundColor: 'red', fontSize: '14px'};
  return (
    <button style={myStyle}>cc</button>;
  )
}
```

```jsx
const MyButtonStyle = {
  warning: {backgroundColor: 'yellow', fontSize: '14px'},
  danger: {backgroundColor: 'red', fontSize: '24px'}
}
function InlineStyle () : Elememt {
  return (
    <button style={MyButtonStyle.warning}>Warning cc</button>;
    <button style={MyButtonStyle.danger}>Danger cc</button>;
  )
}
```

