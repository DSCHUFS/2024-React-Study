## week4

## CSS in JS 인라인 스타일 지양하기 

```js
const cardCss ={
    self: css({
        backgroundColor:'white',
        border:'1px solid #eee',
        borderRadius:'0.5rem',
        padding:'1rem',
    }),
    title:css({
        fontSize:'1.25rem',
    })
}

export function Card({title, children}){
    return(
        <div css={cardCss.self}>
            <h5 css={cardCss.title}>
                {title}
            </h5>
            {children}
        </div>
    );
}
```

스타일 코드를 외부로 분리했을때의 장점
- 스타일이 렌더링 될때마다 직렬화되지 않는다 => 한번만 된다.
- 동적인 스타일을 실수로 건드는 확률이 적어진다.
- 로직에 집중하고 JSX를 볼때 조금 더 간결하게 볼 수 있다.


cardCss에서도 
- 타입안정성
- 자동완성으로 DX와 생산성이 향상됨
- export하는 경우 외부의 컴포넌트에서도 재사용, 확장 사용가능

####  📍요약 => CSS in js 인라인 스타일을 지양해야하는 이유
- 성능 저하를 일으키고
- 휴먼 에러가 발생 할 수 있음
- export할 수 없음


## 객체 Props 지양하기 


```js
Object.is(
    {hello:"world"},  //초기렌더링 
    {hello:"world"},   //두번째 렌더링
);

Object.js(
    ["hello"],  //초기렌더링
    ["hello"],   //두번째 렌더링
);

```
두값이 일치하지만 리액트는 초기와 두번째가 같지 않다고 판단해서 두번의 불필요한 렌더링을 유발한다.


``` js
function SomeComponent(){
    return{
        <ChildComponent
            propObj={{hello:"world"}}
            propArr={{"hello","hello"}}
            />
    };
}
```

- 변하지 않는 값일 경우 컴포넌트 외부로 드러내기(트리거 되지않도록)
- 필요한 값만 객체를 분해해서 Props로 내려준다.

``` js
function SomeComponent(){
    const propsArr = [propArr, serPropsArr] =useState(["hello","hello"])

    return{
        <ChildComponent
            hello ='world'
            hello2={propsArr.at(0)}
            />
    };
}
```
- 정말 값 비싼 연산, 너무 잦은 연산이 있을경우 useMemo() 활용하여 계산된 값을 메모이제이션 한다.
```js
function SomeComponent({heavyState}) {
  const [propArr, setPropArr] = useState(["hello", "hello"]);

  const computedState = useMemo(() => ({
    computedState :heavyState
  }), [heavyState])

  return (
    <ChildComponent 
      hello = 'world'
      hello2 = {propArr.at(0)}
      computedState = {{
        heavyState : heavyState}}
    />
  );
}
```

하위 컴포넌트에서 필요한 값만 구조적으로 분해하고 할당하자
- 컴포넌트를 더 평탄하게 나누면 나눌 Props 또한 평탄하게 나눠서 내릴 수 있다. 


## HTML Attribute 주의하기 

HTML 기본속성 주의하기 

``` js
function HTMLDefaultAttribute() :Element{
    const MyButton = ({children, ...rest }) :Element => (
        <button {...rest}> {children} </button>
    );
    return(
        <>
        <MyButton className="mt-0" type="submit">
            clean code
        </MyButton>

        <input type="number" maxLength="99"/>
        </>
    );
}
```

자바스크립트에서 쓰듯이 camelCase로 className을 넘기고 있다.
리액트 때문에 어쩔 수 없이 웹 표준을 어겨서 className을 넣고 있다.


-> 결국에 리액트를 사용을 해보면 웹 표준을 어기게 되는 순간이 오고 어쩔 수 없이 그걸 따르게 되는 순간들이 온다.

props들을 선언할 때 컴포넌트의 props랑 네임이 겹치지 않는지 확인해야함

=> 내가 만든 커스텀 컴포넌트에 넘길떄 HTML attribute가 중복되지 않도록 주의하자

#### 📍 요약 => HTML ,JS에서 정의한 예약어와 커스텀 컴포넌트 props가 혼용되지 않도록 하자 


## spread 연산자 쓸때 주의할점

