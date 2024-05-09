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

### 7. CSS in JS 인라인 스타일 지양 하기

Styled-components, Emotion 등등
- Emotion.Js 활용 예시
백틱 안에는 tagged Function 이 들어가 있어서,   
함수안에 들어가서 직렬화 되고 있음  
즉 스타일 변경 계산 함수가 내부적으로 들어가있다고 볼 수 있음

```jsx
  return (
    <div
      css = {css`
        background-color: white;
        border: 1px solid #eee;
        border-radius: 0.5rem
      `}
    >
      <h5
        css = {css`
          font-size:1.25rem;
        `}
      >
        {title}
      </h5>
    </div>
  )
```

- 장점
  - 스타일을 외부로 분리했기 때문에 스타일 렌더링 시미다 직렬화 되지 않음(한번만 된다)
  - 동적 스타일을 실수로 건드는 확률이 적어짐
  - 스타일 관련 코드를 분리하여 로직에 집중하고 JSX 볼때 간결하게 볼 수 있음
  - 타입 안정성, 자동완성을 통한 생선성 증대(DX), Export 시 외부 컴포넌트 사용 가능

```jsx
 // X
const cardCss = {
  self: css`  
        background-color: white;
        border: 1px solid #eee;
        border-radius: 0.5rem
      `,
  title: css`
         font-size: 1.25reb
  `
  }

// O
const cardCss = {
    self: css({
          backgroundColor: 'white',
          border: '1px solid #eee',
          borderRadius: '0.5rem',
    }),
    title: css({
            fontSize: '1.25rem',
    })
  }


function test({title, children}) {
  return(
    <div css={cardCss.self}>
      <h5 css={cardCss.title}>
        {title}
      </h5>
    </div>
  )
```

특히 CSS-in-JS 는 성능에 민감하기 때문에 로직에 주의해야 함.

### 8.객체 Props 지양하기
- 리액트는 JS로 개발, JS 문법인 경우가 대부분
- JS 객체안에는 배열도, 함수도 들어감
- 불필요한 리렌더링 유발
```jsx
function test() {
  return (
    <ChildComponent 
      propObj = {{hello: 'world'}}
      propArr = {{"hello": "world"}} 
    />
  );
}
```
- SOLUTION
1. 변하지 않는 값이라면 컴포넌트 외부로 빼기
2. 필요한 값만 객체 분해하여 Props로 내려주기
```jsx
const [propArr, setPropArr] = useState(["hello", "hello"]);
  return (
    <ChildComponent 
      hello = 'world'
      hello2 = {propArr.at(0)}
    />
  );
```
3. useMemo 활용(단, 자주 계산되는 값, 정말 값비싼 연산시)
```jsx
function test() {
  const [propArr, setPropArr] = useState(["hello", "hello"]);
  const computedState = useMemo(() => ({
    computedState :heavyState
  }), [heavyState])
  return (
    <ChildComponent 
      hello = 'world'
      hello2 = {propArr.at(0)}
      computedState = {{computedState : heabyState}}
    />
  );
}
```
4. 컴포넌트를 더 평탄하게 나누면, 나눌 Props를 더 평탄하게 내릴 수 있다.


### 9.HTML Attribute 주의하기
- HTML에서의 속성 => Attribute
- JS에서의 속성 => Property
- HTML, JS에서 정의한 예약어와 커스텀 컴포넌트 Props가 혼용되지 않도록 하자
```jsx
// X
function MyBtn({children, type}){
  return <button type={type}>{children}</button>;
}
// O
function MyBtn({children, ...rest}){
  return <button {...rest}>{children}</button>;
}
```
- 리액트를 사용하다보면 웹 표준을 어기게 되고, 이를 어쩔 수 없이 따를때가 있음  
- HTML의 표준을 지키는 노력이 필요하다.
- TS 등을 활용해서 기본 HTML을 확장해서 사용하는 것이 좋을 수도 있다.


### 10. spread 연산자 사용시 주의할 점
- 전개 연산자는 객체를 구조분해하는 JS 표준 문법
- 전개 연산자를 통해 하위 컴포넌트로 Props를 넘기는 일이 많음

- 주의 할 점
1. 코드를 예측하기 어려움
```jsx
// X , Props가 어떤 것인지 알려면 타고타고 올라가야 함
const ParentComponent = (props) => {
  // 여기 내려오는 Props가 어떤 것인지 모른채로 넘어옴
  return <ChildOrHOComponent {...props} />
}

// O,
const ParentComponent = (props) => {
  const { 관련없는_props, 관련있는_props, ...나머지_props} = props;
   return <ChildOrHOComponent 
   관련_있는_props = {관련_있는_props}
   { ...나머지_props} />
}
```

### 11. 많은 Props 일단 분리하기
- 결과와 패턴에 대한 집착을 버리자, 결과보단 실행 => 분리 해보자
1. TanStack Query , Form Library
2. 상태관리
3. Context API
4. Composition
보단 분리를 하고 나중에 묶어놓는것.

- 분리 단계
1. One Depth 분리
2. 확장성을 위한 분리를 위해 도메인 로직을 다른 곳으로 모아 넣기
```jsx
// X
return <JoinForm
    user = {user}
    auth = {auth}
    location = {location}
    favorites = {favorites}
    handleSubmit = {handleSubmit}
    handleReset = {handleReset}
    handleCancel = {handleCancel}
  />
 // O
  return (
    <JoinForm 
      onSubmit = {handleSubmit}
      onReset = {handleReset}
      onCancel = {handleCancel}
    >
      <CheckBoxForm formData = {user} />
      <CheckBoxForm formData = {auth} />
      <RadioButtonForm formData = {location} />
      <SectionForm formData = {favorite} />
    </JoinForm>
  )
```


### 12. 객체보다는 단순한 Props의 장점

```jsx
// X, 객체를 통으로 넘기는 경우
// 진짜 필요한 정보만 가져오는 걸까라는 의심
// 상위 컴포넌트 따라 불필요한 생명주기를 갖는 것은 아닐까 라는 의심
const UserInfo = ({ user }) => {
  return (
    <div>
      <img src={user.avatarImgUrl} />
      <h3>{user.userName}</h3>
      <h4>{user.email}</h4>
    </div>
  )
}
// O
const UserInfo = ({ avatarImgUrl, userName, email }) => {
  return (
        <div>
          <img src={avatarImgUrl} />
          <h3>{userName}</h3>
          <h4>{email}</h4>
        </div>
      )
}
```
즉 Props에 객체 전체를 내리지 말고, 꼭 필요한 값만 내려주기