# 1. 불필요한 Props 복사 및 연산

### 불필요한 props 복사 행위:

    /*O*/
    function CopyProps({ value }) : Element {
        return <div>{value}</div>;
    }

- 대부분은 props를 그대로 사용하는 것이 좋음.
  하위 컴포넌트에서 props를 조작해야 할 때가 가끔 있음.

### useState에 값 넣기 전에 복사:

    /*X*/
    function CopyProps({ value }) : Element {
        const [copyValue] = useState(값비싸고_무거운_연산(value))
        return <div>{value}</div>;
    }

- 값이 비싸거나 무거운 연산이면, useState에 넣기 전에 복사하여 사용.
- 그러나 이 방법도 합리적이지 않을 수 있음. 왜냐하면 값이 비싸면 상태로 만들 필요 없음.

### useState에 담지 않고 변수에 저장:

    /*O*/
    function CopyProps({ value }) : Element {
        const CopyValue = useMemo(() : any => 값비싸고_무거운_연산(value), [value]);
        return <div>{copyValue}</div>;
    }

- useState에 담지 않고 변수에 저장하면, 렌더링될 때마다 무거운 연산이 발생할 수 있음.

### 해결책:

- 값이 비싸고 무거운 연산이면, useMemo를 사용하여 최적화.
- 가능하면 컴포넌트에 props로 내려오기 전에 연산을 처리하도록 함.
- 대부분의 경우 props를 복사하는 것을 지양하고, 필요한 경우 useMemo를 활용.

**=> props 바로 사용하기**
**=> 연산된 값을 props로 넘기기**
**=> useMemo로 연산 최적화하기**

# 2. Curly Braces

### JSX에서 문자열:

- JSX에서는 문자열을 따옴표로 감싸서 사용하며, 중괄호는 필요하지 않음.
- 문자열을 중괄호로 감싸지 않고 사용하여 명시적으로 문자열임을 표현할 수 있음.

### 표현식(Expression)과 객체(Object):

- 중괄호는 값이 계산되거나 객체가 들어가는 경우에 사용됨.
- 표현식이나 객체를 JSX에서 사용할 때는 중괄호를 사용해야 함.

### 더블 중괄호(Double Braces):

- 일반적으로 객체를 나타냄. inline 스타일이나 styles 객체와 같은 용도로 사용됨.

### 결론:

- 문자열의 경우 중괄호를 사용하지 않고 따옴표로 감싸서 표현하는 것이 좋음.
- 표현식이나 객체 등의 경우 중괄호를 사용하여 값을 표현하는 것이 바람직함.

**=> string일 땐 curly braces 쓰지 않기**

# 3. Shorthand Props

### Spread Operator를 활용한 Shorthand Props:

- 상위 컴포넌트에서 하위 컴포넌트로 Props를 전달할 때, spread operator를 사용하여 props를 간단하게 전달할 수 있음.

### Boolean 값을 전달하는 경우:

- 특히 Boolean 값을 전달할 때 유용함.
  토글링되는 값이나 조건부 속성은 props를 생략하여 직접적으로 true로 전달할 수 있음.

### 객체 구조 분해 할당을 통한 Shorthand Props:

- 객체 구조 분해 할당을 활용하여 props를 간단하게 사용할 수 있음.
- Boolean 값을 가진 props의 경우, 값이 항상 true인 것이 보장되므로 value를 생략하여 true로 전달 가능.

### 결론:

- Shorthand Props는 코드를 간결하게 만들어주며, 특히 Boolean 값을 전달하는 경우 유용함.
- Shorthand Props를 사용할 때는 주의해야 할 부분이 있으나, 간편하고 명시적인 코드를 작성할 수 있음.

**=> shorthand porps로 porps를 축약할 수 있다**

# 4. Single Quotes vs Double Quotes

### 팀에서의 일관성과 규칙:

- 코드 작성 시 팀 내에서 일관된 규칙을 정하는 것이 중요함.
- 백엔드 코드와 프론트엔드 코드에서 Quotes 사용에 대한 차이점이 있을 수 있음.