``` js
const ParentComponent =(props) => {
    return <ChildOrHOCComponent {...props} />
}

class ParentComponent extends React.Component{
    render(){
        return<ChildOrHOCComponent {...this.props} />
    }
}
```

spread 연산자는
객체를 구조 분해할 수 있는 자바스크립트 표준 문법이다

spread operator로 하위 컴포넌트에 props를 넘길때가 많다.

주의할점
- 코드를 예측하기 어렵다.
- props drilling ( : 상위 컴포넌트에서 받은 props를 하위 컴포넌트로 전달하고, 그 하위 컴포넌트에서 또 다른 하위 컴포넌트로 props를 전달하는 과정을 반복하는 것) 
- 어떠한 props가 내려오는지 알기가 어렵다.
- 렌더링에 문제도 생길 수 있다.

불필요하게 props를 쓰는 경우라면 이렇게 하자

``` js
const ParentComponent =(props) => {
    const {관련_없는_props, 관련_있는_props, ...나머지_props} =props;

    return (<ChildOrHOCComponent 
        관련_있는_props={관련_있는_props}
        {... 나머지_props}
        />)
}
```

관련 없는 props를 분리해서 하위 컴포넌트에 주지 않는다

관련 있는 props 명시적으로 구분하고

나머지 props는 그대로 넘긴다.

- 필요없는 props를 버리는 것도 불필요한 행위 아닌가?

    불필요한 객체 더미를 넘기는 것보단 낫다

#### 📍요약 =>   props에서 spread 연산자가 쓰이면 관련 있는 props, 없는 props, 나머지 props로 나눠보자



## 많은 props 분리하기

props가 너무 많은 경우, 코드를 분리하여 관리하자

```js
const App =() =>{
    return (
        <JoinForm
            user={user}
            auth={auth}
            location={location}
            favorite={favorite}
            handleSubmit={handleSubmit}
            handleCancle={handleCancle}

        />
        
    );
};
```
step 1. one depth 분리를 한다

```js
const App =() =>{
    return (
        <JoinForm
            onSubmit={handleSubmit}
            onReset={handleReset}
            onCancel={handleCancle}
        >
        <UserForm user={user}/>
        <AuthForm auth={auth}/>
        <LocationForm location={location}/>
        <FavoriteForm favorite={favorite}/>
    </JoinForm>
    );
};
```

step 2. 확장성을 위한 분리를 위해 도메인 로직을 다른곳으로 모아넣는다.
```js
const App =() =>{
    return (
        <JoinForm
            onSubmit={handleSubmit}
            onReset={handleReset}
            onCancel={handleCancle}
        >
        <CheckBoxForm formData={user}/>
        <CheckBoxForm formData={auth}/>
        <RadioButtonForm formData={location}/>
        <SectionForm formData={favorite}/>
    </JoinForm>
    );
};
```
=> 확장성 있는 폼을 만들 수 있다. 

props가 많아지는 경우에는 one depth로 나누고 도메인 로직만 떼어 보는 간단한 분리부터 해보자 

#### 📍요약=> props가 많다면 컴포넌트를 분리해보자 

## 객체보다는 단순한 props의 장점

```js
const UserInfo = ({user}) => {
    return (
        <div>
            <img src={avatarImgUrl} />
            <h3> {userName} </h3>
            <h4> {email} </h4>
        </div>
    );
};
```
-> user라는 객체가 다시 생성되는 경우에 UserInfo라는 컴포넌트가 불필요하게 렌더링 될 수 있다.


```js
const UserInfo = ({avatarImgUrl, userName, email}) => {
    return (
        <div>
            <img src={avatarImgUrl} />
            <h3> {userName} </h3>
            <h4> {email} </h4>
        </div>
    );
};
```
- 객체가 다시 생성되는 경우
- 생성되는 객체 때문에 불필요하게 하위 컴포넌트가 또 렌더링 되는 경우
- memo로 감싸서 더욱 더 좁혀서 최적화하기 쉽게 만들 수 있는 경우

객체를 그냥 통으로 내려주기보다는 ->> 객체를 조금 더 구조를 분해해서 할당해서 내리자

#### 📍요약 => props에 객체 전체를 내리지 말고 꼭 필요한 값만 내리자 