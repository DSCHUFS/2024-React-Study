# 1. JSX에서의 공백 처리

'''javascript
export default function App() {
    return (
        <div>
        /*  X  */
        Welcome Clean Code&nbsp;
        <a gerf="clean-code-js">Go clean code</a>
        </div>
    );
}
'''
* prettier 때문에 공백이 생기지 않음.

'''javascript
export default function App() {
    return (
        <div>
        /*  O (보간법 사용) */
        Welcome Clean Code{"  "}
        <a gerf="clean-code-js">Go clean code</a>
        </div>
    );
}
'''

# 2. 0(Zero)는 JSX에서 유효한 값
'''javascript
/*  X  */
return <div>{items.length && items.map((item) : Element => <Item item={item} />)} </div>;
'''
* 0이 렌더링됨.

'''javascript
/*  O  */
return <div>{items.length > 0 && items.map((item) : Element => <Item item={item} />)} </div>;
/*  O  */
return <div>{items.length > 0 ? items.map((item) : Element => <Item item={item} />) : null} </div>;
'''
* 삼항연산자 이용. true/false의 구분.

# 3. 리스트 내부에서의 key
### 목록 하위의 아이템들을 렌더링 할 때는 고유의 키가 필요함.
### 왜? react는 가상 돔을 사용하기 때문에 수많은 아이템들이 렌더링하게 되면 구분하기가 힘들기 때문.
'''javascript
/*  X  */
<ul>
{list.map((item) : Element => (
    <li>{item}</li>
))}
</ul>

/*  X  */
<ul>
{list.map((item,index) : Element => (
    <li key = {index}>{item}</li>
))}
</ul>

/*  X  (prefix 식별자를 넣는 경우) */
<ul>
{list.map((item, index) : Element => (
    <li key = {'card-item-' + index}>{item}</li>
))}
</ul>

/*  X (렌더링 될때마다 고유의 값을 찍어내기 때문에 최악의 행동) */
<ul>
{list.map((item) : Element => (
    <li key = {new Date().toString()}>{item}</li>
))}
</ul>

/*  X  (더미 데이터를 렌더링할 때마다 찍어냄) */
<ul>
{list.map((item) : Element => (
    <li key = uuidv4()>{item}</li>
))}
</ul>
'''

### 리스트를 만들 때 꼭 ID를 부여하자
### 혹은 새로운 아이템을 추가하는 함수를 만들 때 고유한 값을 넣어주자 

'''javascript
function KeyInList({ list }) : Element {
    const handleAddItem = (value) : void => {
        setItems((prev)) : any[] => [
            ...prev,
            {
                id: crypto.randomUUID(),
                value : value,
            },
        ];
    };
};
'''

### 리액트에서 리스트 렌더링 시 유니크한 키를 미리 생성하여 제공하는 것이 중요함.
### 렌더링 시점에서 키를 생성하면 중복 문제와 확장 시 문제가 발생할 수 있으므로 피해야 함.
### 간단한 렌더링 작업이 아니라면, 리스트를 렌더링하기 전에 유니크 키를 생성하는 방법을 마련하는 것이 좋음.

# 4. 안전하게 Raw HTML 다루기

'''javascript
/*  X (XSS: 악성 스크립트 공격) */
return <div>{markup}</div>

/*  O (안전하진 X) */
return <div dangerouslySetInnerHtml = {markup} />;

### 서버에서 내려온 raw HTML 데이터를 그대로 렌더링하면 보안 문제(특히 XSS, Cross-Site Scripting 공격)가 발생할 수 있음.

### DOMPurify 라이브러리:
### DOMPurify는 HTML 데이터를 안전하게 소독(sanitize)해주는 라이브러리
### 서버에서 받은 데이터를 DOMPurify.sanitize() 메서드를 통해 처리하면 악성 스크립트를 제거할 수 있음.
'''javascript
import DOMPurify from 'dompurify';
const sanitizedContent = DOMPurify.sanitize(serverData);
'''
### ESLint 플러그인:
### ESLint를 사용하여 잠재적으로 위험한 코드 작성을 방지할 수 있음.
