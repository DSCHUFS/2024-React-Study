## State
### 상태?
`상태`관리  
컴포넌트, 전역, 서버... 등등  
이런 상태를 변경하고 최적화가 따라옴  

> 그렇다면 우린 `왜` 상태관리를 할까? 로 돌아가보자


- 요구사항부터 생각하기

~상태는 왜 필요한지, 최적화는 언제하는지를 생각해보자.


### 올바른 초기값 설정

- Ex. Array에 데이터가 있는지 확인하는 과정(Nullable 방어코드)
```jsx
count [count, setCount] = useState('0');
count [list, setList] = useState();

{Array.isArray(list) && list.map((item)=> (<Item item = {item} />))}
```

우리가 초기 list 값을 잘 넣어놨다면 불필요한 과정

- Ex. Event 활용
이벤트는 String 으로 받아오고 이를 number로 사용하는 경우

> 초기값 :가장 먼저 렌더링될때 순간적으로 먼저 보여질 수 있는 값. 

초기값을 생각없이 넣게되면
1. 렌더링 이슈
2. 무한루프
3. 타입 불일치
4. 런타임 에러
5. Undefined(안넣는 경우)
6. CRUD 시 원상태 복귀 불가

발생 가능

- Ex. 타입불일치
```jsx
count [count, setCount] = useState('0');

const resetState = () => {
  setCount(INIT_COUNT_STATE); 
}
```
count의 초기값을 string 으로 설정해놓고, 함수에서 number로 활용하는 경우

> 초기값은 앱 시작~종료 전 과정에서 중요하며, 불필요한 방어코드를 줄여줄 수 있는 출발점.


### 업데이트 되지 않는 값
- 변수를 리액트 컴포넌트 내부에 직접적으로 갖는 경우
```jsx
export const Component = () => {
  // 상수 혹은 일반적 방치
  // 어디서도 업데이트 되지 않을 경우
  const INFO = {
    a: 'a',
    b: 'b',
  };

  return <MyComp info={INFO} />
};
```
이 변수를 언제 참조하고 기억할지를 정하지 않음

- 해결법
1. 리액트 상태로 변경
```jsx
const [info, setInfo] = useState([a: 'a', b: 'b',])
```
2. 아예 리액트 컴포넌트 외부로 추출


### 플래그 상태
- 플래그 값 : 제어를 위한 조건을 boolean으로 나타내는 값

- Case 1: useEffect를 한데 모으기
```jsx
const [isLogin, setIsLogin] = useState(false);

useEffect(():void => {
  if(
    hasToken &&
    hasCookie &&
    //.. 생략
  ) {
    setIsLogin(true);
  }
})
```

- Case 2: 조건문 개선
```jsx
const [isLogin, setIsLogin] = useState(false);

useEffect(():void => {
  const isLogin = 
    hasToken &&
    hasCookie &&
    //.. 생략

  if(isLogin) {
    setIsLogin(true);
  }
})
```

- Case3: 불필요한 상태 제거
```jsx
const isLogin = 
    hasToken &&
    hasCookie &&
    //.. 생략

  // 굳이 상태 없이도 로직 완성
  return <div>{isLogin && "HI"}</div>;
```
즉 상태를 위한 useState, 분기문, 조건 입력 필요 없이 플래그로 정의 가능.


### 불필요한 상태 제거
- 불필요한 상태 만들기

결국 리액트에 의해 관리되는 값이 증가  
렌더링에 영향 주는 값도 증가 = 관리 포인트의 증가

- EX (useState 활용)
```jsx
// 초기 상태 선언
const [userList, setUserList] = useStaet(MOCK_DATA);
// 변경할 상태 선언
const [compuserList, compsetUserList] = useStaet(MOCK_DATA);

useEffect(():void => {
  const newList = compuserList.fliter((user):boolean => user.completed === true);
  setUserList(newList);
}, [userList]);
```

- 내부의 변수를 만들어서 해결(const 활용)

렌더링될때마다 고유의 값이 만들어진다면, 내부 변수에 담아서 사용
```jsx
const compuserList = compuserList.fliter((user):boolean => user.completed === true)
```

> 컴포넌트 내부 변수 = Computed Value(렌더링마다 고유의 값을 가지는 계산된 값)


### useState 대신 useRef
리렌더링 방지가 필요할 경우

컴포넌트의 전체적 수명과 동일하게 지속적 정보를 일관적으로 제공하는 경우


- useState 활용  
useState를 통해 만든 값들은 setState가 동작하며 원치않는 리렌더링이 발생가능
```jsx
export const component() => {
  const [isMount, setIsMount] = useState(false);

  useEffect(() => {
    if(isMount){
      setIsMount(true)l
    }
  }, [isMount])
}
```

- useRef로 개선 (가변 컨테이너)
컴포넌트의 생명주기가 동일한 리렌더링 되지 않는 상태를 만들 수 있음
```jsx
export const component() => {
  const isMount = useRef(false);

  useEffect(() => {
    isMount.current = true;
    return () => (isMount.current = false);
  }, []);
};
```


