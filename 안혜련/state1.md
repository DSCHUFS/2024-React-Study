## 7.올바른 초기값 설정

```jsx
const [count, setCount] = useState();
const [list, setList] = useState();

//다음과 같이 설정하기 
const [count, setCount] = useState(0);
const [list, setList] = useState([]);
```

리액트 렌더링은 여러 번 발생되고 속도, 순서를 제어할 수 없는 경우가 많기 때문에

이런 초기 값이 중요하다

초기 list를 잘 넣어놔야 ⇒ 많은 Nullable 방어 코드를 지울 수가 있다.

### 초기값

가장 먼저 렌더링 될때 순간적으로 보여질 수 있는 값이기도 하다

### 초기값을 지키지 않을 경우

- 렌더링 이슈, 무한루프 , 타입 불일치로 의도치 않은 동작 , 럳타임에러 발생가능

- 초기값을 넣지 않으면 **undefined**가 들어가고

  -> 상태를 CRUD할때 상태를 지울때도 초기값을 잘 기억해놔야 원상태로 돌아가는데 원상태로 돌아가는 로직이 잘못될 수 있다. 

초기값은 애플리케이션이 종료될 때까지 영향을 미치는 중요한 데이터이며
빈값, null처리할때 불필요한 방어코드도 줄여준다. 

#### ⇒ 초기값 설정을 통해 더 안전한 컴포넌트를 만들 수 있다.


## 8. 업데이트 되지 않는 값 

```jsx
export const component = () => {
	
	const INFO = {
			a : "a",
			b : "b",
		};  //외부로 추출 
		
		return <Mycomp info = {INFO} />
		};

```

### 변수를 컴포넌트 내부에 직접적으로 가지고 있는 경우

매번 렌더링 될 때마다 같은 값이더라도 또 다시 참조해야하기 때문에 
**⇒ 불필요한 참조**

### 추천하는 방법은 -> 아예 컴포넌트 외부로

JSX 내부에서 참고하고 있더라고 한 파일 내에 있고 INFO를 바라보는 참조는 변치 않기 때문에 가능하다

### 리액트에 관리되지 않는 값은  ⇒ 컴포넌트 외부로 드러내자 !
```jsx
const INFO = {
			a : "a",
			b : "b",
		};
		
export const component = () => {
	
		return <Mycomp info = {INFO} />
		};

```

## 9. 플래그 상태로 바꾸기

플래그 값은
프로그래밍 언어에서 전통적으로 특정 조건을 갖고 있거나 어떠한 흐름을 제어하기 위한 조건을 불리언으로 나타내는 값을 뜻한다.

useEffect안에 분기문을 합치거나 묶을 수 있지만 **불필요한 상태를 만들지 않기 위해서는 밖으로 빠져도 된다.**


플래그 변수를 컴포넌트 내부에서 변수를 만들고 
조건만 잘 관리하면 굳이 큰 수정 없이 큰 버전 변경 없이 관리할 수가 있습니다
  ⇒ 상태가 필요없게 되고 그 상태를 위한 분기문을 만들 필요가 없다. 
  ### useState대신 플래그로 상태를 정의 할 수 있다.

``` jsx
export const component = () => {
	const [isLogin, setIsLogin] = useState(false);
	
	useEffect(() =>{
		if(a){
			setIsLogin(true)
		}
		if(b){
			setIsLogin(true)
		}
	},[a,b]);
};

//useEffect를 사용하여 특정 조건(a 또는 b)이 변경될 때마다 이 상태를 업데이트
//상태 변경에 따라 컴포넌트가 재렌더링



export const component = () => {
	const isLogin = a || b
};

//컴포넌트가 렌더링될 때마다 재계산되므로 별도의 상태 관리가 필요 없다.

```



## 10. 불필요한 상태

completed가 true인것만 넣어주기 위해서 아래와 같이 작성하는데
```jsx
useEffect(() : void => {
	const newList = complUserList.filter((user) : boolean => user.completed === true );
	
	setUserList(newList);
	},[userList]);
	
```
**렌더링될 때마다 고유의 complUserList가 생성**되기 때문에

###  => 관리할 필요도 없고 setUserList 를 만들어주지 않아도 된다.

 ⇒ 불필요한 코드

``` jsx
const newList = complUserList.filter((user) : boolean => user.completed === true );
```

### 컴포넌트 내부의 변수는

렌더링마다 고유의 값을 가지는 계산된 값을 가진다

### ⇒  변수를 통해 상태를 조작하지 않고  변수표현식으로 가능하다

