# Array.prototype.push()

## Syntax

```javascript
push(element0);
push(element0, element1);
push(element0, element1, /* … ,*/ elementN);
```

## 기본 동작

`push()` 메서드는 인자로 받은 값을 메서드를 호출한 배열의 끝에 추가합니다.

인자로 받는 값의 개수에는 제한이 없으며, 메서드를 호출한 배열의 새로운 길이를 리턴합니다.
`push()` 메서드를 호출한 배열에도 값이 추가되기 때문에, 기존의 배열을 변경합니다.

```javascript
const sports = ['soccer', 'baseball'];

const total = sports.push('football');

console.log(total);
// 3

console.log(sports);
// ['soccer', 'baseball', 'football'];

sports.push('swimming', 'basketball');
console.log(sports);
// ['soccer', 'baseball', 'football', 'swimming', 'basketball'];
```

## 구현

위의 특징들을 가지고, `push()` 메서드를 간단하게 구현해보겠습니다.

기본적으로 push 메서드에 들어온 인자 값은 배열의 끝에 추가됩니다.

하지만 들어오는 인자의 개수에 제한이 없습니다. 인자가 1개라면 1개를 배열의 마지막 위치에 추가하면 되지만, 2개 이상이라면 어떻게 해야 할까요?

이 문제를 해결하려면, 각각의 인자에 접근할 수 있어야 합니다. `arguments` 라는 유사배열 객체를 이용하면, 함수에 전달된 인자에 접근할 수 있습니다.

이 객체는 배열은 아니지만, 배열처럼 인덱싱을 할 수 있고, `length` 프로퍼티가 존재하여 해당 배열의 길이도 알 수 있는 유사배열입니다. 즉, 함수에 전달된 인자 값들이 배열과 비슷한 형태로 담겨있다고 볼 수 있습니다.

이제 위에 설명한 것들을 코드로 표현해보면, 아래와 같이 작성할 수 있습니다.  
for문을 이용하니 생각보다 간단하게 구현할 수 있습니다.

```javascript
Array.prototype.push = function () {
  for (let i = 0; i < arguments.length; i++) {
    this[this.length] = arguments[i];
  }

  return this.length;
};
```
