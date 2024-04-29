### week2
1. [useState대신 useRef](#11-usestate-대신-useref)
2. [연관된 상태 단순화하기](#연관된-상태-단순화하기)
3. [연관된 상태 객체로 묶어내기](#연관된-상태-객체로-묶어내기)
4. [useState에서 useReducer로 리팩터링](#usestate에서-usereducer로-리팩터링)
5. [상태 로직 Custom Hooks로 뽑아내기](#상태로직-custom-hooks로-뽑아내기)
6. [이전 상태 활용하기](#이전-상태-활용하기)


## 11. useState 대신 useRef

isMount처럼 특정 플래그 값 혹은 컴포넌트 내부에서 관리되지만 컴포넌트 내부에서 관리를 하기보다는
**한 번 고정된 값을 컴포넌트에서 계속해서 사용하는 값**인 경우에는 useState가 필요가 없다.



```jsx
function RefInsteadOfState() : Element {
    const [isMount, setIsMount] = useState(false);

    useEffect(():void => {
        if (!isMount){
            setIsMount(ture);
        }
    },[isMount]);

    return <div>{isMount && '컴포넌트 마운트 완료!'} </div>;
}
```

마운트 같은 상태를 많이 만들어서 사용 하는것은 <br/>
리렌더링을 많이 유발하기 때문에 -> 좋지 않다

useState를 통해서 값이 만들어졌다는 건
결국 이렇게 setState가 동작을 하면서 원치 않는
리렌더가 컴포넌트에 발생된다

#### 리렌더가 되지않고 값을 가변적으로 저장하고 싶은 경우 <br/> -> **useRef**를 고려해 볼 수 있다.



```jsx
function RefInsteadOfState() : Element {
    const isMount = useRef(false)

    useEffect(() :()=> boolean => {
        isMount.current = true;

        return () :boolean => (isMount.current = false);
    },[])

    return <div>{isMount && '컴포넌트 마운트 완료!'} </div>;
}
```

위 로직에서 렌더링을 유발하지 않기 때문에 불필요한 리렌더가 되지 않는다.

useRef는 DOM 요소에만 붙이는 것이 아니라 컴포넌트의 생명 주기와 상관없이 값을 저장하고 유지할 수 있는 모든 상황에 사용할 수 있다.

> 요약 : useState 대신 useRef를 사용하면 컴포넌트의 생명주기와 동일한 리렌더링되지 않는 상태를 만들 수 있다. 



## 연관된 상태 단순화하기 

복잡할 수록 단순하게 라는 패턴 => KISS (Keep IT Simple Stupid) 


너무나도 복잡하게 만드는 것들은 단순하게 만드는 것보다 못하다



로딩일 때, 실패일 때,성공일 때에 맞춰서 렌더링이 되는 그러한 조건부 렌더링 컴포넌트이며 시도할 때, 성공할 때, 실패할 때 세가지 상태가 있는데
이 코드는 상태를 관리하는데 현재는 문제가 없지만 잠재적인 문제가 존재합니다.


```jsx
function FlatState(){
    const [isLoading,setIsLoading ] = useState(false);
    const [isSuccess,setIsSuccess] = useState(false);
    const[isFail,setIsFail] = useState(false);

    const fetchData = () => {
    //fetch Data 시도
    setIsLoading(true);

    fetch(url)
        .then(()=> {
            //fetch Data 성공
            setIsLoading(false);
            setIsSuccess(true);
        })
        .catch(() => {
            //fetch Data 실패
            setIsFail(true);
        });
    };
    if (isLoading) return <LoadingComponent />;
    if (isFail) return <FailComponent />;
    if (isSuccess) return <SuccessComponent />;
}
```

이 상태의 문제는 
loading, Success, Fail 모두 다 연관이 되어 있다는 것

```isLoading```이 true일 경우에는 나머지 상태에는 false이길 기대하고

데이터를 가져오는데 성공할 경우에는
```isSuccess``` 상태만 true일 것을 기대한다.

```isFail```가 true일 경우에는
나머지 상태가 false일 것을 기대한다.

#### 열거형 데이터로 바꿔 보자
열거형 데이터를 간단한 문자열로 정의를 해보자면

```jsx
const PROMISE_STATE ={
    INIT :'init',
    LOADING : 'loading',
    Success: 'Success',
    Fail : 'Fail',
}

function FlatState(){
    const [promiseState, setPromiseState] = useState(PROMISE_STATE.INIT);

    const fetchData = () => {
    //fetch Data 시도
    setPromiseState('loading');

    fetch(url)
        .then(()=> {
            //fetch Data 성공
            setPromiseState('Success');
        })
        .catch(() => {
            //fetch Data 실패
            setPromiseState('Fail');
        });
    };
    if (promiseState ==='loading' ) return <LoadingComponent />;
    if (promiseState ==='Fail') return <FailComponent />;
    if (promiseState === 'Success') return <SuccessComponent />;
}
```

 isLoading이라는 setState, isSuccess라는 setState, isFail라는 setState를 다 쓰고 있는데 이거를 하나로만 쓰는 방법이다.

PROMISE_STATE를 통해 단 하나의 상태로 정말 편리하게 문자열만 사용해서 불변으로 상태를 관리하고 있다.

다른 관련된, 연관된 상태를 동기화하는 것에 대한 신경을 쓸 필요가 없게 되는것이다.
연관된 상태, 도미노와 같은 상태는 이런 식으로 묶어서 처리할 수 있는 방법이 있다.

> 리액트의 상태를 만들 때 연관된 것들끼리 묶어서 처리하면 에러를 방지하고 코드가 간결해진다. 


## 연관된 상태 객체로 묶어내기


```jsx
function ObjectState(){
    const [isLoading,setIsLoading ] = useState(false);
    const [isSuccess,setIsSuccess] = useState(false);
    const[isFail,setIsFail] = useState(false);

    const fetchData = () => {
        //fetch Data 시도
        setIsLoading(true);

    fetch(url)
        .then(()=> {
            //fetch Data 성공
            setIsLoading(false);
            setIsSuccess(true);
        })
        .catch(() => {
            //fetch Data 실패
            setIsFail(true);
        });
    };
    if (isLoading) return <LoadingComponent />;
    if (isFail) return <FailComponent />;
    if (isSuccess) return <SuccessComponent />;
}
```

이전에는 연관된 상태들이 묶여 있을 때 어느 정도 이 연관된 상태를 이어주기 위해서
열거형 스타일의 문자열을 활용 했다.

이번에는 반대로 연관된 상태를 객체로 묶어 내보자


객체로 묶어보자면

```jsx
function ObjectState(){
    const [fetchState, setFetchState] =useState({
        isLoading:false
        isFinish :false
        isError:false
    });


    const fetchData = () => {
            //fetch Data 시도
        // setFetchState({
        //     isLoading:true,
        //     isFinish :false,
        //     isError:false,
        // });
         setFetchState((prevState)=> ({
            ...prevState,
            isLoading:true,
        }));

    fetch(url)
        .then(()=> {
            //fetch Data 성공
        // setFetchState({
        //     isLoading:false,
        //     isFinish :true,
        //     isError:false,
        // });
         setFetchState((prevState)=> ({
            ...prevState,
            isFinish:true,
            isLoading:false,
        }));
        })
        .catch(() => {
            //fetch Data 실패
        // setFetchState({
        //     isLoading:false,
        //     isFinish :false,
        //     isError:true,
        // });
         setFetchState((prevState)=> ({
            ...prevState,
            isError:true,
            isLoading:false,
        }));
        });
    };
    if (fetchState.isLoading) return <LoadingComponent />;
    if (fetchState.isFail) return <FailComponent />;
    if (fetchState.isSuccess) return <SuccessComponent />;
}
```

FetchState를 만들어서 객체로 바꿔주고

```jsx
        setFetchState({
            isLoading:true,
            isFinish :false,
            isError:false,
        });
```
계속 반복되는 코드들 이전 상태를 callback으로 꺼낸 후
prevState 를 가져오고 
<br/>이전 상태들은 그대로 가져오고
isLoading true만 변경되는구나 라는 걸 알 수가 있다.


```jsx
setFetchState((prevState)=> ({
            ...prevState,
            isLoading:true,
        }));
```

#### 여러 상태도 하나의 useState로 표현할 수도 있어서 무의미한 state를 안 만드는 게 가장 좋다.


> 리액트의 상태를 만들때 객체로 연관된 것들 끼리 묶어서 처리할 수 있다.




## useState에서 useReducer로 리팩터링 

연관된 상태를 엮기보다는 상태를 구조화한다 라는 관점에서 봐야한다

```jsx
const INIT_STATE = {
    isLoading :false,
    isSuccess:false,
    isFail:false,
}
// const reducer 추가

function StateToReducer(){
    const [state,dispatch] = useReducer(reducer, INIT_STATE)
    const [isLoading,setIsLoading ] = useState(false);
    const [isSuccess,setIsSuccess] = useState(false);
    const[isFail,setIsFail] = useState(false);

    const fetchData = () => {
        //fetch Data 시도
        setIsLoading(true);

    fetch(url)
        .then(()=> {
            //fetch Data 성공
            setIsLoading(false);
            setIsSuccess(true);
        })
        .catch(() => {
            //fetch Data 실패
            setIsFail(true);
        });
    };
    if (isLoading) return <LoadingComponent />;
    if (isFail) return <FailComponent />;
    if (isSuccess) return <SuccessComponent />;
}

```

```jsx
const reducer = (state,action) => {
    switch (action.type){
        case 'FETCH_LOADING':
            return {...state, isLoading:true}
        case 'FETCH_SUCCESS':
            return {...state, isSuccess:true}
        case 'FETCH_FAIL':
            return {...state, isFail:true}
        default:
            return INIT_STATE
    }
}
```
useReducer라는 함수를 가져다 쓰고

useState도 상태를 get 할 수 있고
상태를 set 할 수 있고

#### useReducer도 마찬가지로 상태를 get 할 수도,  상태를 set 할 수도 있다.


두 번째 인자로는 초기 상태를 줘야 하며
첫 번째 인자로는 reducer를 줘야 된다.

#### -> useReducer의 첫 번째 인자에서는 조작하는 함수 , (두 번째 인자에는) 초기 값을 넣을 수 있다 



```jsx
const INIT_STATE = {
    isLoading :false,
    isSuccess:false,
    isFail:false,
}
const reducer = (state,action) => {
    switch (action.type){
        case 'FETCH_LOADING':
            return {...state, isLoading:true}
        case 'FETCH_SUCCESS':
            return {...state, isSuccess:true}
        case 'FETCH_FAIL':
            return {...state, isFail:true}
        default:
            return INIT_STATE
    }
}


function StateToReducer(){
    const [state,dispatch] = useReducer(reducer, INIT_STATE)
    const [isLoading,setIsLoading ] = useState(false);
    const [isSuccess,setIsSuccess] = useState(false);
    const[isFail,setIsFail] = useState(false);

    const fetchData = () => {
        //fetch Data 시도
        dispatch({type:'FETCH_LOADING'})

        fetch(url)
            .then(()=> {
                //fetch Data 성공
                dispatch({type:'FETCH_SUCCESS'})
            })
            .catch(() => {
                //fetch Data 실패
                dispatch({type:'FETCH_FAIL'})
            });
        };
        if (state.isLoading) return <LoadingComponent />;
        if (state.isFail) return <FailComponent />;
        if (state.isSuccess) return <SuccessComponent />;
}
```

이 reducer 문법은 React와 상관없는 순수한 자바스크립트 문법이기 때문에
hook이나 React에 의존적인 코드가 아니어서 다른 데서도 선언해서 끌어다가
사용할 수 있는 코드라는 장점도 있다.

#### 이전 코드와는 다르게 상태를 이렇게 하나하나 조작하고 로직이 얽혀 있는 부분을 다 추상화 해준다.

-> action type 하나만 호출하면 그 안에 내부 로직이 모두 추상화 되어 있기 때문에
함수를 호출하는 구문에서는 이 부분 내부에
뭐가 있는지 몰라도
action type만 보고도 어떤 action이 일어나서 dispatch되고
그 action으로 상태가 바뀌는구나 하고 추론할 수 있는 것이다. 


그리고 이거보다 더 복잡한 상태들이 오갈 때
그 상태를 reducer에서 체계화해서
구조적으로 관리할 수 있다!


> 여러 상태가 연관됐을 때 useState 대신 useReducer 를 사용하면 상태를 구조화 할 수 있다. 




## 상태로직 Custom Hooks로 뽑아내기 

fetchData와 state 로직을 확장성 있게 재활용하고 싶다면 

```jsx
const INIT_STATE = {
    isLoading :false,
    isSuccess:false,
    isFail:false,
}
const reducer = (state,action) => {
    switch (action.type){
        case 'FETCH_LOADING':
            return {...state, isLoading:true}
        case 'FETCH_SUCCESS':
            return {...state, isSuccess:true}
        case 'FETCH_FAIL':
            return {...state, isFail:true}
        default:
            return INIT_STATE
    }
}

const useFetchData =(url) =>{
    const [state,dispatch] = useReducer(reducer, INIT_STATE)

    useEffect(()=> {
        const fetchData = async () => {
        //fetch Data 시도
        dispatch({type:'FETCH_LOADING'})

        await fetch(url)
            .then(()=> {
                //fetch Data 성공
                dispatch({type:'FETCH_SUCCESS'})
            })
            .catch(() => {
                //fetch Data 실패
                dispatch({type:'FETCH_FAIL'})
            });
        };
        fetchData()
    }[url])

    return state
}

function CustomHooks(){
    const {isLoading, isFail, isSuccess} = useFetchData('url')

    if (isLoading) return <LoadingComponent />;
    if (isFail) return <FailComponent />;
    if (isSuccess) return <SuccessComponent />;
}
```

useFetchData로 모든 걸 대체하고 state는 객체이기 때문에
그대로 객체로 활용한다.
Custom Hook은 꼭 use prefix use 접두사가 들어가야 한다.


> Custom Hooks를 사용하면 코드를 확장성있고 재사용 가능하게 작성할 수 있다. 


## 이전 상태 활용하기 
updater function을 callback에 넣는 방법

```jsx
function PrevState(){
    const [age,setAge] = useState(42);

    function updateState() {
        setAge(age+1);  //setAge(42+1)
        setAge(age+1);  //setAge(42+1)
        setAge(age+1);  //setAge(42+1)
    }
    function updateFunction(){
        setAge((prevAge) => prevAge +1); //setAge(42 => 43)
        setAge((prevAge) => prevAge +1); //setAge(43 => 44)
        setAge((prevAge) => prevAge +1); //setAge(44 => 45)
    }
}
```

첫번째는 setState 자체가 비동기적 처리 과정을 거칠 수 있기 때문에
이전 상태를 참고하는 게 아니라 갱신되기 전 상태를 계속 바라볼 수도 있다.

#### -> 이전 상태를 가져와서 업데이트하는 방법으로 진행해야한다.

> updater function을 사용해 prev state를 고려하면 예상치 못한 결과를 예방할 수 있다. 

