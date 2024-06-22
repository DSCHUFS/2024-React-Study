## 1. Hooks API 소개

HOC는 리액트 컴포넌트의 로직을 재사용하기 위한 고급 기술

HOC는 반복을 피하고 확장성을 추구하는 개발자의 요구를 반영한 패턴

=> HOC를 통해 공통 로직을 재사용할 수 있지만, 코드가 복잡해질 수 있다.

React.Component를 확장하고 render 메서드를 호출하는 등의 반복적인 작업이 필요하다.

=> 무거운 클래스 구조로 인해 코드가 복잡해지고 유지보수가 어려워짐


### Stateless Component
props를 받아 순수하게 렌더링하는 함수형 컴포넌트

함수형 컴포넌트에서도 상태 관리가 필요할 경우가 생기면서 혼란이 발생했다.

#### Hooks의 장점
- 기존 클래스 컴포넌트에서 반복되던 로직을 간단하게 표현가능
- 불필요한 클래스 선언과 this 바인딩이 줄어든다.
- useEffect를 사용하여 사이드 이펙트를 처리할 수 있다.
- 상태 선언을 쉽게 할 수 있다.

Hooks는 리액트 컴포넌트의 로직을 단순하고 재사용 가능하게 만들기 위해 되입됨



## 2. useEffect() 기명 함수와 함께 사용하기 

기명함수: 이름이 있는 함수.

- 자바스크립트에 일급객체라는 특성이 있어서 변수에 담아서 활용가능
- 함수 이름만으로 역할 추론 가능.
- 복잡한 로직을 간단하게 이해 가능.

``` jsx
useEffect(() => {
    if(navigationType === 'POP') {
      // some logic
    }
  }, [navigationType]);

// ---->

useEffect(function onPopState() => {
    if(navigationType === 'POP') {
      // some logic
    }
  }, [navigationType]);
```
useEffect에 기명 함수를 함께 넘기게 된다면

#### 함수 네이밍들이 로그에 콜 스택으로 쌓여서 useEffect에 

어떤 함수들, 어떤 useEffect를 잘못 등록헀는지 추적이 쉽다. 

## 3. 한 가지 역할만 수행하는 useEffect()

SRP
#### 단일 책임 원칙
한 번에 하나의 역할만 수행하는 무언가를 만들자

함수, 리액트 컴포넌트, useEffect 등. 포함


### useEffect가 한 가지 역할만 하고 있는지 점검해봐야 한다.

점검 방법
- 기명 함수 사용: useEffect에 넘기는 첫 번째 콜백에 기명 함수를 적용.
- Dependency Array 점검: 의존성이 많은 경우 의심해 보기.

``` jsx
function LoginPage({token,newPath}){
    useEffect(() => {
        redirect(newPath);

        const userInfo = setLogin(token);
        // 로그인 로직 
    }, [token, newPath]);

}
```
useEffect가 로그인 처리와 redirect를 동시에 수행하면 위험.

토큰 변경 시 redirect가 발생하거나, 경로 변경 시 로그인 로직이 실행될 수 있음.
#### ==>  useEffect를 분리하여 각기 다른 역할을 수행하게 함.

``` jsx
function LoginPage({token,newPath}){
  useEffect(() => {
    redirect(newPath);
  }, [newPath]);

  useEffect(() => {
    const userInfo = setLogin(token);
    // 로그인 로직
  }, [token])
}
```
1. 단일 책임 원칙 => useEffect는 단 하나의 역할만 하도록 구성
2. 의존성 관리=>  Dependency Array에 꼭 필요한 의존성만 포함
### 불필요한 리렌더링과 함수 동작을 줄이기 위해 로직을 분리하자

## 4. Custom Hooks 반환의 종류

1. 배열 구조 분해 할당

- 왼쪽에는 getter, 오른쪽에는 setter.

``` const [state, setState] = useState(initialValue);```

2. 하나의 값 반환

단일 값을 반환할 때 배열이나 객체로 감싸지 말고 그대로 반환

``` return value;```

3. 객체 구조 분해 할당

여러 값을 반환할 때 객체를 사용하면 유연성이 높아짐.
``` jsx
const useCustomHook = () => {
  return { value1, value2, value3 };
}
const { value1, value2 } = useCustomHook();
```

배열로만 반환하지 말기
- 배열 반환은 순서에 의존하므로 유연성이 떨어짐.
- 필요한 값만 추출하기 어렵고, 불필요한 값도 반환하게 됨.

객체 반환의 장점
- 이름을 바꿔서 사용할 수 있어 가독성과 사용성이 높아짐.
- 필요한 데이터만 선택적으로 사용할 수 있음.


## 5. useEffect() 내부의 비동기
``` jsx
useEffect(async() => {
    const result = await fetchData();
  }, [])
```
#### 비동기 함수(async/await)는 useEffect의 첫 번째 인자로 사용할 수 없다.
why?
- 반환 타입 불일치: useEffect는 함수나 undefined를 반환해야 하지만, async 함수는 항상 Promise를 반환한다.

-> 예상치 못한 코드 지속적 실행될 수 있다. 

``` jsx
useEffect(() => {
    const fetchData = async () => {
      const result = await someFetch();
    };

    fetchData();
  }, [dependency])
    
```
#### 일반 함수 사용
 useEffect에 일반 함수를 넘기고, 그 내부에서 비동기 함수를 호출.

=>  useEffect 내부에서 비동기 함수를 사용할 때의 문제를 인지하고, 적절한 대안 사용하자

기억할 점: useEffect의 첫 번째 인자로 async 함수를 사용할 수 없다!