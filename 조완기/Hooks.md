## 1. Hooks API
- 클래스 컴포넌트를 왜 Hook으로 바꾸어야 할까?
  - 단순히 클래스 컴포넌트가 오래되서 별로다 는 아님

- HOC(고차 컴포넌트)
  - `컴포넌트 로직을 재사용`하기 위한 리액트의 고급기술
  - React API의 일부 아니고, React의 구성적 특징서 나오는 패턴
```jsx
  const EnhancedComponent = higherOrderComponent(WrappedComponent);

  export default connect(mapStateToProps, mapDispatchToProps)(TodoApp)
```
  - 원래 HOC는 componentDidMount, Unmount, HandleChange 등으로 구성
    - 중복된 경우가 많았기에 HOC로 뽑아서 재활용하는 패턴

- Render Props
  - 컴포넌트 간 코드 공유를 위해 함수 Props를 이용하는 테크닉

- SFC(Stateless functional Components)
  - 대부분 현재 없어짐
  - Stateless, Stateful 둘다 가능해서 혼란을 주었음
```jsx
// 무겁게 렌더 함수에 넣고~
export default class test extends Component {
  render() {
    return (
      <div>{this.props.name}</div>
    )
  }
}
// props를 순수하게 받아서 그냥 넘기기
const StatelessComponent = props => <div>{props.name}</div>;
```
이런 역사를 거쳐 Hook 이 공개

- Hook은 무조건 좋을까?
1. 최상위 에서만 Hook을 호출
2. React 함수에서만 호출
해야한다는 규칙과 Linter 플러그인이 제공

- 결국 패턴화
1. 상태 선언
2. useEffect등 렌더링 되면서 생겨나는 이펙트 조절부
3. 렌더링 부분

## 2. useEffect() 기명 함수와 함께 사용하기
- 기명함수를 useEffect의 콜백으로 넘기면 좋은 이유
  - JS의 일급 객체 특성 덕분에 함수를 선언, 변수에 담을 수도 있음
1. 이름을 통해 함수의 기능을 추론 가능
2. 에러 발생시 함수의 이름이 로그의 콜 스택에 쌓여 쉽게 확인 가능
```jsx
// X
  useEffect(() => {
    if(navigationType === 'POP') {
      // logic
    }
  }, [navigationType]);
// O 
  useEffect(function onPopState() => {
    if(navigationType === 'POP') {
      // logic
    }
  }, [navigationType]);

```

## 3. 한가지 역할만 수행하는 useEffect
- 한번에 하나의 역할만 수행하는 무언가를 만들자 
1. 콜백에 기명함수를 적용
2. Dependency Arr에 너무 많은 대상이 들어가는가?
```jsx
// X
  useEffect(() => {
    redirect(newPath);

    const userInfo = setLogin(token);
    // Login Logic
  }, [token, newPath]);

// O
  useEffect(() => {
    redirect(newPath);
  }, [newPath]);

  useEffect(() => {
    const userInfo = setLogin(token);
    // Login Logic
  }, [token])
  
```

## 4.Custom Hooks 반환의 종류
- 무조건 배열로만 반환할 필요는 없음
- 배열 구조 분해 할당의 장점 -> 이름변경과 getter, setter 로 활용 가능
- 객체 반환의 장점 -> 편안하게 필요한 값만 뽑아서 쓸 수 있다.
```jsx
  const useSomeHooks_a = (bool) => {
    return [setState, state]
  }

  const useSomeHooks_b = (bool) => {
    return state
  }

  const useSomeHooks_c = (bool) => {
    return {
      first,
      second,
      third,
      rest
    }
  }
```

## 5. useEffect 내부의 비동기
- useEffect 함수 내부에선 비동기 함수 사용불가

```jsx
// X
// useEffect 는 함수나 undefined등을 허용
// async await은 Promise 를 리턴
useEffect(async() => {
    const result = await fetchData();
  }, [])

// O
useEffect(() => {
    const fetchData = async () => {
      const result = await someFetch();
    };

    fetchData();
  }, [dependency])
    
```