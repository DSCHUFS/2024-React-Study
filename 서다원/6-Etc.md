### 목차

1. [import react](#import-react)
2. [디렉터리 구조](#디렉터리-구조)
3. [SPA에서의 새로고침](#spa에서의-새로고침)
4. [Primitive UI](#primitive-ui)

### import react

```tsx
import React from "react"; // 필수가 아님!
```

`import react` 를 하는 것은 과거에는 필수였으나 리액트 17 버전이 되면서 필수가 아니게 되었다. 이전에는 JSX가 내부적으로 `react.createElement`를 호출하기 때문에 import react 를 해야했었다.

하지만 JSX를 위한 별도의 런타임 구문이 도입되었기 때문에, 이제는 자동으로 컴파일 과정에서 처리가 된다.

### 디렉터리 구조

react 프로젝트에서는 redux, test, native, typescript 등 상황에 따라서 디렉터리 구조가 다양하게 달라질 수 있다. 디렉터리 구조에는 정답이 없으며, 상황에 맞게 설정하는 것이 중요하다.

```tsx
// 예시
components/
|- SearchButtonClear.vue
|- SearchButtonRun.vue
|- SearchInputQuery.vue
|- SearchInputExcludeGlob.vue
|- SettingsCheckboxTerms.vue
```

- 디렉터리 구조는 의존성을 보여주며, 이걸 고려해서 구조를 잡아야한다. 만약 결합도가 높은 컴포넌트라면 같은 디렉터리나 같은 **prefix** 로 묶는 것이 좋다.
- 그리고 컴포넌트를 만들 때 많은 폴더 depth를 만드는 경우가 있는데, 지양하는 것이 좋다. depth가 늘어난다고 안정적인 것도 아니기 때문에. (one depth 만으로!)
- shared에 공통 컴포넌트를 모아두는 것도 좋은 방법이다

결론: 디렉터리 구조를 설정할 때 너무 고민하지 말고, 점진적으로 확장해 나가는 접근이 중요하다

### SPA에서의 새로고침

많은 개발자들이 로그인 로직을 구현할 때 `window.location.reload` 메서드를 사용하는데, SPA에서 이 메서드는 완전히 애플리케이션을 재기동 시키는 문제를 야기한다. ⇒ 완전히 종료하고 다시 실행시키는 것과 동일한 행위다.

따라서 상태를 유지하기위해서 로컬 스토리지 같은 브라우저의 애플리케이션 단을 활용하기도한다. 이러면 사용자가 새로고침을 해도 상태가 유지되는 것처럼 보일 수 있다.

결론: SPA에서 window.location.reload 를 사용하면 성능 저하, 상태 손실, 불필요한 서버 요청 등의 문제가 발생할 수 있다.

### Primitive UI

- react 에서 div 와 span 같은 요소로 대부분의 UI를 만들 수 있지만, 그럼에도 불구하고 문서 구조를 고려한 시맨틱 태그(header, main, footer 등)을 사용하는 것이 좋다.
- react 를 사용하면서 컴포넌트의 이름을 자유롭게 설정할 수 있지만 className 처럼 비표준 문법을 강제하는 문제도 있고, 이는 웹 표준을 해치는 경우가 많다.
- 컴포넌트 네이밍을 할 때에 TodoInput, TodoList 보다는 List, Item 같은 이름을 쓰는 것이 더 확장성있다. 그리고 도메인 네임을 피하고 생김새를 묘사하는 것이 좋다. Box, Hamburger 등.. UI의 기능을 묘사하는 것도 좋다.
- 리액트 컴포넌트를 만들 때 HTML 시맨틱 태그와 typescript 를 조합하는 방법도 있다. 예를 들어 Button 컴포넌트를 만들 때 ButtonHTMLAttributes 를 확장해서 HTML 버튼 요소의 기본 속성을 모두 가져올 수 있다.

결론: 시맨틱 HTML, Primitive UI를 준수하자. 특히 react에서는 지키기 더 어렵다.
