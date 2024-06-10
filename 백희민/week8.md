# 1. Hook API 소개
### 클래스 컴포넌트의 문제점
* 코드 반복성 문제.
* 구조 복잡하고 무거워서 보일러플레이트 코드 많아짐.
* 로직 공유 어려움.

### 로직 재사용 패턴
* 고차 컴포넌트(HOC): 컴포넌트 인수로 받아 기능 추가함.
* Render Props: props로 함수 받아 그 함수로 컴포넌트 렌더링함.

### 함수형 컴포넌트의 등장
* StatelessComponent 개념 나옴: 상태 없는 순수 함수형 컴포넌트로 불필요한 클래스 확장 필요 없어짐.
* 함수형 컴포넌트에서도 state와 생명주기 메서드 필요해짐.

### Hooks의 등장
* 함수형 컴포넌트에서 상태와 생명주기 메서드 사용 가능하게 만듦.
* 컴포넌트 로직 더 잘 재사용하고 확장 가능하게 만듦.
* 함수형 컴포넌트에서 state 선언하고(sideEffect 처리 가능하게 함).

### Hooks의 장점
* 간결하고 읽기 쉬운 코드.
* 불필요한 클래스 선언과 this 바인딩 문제 해결.
* 로직 훨씬 쉽게 재사용 가능.

### Hooks 사용 시 고려사항
* 리액트 16.8부터 많은 변화 생겨, 사용 시 주의할 점 있음.
* React 개발팀에서 ESLint 플러그인 제공.


# 2. useEffect() 기명 함수와 함께 사용하기

### 기명 함수란?

* 이름이 있는 함수.
* 자바스크립트의 일급 객체 특성 덕분에 함수는 변수에 담아 활용 가능.
* 모던 자바스크립트에서는 화살표 함수로 이름 선언 없이도 사용 가능.

### 익명 함수의 단점
* 화살표 함수 간편하지만, 코드 복잡해지면 함수 목적 이해 어려움.
* 익명 함수는 디버깅 시 함수 이름 없어 콜 스택 추적 힘듦.

### useEffect의 안전한 사용
* 팀 많아지고 코드 복잡해지면, useEffect에 익명 함수 대신 기명 함수 사용하는 게 좋음.
* 기명 함수는 함수 목적 명확하게 나타낼 수 있음.

### 기명 함수의 장점
* 가독성 향상: 함수 이름만으로도 함수 역할 알 수 있음.
* 예시: isInViewSomeComponent, onPushState, onInit, onIncrement.

### 디버깅 용이성:
* 에러 발생 시 로그에 함수 이름 표시돼 콜 스택 추적 용이함.
* useEffect 많을 때 어떤 함수에서 문제 발생했는지 쉽게 알 수 있음.


### 디버깅 시 장점
* 기명 함수 사용 시 콘솔 로그, 리포트 도구, 모니터링 도구, 리액트 devtools에서 함수 이름 표시돼 디버깅 쉬워짐.
* 같은 컴포넌트 안에 여러 useEffect 있을 때, 함수 이름 통해 어떤 함수에서 에러 발생했는지 쉽게 파악 가능.





# 3. 한가지 역할만 수행하는 useEffect()

### SOLID: 객체지향 설계의 다섯 가지 원칙 중 하나.
### SRP (Single Responsibility Principle): 단일 책임 원칙. 하나의 역할만 수행하는 무언가를 만들자는 것.
### useEffect와 단일 책임 원칙
* useEffect 사용할 때 단일 책임 원칙 적용하면 편리하고 안정적임.

### 점검 방법
useEffect에 넘기는 첫 번째 콜백에 기명 함수 적용.
Dependency array에 여러 가지 의존성이 들어가는지 점검.
예시 코드: 로그인 페이지


'''javascript
/*   X    */
function LoginPage({ token, newPath })  {
    useEffect(() => {
        redirect(newPath);

        const userInfo = setLogin(token);
        //.. 로그인 로직

    }, [token, newPath]);
}
'''

* 문제점: 로그인 처리와 리디렉션을 하나의 useEffect에서 처리.
* 위험성: 토큰 변경과 경로 변경이 엮여서 의도치 않은 동작 발생 가능.
* 토큰 변경 시 리디렉션, 경로 변경 시 로그인 로직 실행 가능.

### 해결방법
* 분리하여 각각의 useEffect로 나누기.
* 기명 함수 사용하여 각 역할 명확히 하기.

'''javascript
/*    O  (의존성이 명확히 분리되어 불필요한 리렌더링과 함수 동작 방지) */
function LoginPage({ token, newPath })  {
    useEffect(() => {
        redirect(newPath);
    }, [newPath])

    useEffect(() => {
        const userInfo = setLogin(token);
        //.. 로그인 로직
    }, [token]);
}
'''

### 결론
* useEffect는 단일 책임 원칙 지키는 것 중요.
* 의존성 증가하면 분리하여 각각의 useEffect로 나누기.
* 기명 함수 사용하여 역할 명확히 하고 디버깅 용이하게.


# 4. Custom Hooks 반환의 종류
### 튜플 형태
'''javascript
// X, 무조건 Getter 왼쪽, setter 오른쪽
const useSomeHooks = bool() => {
    return [setState, state]
}
function ReturnCustomHooks() {
    const [setValue, value] = useSomeHooks(true);
}
'''
### 단일 값 반환
'''javascript
// X 하나의 valu만 있는 경우에는 배열로 할 필요X. 직접 반환하는 것이 가독성 면에서 좋음.
const useSomeHooks = bool() => {
    return [state]
}
function ReturnCustomHooks() {
    const [oneValue] = useSomeHooks();
}
'''
### 객체 반환
'''javascript
// 객체로 반환하면 필요한 데이터만 뽑아올 수 있음.
const useSomeHooks = bool() => {
    return {
        first,
        second,
        third,
        rest
    }
}

function ReturnCustomHooks() {
    const { fist: fistname, second: secondValue, rest: thirdValue } = useSomeHooks(true);
}
'''


### 결론
* custom hooks 반환 타입을 변수, 배열, 객체 등으로 상황에 맞게 결정하자

# 5. useEffect() 내부의 비동기

### useEffect 내부에서 비동기 함수 사용 불가
* useEffect 안에서 async 함수나 await 직접 사용 못 함.
* useEffect 첫 번째 인자로 전달되는 콜백 함수 반환 타입 제한적임.
* useEffect는 함수나 undefined만 반환할 수 있고, async 함수는 항상 Promise 반환해서 이와 맞지 않음.


### 비동기 함수 사용 시 에러 발생
* 비동기 함수 직접 쓰면 예기치 않은 동작 발생할 수 있음.
'''javascript
// X
// 'await' is only allowed witin async functions
useEffect(asymc () => {
    //비동기 작업
    const result = await fetchData();
}, []);
''' 

### 해결방법
* 비동기 작업 처리할 때는 useEffect 내에서 일반 함수로 작성하고, 그 함수 내에서 비동기 함수 호출해야 함.
'''javascript
// O
useEffect(asymc () => {
    const fetchData = async () => {
        const result = await someFetch();
    };

    fetchData();
}, [dependency]);
'''

* 요약 : useEffect의 콜백 함수로 비ㅇ기 함수를 바로 넣을 수 없다. 동작이 불안정해지기 때문!