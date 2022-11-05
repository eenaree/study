# Array.prototype.push()

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

### 유사배열 객체에 대한 push() 메서드 실행

mdn 문서에 따르면, `push()` 메서드는 `this` 즉, 메서드를 호출한 객체의 `length` 프로퍼티를 읽고 `length` 프로퍼티에 해당하는 인덱스부터 전달받은 인자 값을 추가합니다.

아래는 이와 관련된 예제 코드입니다.

```javascript
const arrayLike = {
  length: 3,
  unrelated: 'foo',
  2: 4,
};
Array.prototype.push.call(arrayLike, 1, 2);
console.log(arrayLike);
// { '2': 4, '3': 1, '4': 2, length: 5, unrelated: 'foo' }

const plainObj = {};
// There's no length property, so the length is 0
Array.prototype.push.call(plainObj, 1, 2);
console.log(plainObj);
// { '0': 1, '1': 2, length: 2 }
```

`length` 프로퍼티에 해당하는 인덱스에 해당하는 키 값부터 시작해서 순서대로 값을 부여하는 걸 볼 수 있습니다.

결과적으로 메서드가 배열 뿐만 아니라 유사배열 객체에 대해서도 실행이 가능해야 하며, 유사배열 객체의 `length` 프로퍼티 값에 해당하는 키 값이 이미 정해져 있다고 하더라도 이를 덮어쓸 수도 있는 상황이 생길 것 같습니다.

제가 만든 코드는 위의 코드 결과와 동일한 결과를 보장하지 않으므로, 코드를 다시 수정해보겠습니다.

배열과 유사배열 객체가 참조하는 프로토타입 객체가 서로 다르므로, 이를 분기처리하여 각각의 로직을 작성해주면 유사배열 객체에 대해서도 적용할 수 있는 메서드를 생성할 수 있을 것 같습니다.

`push()` 메서드 실행시, `length` 프로퍼티를 먼저 읽으므로 유사배열의 경우에, 이 값이 undefined, null과 같이 존재하지 않는 값일 경우가 있을 수 있습니다. 그 경우에는 0으로 초기화시켜 주도록 합니다.

유사배열은 배열과 달리, 배열에 값을 추가할 때 `length` 프로퍼티의 값이 자동으로 증가되지 않으므로, 값을 추가할 때마다 이 값도 같이 증가시켜줘야 합니다.

```javascript
Array.prototype.push = function () {
  if (Object.getPrototypeOf(this) === Object.prototype) {
    for (let i = 0; i < arguments.length; i++) {
      if (!this.length) this.length = 0;
      this[this.length] = arguments[i];
      this.length++;
    }
  } else if (Object.getPrototypeOf(this) === Array.prototype) {
    for (let i = 0; i < arguments.length; i++) {
      this[this.length] = arguments[i];
    }
  }
  return this.length;
};
```

코드를 완성했는데, 다소 중복된 부분이 보입니다. 중복된 코드를 제거해보도록 하겠습니다.

```javascript
Array.prototype.push = function () {
  for (let i = 0; i < arguments.length; i++) {
    if (!this.length) this.length = 0;
    this[this.length] = arguments[i];
    if (Object.getPrototypeOf(this) === Object.prototype) this.length++;
  }

  return this.length;
};
```

이제 객체에서도 사용할 수 있는 간단한 `push()` 메서드를 완성했습니다.

코드를 작성하면서 느꼈지만, 유사배열 객체에 `push()` 메서드를 호출하는 것은 그렇게 좋은 방법이 아니라고 생각됩니다.

정의된 `length` 프로퍼티 값을 이용해 그 값에 해당하는 인덱스부터 값을 추가하기 때문에, 객체에 정의된 키의 개수와 length 프로퍼티 값이 일치하지 않는 문제가 발생할 수도 있기 때문입니다.
