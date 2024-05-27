

# 1. 알아두면 좋은 컴포넌트 네이밍

### 컴포넌트 네이밍 규칙:
1. Pascal Case: 사용자 정의(커스텀) 리액트 컴포넌트는 Pascal Case (예: MyComponent)를 사용.
2. 소문자: 기본 HTML 요소는 lower case(예: div, span)를 사용.

### 리액트의 createElement 함수:
* JSX는 내부적으로 React.createElement 함수를 사용하며, 기본 HTML 요소는 소문자로, 리액트 컴포넌트는 Pascal Case로 작성해야 한다.

### Next.js와 파일 네이밍:
* 라우팅 기반의 파일 이름은 주로 kebab case (예: component-naming.jsx)를 사용.
* 폴더 구조에서 index.jsx 파일을 사용해도 컴포넌트 네이밍은 Pascal Case를 따른다.

### 변하지 않는 기본 관습:
* 리액트의 버전이 올라가면서 변할 수 있지만, 기본적인 네이밍 관습은 유지될 가능성이 크다.
* JavaScript의 생성자 함수와 클래스 네이밍 규칙 (Pascal Case)도 마찬가지로 유지되어 왔다.


# 2. JSX 컴포넌트 함수로 변환

1. **비숙련자가 자주 하는 실수**:
```javascript
return (
    <div>
    {TopRender()}
    {renderMain()}
    </div>
);
```
   - 컴포넌트 안에서 함수를 반환하여 컴포넌트를 렌더링.
   - 표현식으로 다양한 함수를 사용하거나, JSX를 Redux 또는 util 함수에 저장.
   - 이러한 방식은 동작하지만 여러 문제를 유발할 수 있다.

2. **문제가 생길 수 있는 이유**:
```javascript
return (
    <div>
    {TopRender()}
    <TopRender />
    {renderMain()}
    </div>
);
```
   - **스코프 문제**: 컴포넌트 내부의 스코프가 꼬일 수 있음.
   - **예측 불가한 사용**: util 함수, Redux, routing 등에서 언제 어떻게 사용될지 예측이 어려움.
   - **컴파일 문제**: .jsx와 .js 파일을 구분하지 못하고 컴파일하면 치명적 이슈 발생 가능.

3. **명시적 컴포넌트 사용의 중요성**:
   - **TopRender** 같은 명시적 컴포넌트 이름 사용 권장.
   - 컴포넌트인지 연산된 값인지 구별하기 쉬움.
   - **Props 처리 문제**: 함수 반환 방식은 props를 넘기기 어렵고 비정상적인 패턴이 될 수 있음.
   - 라이브러리나 SDK가 아닌 내부 프로젝트에서 이런 패턴은 불필요함.

4. **트릭 함수 사용의 단점**:
   - **명확한 이유 필요**: 트릭 함수를 사용하려면 합당한 이유가 있어야 함.
   - **Trade-off**: 명확한 이유가 없다면 손해가 더 큼.
   - 컴포넌트는 명시적이고, props를 명확하게 넘길 수 있는 형태로 작성해야 함.

5. **권장 사항**:
   - 컴포넌트를 명시적으로 작성하고, props를 명확히 넘길 수 있도록 컨벤션을 따를 것.
   - 함수 반환 방식의 JSX 사용은 특별한 이유가 없다면 피할 것.


# 3. 컴포넌트 내부의 inner 컴포넌트 선언

## 컴포넌트 내부에 컴포넌트 선언의 문제점

1. **결합도 증가**:
   - 내부 컴포넌트가 상위 컴포넌트에 종속되어 구조적, 스코프적으로 결합도가 높아짐.
   - 상태와 props의 혼란스러운 사용으로 인해 나중에 확장 시 분리하기 어려워질 수 있음.

2. **성능 저하**:
   - 상위 컴포넌트가 리렌더링될 때 내부 컴포넌트도 재생성되며 성능 저하를 유발.

```javascript
const InnerComponent = () : Element => {
    return <div>Inner component</div>;
};

function OuterComponent() : Element {
    return (
        <div>
        <InnerComponent />
        </div>
    );
}```

## 권장 사항

1. **외부로 컴포넌트 분리**:
   - 결합도를 낮추고 성능을 유지하기 위해 컴포넌트를 외부 파일로 분리하는 것을 추천.
   - 파일 하나 더 만드는 것이 불편하더라도 확장성과 유지보수성을 고려하면 유리.

2. **내부 분리 방식**:
   - 성급한 분리보다 하나의 JSX 파일 안에서 내부적으로 컴포넌트를 분리하는 것도 방법.
   - 파일을 추가하지 않고도 컴포넌트를 분리하여 코드의 가독성과 구조를 유지할 수 있음.

## 결론