### 연관된 상태 단순화

- KISS : Keep It Simple Stupid = 한번에 이해할 수 있게!

- 기존
loading, finish 상태가 다 연관된 상황
```jsx
const [isLoading, setIsLoading] = useState(false);

const [isFinish, setIsFinish] = useState(false);
```

- 열거형 데이터로 변경
loding, finish, init을 한데 묶어서 열거형으로
```jsx
cosnt PROMISE_STATE = {
  INIT: "init",
  LOADING: "loading",
  FINISH: "finish"
};
const [promiseState, setPromiseState] = useState(PROMISE_STATE.INIT);

// 분기처리
if(PROMISE_STATE = PROMISE_STATE.INIT) return <InitComponent />
if(PROMISE_STATE = PROMISE_STATE.LOADING) return <LoadingComponent />
if(PROMISE_STATE = PROMISE_STATE.FINISH) return <FinishComponent />

```

연관된 상태는 묶어서 처리할 수 있는 방법이 있다. 객체가 아니라 간단히 문자열로 묶을 숟 도 있다.

### 연관된 상태 객체로 묶기

- 기존
```jsx
// 두가지 상태가 연관된 상황
const [isLoading, setIsLoading] = useState(false);
const [isFinish, setIsFinish] = useState(false);
```

- 연관상태를 객체로 묶어서 내보내기

하나의 State 로 변경 가능
```jsx
const [fetchState, setFatchState] = useState({
  isLoading: false,
  isFinish: false
});

setFatchState({
  isLoading: false,
  isFinish: true
})

```

- 코드 반복까지 개선
이전 상태를 Props로 가져오기
```jsx
setFatchState((prevState) =>{
    ...prevState, // 이전상태는 그대로
    isFinish: true
})
```

한가지 상태를 조작하여 나머지 연관된 상태를 관리하는 개념  
꼭 1:1 일 필요가 없고 N:1로 표현도 가능하다

하나의 상태가 다른 상태에 영향을 준다면 관련된 상태를 묶는 것도 좋은 방법


### useState 대신 useReducer 로 리팩토링
- 기존
```jsx
const [isLoading, setIsLoading] = useState(false);
const [isFinish, setIsFinish] = useState(false);
```
- useReducer 활용


상태를 구조화 하는 관점(Redux 와 유사)
```jsx
const INIT_STATE = {
  isLoading: false,
  isFinish: false
}
// if문도 활용 가능
const reducer = (state, action) => {
  switch (action.type) {
    case 'IS_LOADING':
      return {...state, isLoading : true}
    case 'IS_FINISH':
      return {...state, isFinish : true}
    default: // 기본값 반드시 넣기
      return INIT_STATE
  }
}
// useReducer 도 get,set 가능
const [state, dispatch] = useReducer(reducer, INIT_STATE);


// 활용
dispatch({type: 'IS_LOADING'});
```

순수한 JS 코드이기 때문에 hook, libray에 종속되지 않음.

추상적, 선언적 문법으로 바꾸고, 구조적으로 관리할 수도 있음.

### 상태 로직 Custom Hooks 로 뽑기
화면에 렌더링 되는 부분을 제외하고, 로직만 빼보는 것이 중요하다.
- 기존 상태 로직
```jsx
const [state, useState] = useState();

useEffect(() => {
  const fetchData = () => {
    setState(data);
  };
  fetchData();
},[]);

if(state.isLoading) return <LoadingComponent />;
if(state.isFail) return <FailComponent />;
```

- Custom Hooks 로 뽑기(use Prefix 지키기)
```jsx
const [isLoading, ifFail] = useFetchData(data);

if(isLoading) return <LoadingComponent />;
if(ifFail) return <FailComponent />;
```

### 이전상태 활용하기
updater Function 을 사용하여 Previous State를 고려하기
```jsx
function test() {
  const [age, setAge] = useState(0)
  function updateState(){
    // 위 state를 참조하여 업데이트 -> 비동기적 처리과정에서 갱신 전 상태를 계속 볼 수도 있음

    setAge(age + 1);
    setAge(age + 1);
    setAge(age + 1);
  }

  function updaterFuction(){
    // 이렇게 이전상태를 가져와서 업데이트 진행해야함.
    setAge((prevAge) => a + 1);
    setAge((prevAge) => a + 1);
    setAge((prevAge) => a + 1);
  }
}
```

- 두번의 interaction, 같은 상태를 바라볼 경우
sideeffect 발생 가능

```jsx
const handleCardNumber = (cardNumber) => {
    setCardState({
      ...cardState,
      cardNumber
    })
  }

    const handleCardCompany = (cardCompany) => {
      setCardState({
        ...cardState,
        ...cardCompany
      })
  }
```

```jsx
const handleCardNumber = (cardNumber) => {
    setCardState((prevState) =>{
      ...prevState,
      cardNumber
    });
  }

    const handleCardCompany = (cardCompany) => {
      setCardState((prevState) => {  
        ...prevState,
        ...cardCompany
      });
```