### HTML과 자바스크립트에서의 Quotes 사용:

- HTML attribute의 값은 보통 Double Quotes를 사용하며, 이를 JSX에서도 따라가는 것이 일반적임.
- 자바스크립트 내의 문자열은 Single Quotes나 Double Quotes 모두 사용 가능하나, 일관성을 유지해야 함.

### 코드 포맷팅 도구의 활용:

- Prettier나 ESLint와 같은 포맷팅 도구를 활용하여 코드 스타일을 일관되게 유지할 수 있음.
- 코드 포맷팅 도구를 설정하여 Quotes에 대한 규칙을 정하고, 이를 자동으로 적용함으로써 일관성을 유지할 수 있음.

### 결론:

- Quotes 사용에 대한 논쟁은 의미 없는 것으로 여겨질 수 있지만, 팀 내 일관성을 유지하고 코드를 보다 명확하고 읽기 쉽게 작성하기 위해 규칙을 정하는 것이 중요함.
- 코드 작성에 집중하기 위해서는 포맷팅 도구를 활용하여 Quotes에 대한 규칙을 자동으로 적용하는 것이 좋음.

**=> HTML, JS를 구분해서 Single Quotes와 Double Quotes를 구분하자**
**=> 규칙은 팀끼리 정해서 자동 포맷팅 시키자**

# 5. 알아두면 좋은 Props 네이밍

### Props의 의미:

- Props는 properties의 줄임말로, 상위 컴포넌트에서 하위 컴포넌트로 데이터를 전달하는 데 사용됨.
- 함수에 매개변수로 넘겨지고, 인자들을 주고 받으면서 컴포넌트 간 통신에 활용될 수 있음.

### 잘못된 props 네이밍:

    class = "mt-0"   /*X*/
    className = "mt-0"   /*O*/

---

    Clean="code" /*X*/
    clean="code" /*O*/

- 리액트에서 컴포넌트는 Pascal Case로 시작하므로 잘못된 예시와 같이 사용하면 컴포넌트인 것으로 오인받을 수 있음.

---

    clean_code="react"  /*X*/
    clean-code="react"  /*X*/
    CLEAN_CODE="react"  /*X*/
    cleanCode = "react"  /*O*/

- snake_case나 kebab-case보다는 camelCase를 사용하는 것이 바람직함.

---

    otherComponent={OtherComponent}  /*X*/
    OtherComponent={OtherComponent}  /*O*/

- Component가 내려오는 것을 직관적으로 알 수 있게 함.

---

    isShow={true}  /*X*/
    isShow  /*O*/

- 무조건 true인 경우

**=> class는 className으로 사용하기**
**=> camel case 사용하기**
**=> 무조건 true라면 isShow={true}가 아닌 isShow로 축약하기**
**=> 컴포넌트라면 대문자로 시작하기**

# 6. 인라인 스타일 주의하기

### JSX에서의 인라인 CSS:

- JSX에서는 CSS를 인라인으로 적용할 때 중괄호를 사용하여 객체를 넣어야 함.
- 이 객체는 CSS 속성과 값의 키-값 쌍으로 구성되며, camelCase 형식을 사용해야 함.

### 특징과 주의사항:

- 인라인 CSS를 넣으면 렌더링될 때마다 계속해서 평가되므로, 성능상 좋지 않음.
- 컴포넌트 밖으로 CSS를 분리하는 것이 좋음.

### 활용 예시:

- 인라인 CSS를 활용하여 버튼 스타일링을 보다 유연하게 적용할 수 있음.
- CSS 속성과 값에 맞는 명칭을 사용하여 가독성을 높임.

### 결론:

- JSX에서 CSS를 다룰 때는 웹 표준을 준수하고, 중괄호를 이용하여 객체 형태로 인라인 CSS를 적용하는 것이 바람직함.
- 인라인 CSS를 사용할 때는 컴포넌트 밖으로 분리하여 성능을 개선하는 것이 좋음.

**=> JSX에서 인라인 스타일을 쓰려면 중괄호 안에 camelCase key를 가진 객체를 넣어야 한다**