- 컴포넌트 내부에 또 다른 컴포넌트를 선언하는 것은 결합도 증가와 성능 저하를 초래할 수 있다.
- 웬만하면 컴포넌트를 외부로 분리하고, 불가피한 경우 내부적으로 분리하는 방법을 고려해야 한다.
- 이렇게 하면 확장성과 유지보수성이 향상되고, 구조적 문제를 피할 수 있다.


# 4. displayname

## displayName이란?

- **displayName**은 리액트 컴포넌트의 디버깅을 돕는 중요한 요소.
- 리액트 devtools에서 컴포넌트가 익명으로 표시되면 디버깅이 어렵다.
- displayName을 설정하면 devtools에서 컴포넌트를 쉽게 식별할 수 있다.

## 사용 사례

1. **익명 함수 컴포넌트**:
```javascript
export default ({ a }) => {
    return <>{a}</>
} ```
- 익명 함수로 컴포넌트를 만들면 devtools에서 헷갈림이 생길 수 있다.
- 컴포넌트에 displayName을 지정해 명확하게 표시되도록 해야 한다.


2. **forwardRef**:
- forwardRef를 사용할 때 컴포넌트가 익명으로 표시되는 문제를 해결하기 위해 displayName을 설정한다.
ex) `InputText.displayName = 'InputText'`

3. **고차 컴포넌트(HOC)**:
- HOC 사용 시 컴포넌트 이름이 동적으로 바인딩되므로 displayName을 설정하는 것이 중요하다.
- HOC로 만들어지는 모든 컴포넌트에 displayName을 자동으로 설정하는 방법:
```javascript
    const WithRouter = (component) => {
        const WrappedComponent = (props) => <component {...props} />;
        WrappedComponent.displayName = component.displayName || component.name || 'WithRouterComponent';
        return WrappedComponent;
     };
```

## ESLint 규칙

- **ESLint**에서도 displayName 설정을 권장하는 규칙이 있다.
- 이 규칙을 통해 익명 함수나 동적으로 생성되는 컴포넌트에 displayName을 설정할 수 있다.

## 결론

- **React devtools**를 활용해 컴포넌트를 디버깅하는 것이 중요하다.
- displayName을 설정하면 컴포넌트의 식별이 용이해지고 디버깅이 편리해진다.
- **ESLint 규칙**을 준수하여 displayName을 설정하고, devtools에서의 컴포넌트 표시를 개선하자.
- HOC나 UI 컴포넌트를 만들 때도 displayName을 설정하여 디버깅을 용이하게 하자.


# 5. 컴포넌트 구성하기

### 1. 상수
* 변하지 않을 상수는 컴포넌트 외부로 빼자. 

### 2. Type 및 Interface
* 타이핑은 `interface`나 `type alias`로. 컴포넌트 명과 일치하는 props 타입명을 사용하는 것도 하나의 방법.
```javascript
interface SomeComponentporps {

}

const SomeComponent = ({prop1, prop2 }: SommeComponentProops) => {
    
}
```

### 3. 함수 표현식 vs 함수 선언문
* 타입을 어떻게 다루느냐에 따라 함수 표현식과 함수 선언문을 선택할 수 있음. 리액트 공식 문서에서도 함수 선언문을 사용하는 방향으로 바뀜

### 4. 컴포넌트 상태 및 Ref
* 상태나 Ref는 컴포넌트 상단에 놓자. 특히, Third Party 라이브러리에서 제공하는 hook들은 가장 위에 놓는 것이 좋음.

### 5. Custom Hooks
* 다음으로 Custom Hooks를 배치, 마지막으로 useState와 같은 컴포넌트 내부 상태 배치.

### 6. Props 처리
* props는 객체 구조 분해 할당 or 전체를 받아오는 방식 중 편한 방법을 선택.
```javascript
const SomeComponent = ( {prop1, prop2 }: SomeComponentProps) => { }
// 또는
const SomeComponent = (props: SomeComponentProps) => { 
    const {prop1, prop2, ... props } = props;
}
```
* 사용하지 않는 props를 버릴 때는 구조 분해 할당을 사용하는 것이 좋음.

### 7. 이벤트 함수
* 이벤트 함수는 컴포넌트 내부에서 사용할 것과 외부에서 사용할 것을 구분. 리액트와 관계없는 코드들(Date, Local Storage 등)은 외부로 빼내자.

### 8. Early Return
* 예상치 못한 경우에 대해 Early Return할 수 있음.

### 9. useEffect 위치
* useEffect는 최소한으로 사용하되, main JSX와 가까운 곳에 위치시키는 것이 좋음. 생명 주기를 다루는 useEffect는 하단에 배치.

### 10. JSX 구문
* JSX는 개행을 통해 렌더링 구문을 명확히 표시하는 것이 좋다.
-> render()함수를 더이상 쓰지 않게 되면서 헷갈리기 때문! 
 styled component 같은 경우는 컴포넌트와 가까운 하단에 배치하는 것이 깔끔!

## 결론
** 컴포넌트를 구성하는 데 정답은 없다!