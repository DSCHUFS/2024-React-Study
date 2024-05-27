## 알아두면 좋은 컴포넌트

- 일반적으로 컴포넌트 네이밍 -> pascal case 사용해야함 
- 기본적인 HTML 요소 -> lower case

``` jsx
function ComponentNaming() :Element{
    React.createElement()
    return(
        <>
        <h1></h1>
        <h2></h2>
        <div></div>
        <input/>
        <MyComponent></MyComponent>
        </>
    );
}
```

#### 컴포넌트 네이밍 규칙을 이해하고 사용하자 !!


## JSX 컴포넌트 함수로 변환

``` jsx
return(
    <div>
    {TopRender()}
    <TopRender />
    {renderMain({

    })}
    <div/>
)
```

TopRender 가 명시적으로 컴포넌트임을 알 수 있다.

하지만 
- 연산된 값이 계속 렌더링 될 때마다 반환되는 건지 문자열인지 알기가 어렵다. 

- props를 넘기기가 상당히 까다롭다.


컴포넌트는 조금 더 명시적으로 컴포넌트로 알 수 있도록

그리고 명시적으로 props로 넘길 수 있는 형태로 바꾸는 걸 추천


#### 요약: 함수로 return하는 경우 단점
- scope를 알아보기 어렵다
- 반환 값을 바로 알기 어렵다
- props 전달 등 일반적인 패턴이 아니다. 


## 컴포넌트 내부에 컴포넌트 선언

``` jsx
function OuterComponent():Element{
    //x
    const InnerComponent =():Element => {
        return <div> Inner component </div>;
    };

    return(
        <div>
            <InnerComponent />
        </div>
    );
}
```
컴포넌트 내부에 추가적으로 컴포넌트 선언-> x

 외부로 드러내자
``` jsx
const InnerComponent =():Element => {
    return <div> Inner component </div>;
};

function OuterComponent():Element{
    return(
        <div>
            <InnerComponent />
        </div>
    );
}
```

컴포넌트 내부에 컴포넌트를 또 만든다면
1. 결합도 증가 
    - 구조적으로 스코프적으로 종속된 개발이 된다.
    - 나중에 확장성이 생겨서 분리될때 힘들어진다.
2. 성능 저하
    - 상위 컴포넌트 리렌더되면 => 하위 컴포넌트 재생성 

#### 요약: 컴포넌트 내부에 컴포넌트를 선언하면 결합도가 증가하고 성능저하 될 수 있다. 


## displayName

 displayName =>  
 displayName은 리액트(React)에서 컴포넌트의 이름을 설정하는 속성으로 이 속성은 주로 디버깅과 개발 도구에서 컴포넌트를 식별하는 데 사용된다. 

 => 중요한 디버깅 요소

리액트 devtools를 했을 때

- displayName이 잘 지정이 되어 있지 않고

- 모든 컴포넌트가 동적으로 익명으로 만들어지면

devtools를 사용을 해서 디버깅을 할 때

=> 수많은 컴포넌트가 어떤 건지 전혀 알 수가 없다.


``` jsx
const InputText = forwardRef((props,ref) : Element => {
    return <input type="text" ref={ref}/>;
});

InputText.displayName = 'inputText';
```


forwardRef로 감싸고 동적으로 사용되니까


=> InputText.displayName 문자열을 넣어주면 된다. 


내가 만든 component들을 타인이 사용할 때

-> 디버깅이 편리하고

-> 쉽게 사용하실 수 있을 것 같습니다

=> 확장성이 높은 컴포넌트를 더 디버깅하기 쉽게 전달하기 위한 방법

### devtools에서 익명함수를 쉽게디버깅하려면 displayName속성을 사용하자!!


## 컴포넌트 구성하기

- 상수는 어디에 선언할까?
- 타입 선언시 interface와 type 중 어떤걸 사용할까?
- 컴포넌트 Props 타입명은 어떤 규칙으로 정의하나요?
- 컴포넌트 선언시 const와 function 중 어떤 걸 사용하나요?
- 어떤 순서로 컴포넌트 내부 변수를 선언하나요?
- useEffect는 어디에 선언하나요?
- JSX return 하는 규칙이 있나요?
- styled-componenet는 어디에 선언하나요?

=> 정답은 없습니다

팀의 규칙을 따르자 !

---
상수는 어디에 선언할까?

- 변하지 않을 상수는 컴포넌트 외부에 선언

타입 선언시 interface와 type 중 어떤걸 사용할까?

- interface를 선호

 컴포넌트 Props 타입명은 어떤 규칙으로 정의하나요?
- 컴포넌트 명과 일치하는 props 타입명을 사용하는 것을 선호

컴포넌트 선언시 const와 function 중 어떤 걸 사용하나요?
- 공식 문서에서는 함수 선언문을 사용하기도 하고, 함수 표현식을 사용하기도 함. 타입을 어떻게 하는지 차이를 생각해보자

어떤 순서로 컴포넌트 내부 변수를 선언하나요?
- 플래그성 상태나 ref는 상단에, Third Party 라이브러리에서 제공하는 hook은 그 다음에, custom hook은 그 다음에, useState와 같은 내부 상태는 마지막에 선언

useEffect는 어디에 선언하나요?
- useEffect는 main JSX와 가장 가까운 곳에 위치하는 것이 좋다. 
보통 컴포넌트의 하단에 선언합니다.


JSX return 하는 규칙이 있나요?
- JSX를 반환하는 부분은 앞에 한 칸 개행을 넣어, 반환되는 JSX라는 것을 명확히 표시

 styled-componenet는 어디에 선언하나요?
- 컴포넌트와 가까운 곳에, 하단에 선언