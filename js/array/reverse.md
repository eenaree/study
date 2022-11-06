# Array.prototype.reverse()

## Syntax

```javascript
reverse();
```

## 기본 동작

```javascript
const arr = ['one', 'two', 'three'];

const reversed = arr.reverse();
console.log(reversed);
// ['three', 'two', 'one']

console.log(arr);
// ['one', 'two', 'three']
```

`reverse()` 메서드는 메서드를 호출한 배열을 뒤집어, 배열의 순서를 거꾸로 변경합니다.

이 메서드를 실행하면, 메서드를 호출한 기존 배열이 변경되며, 호출한 배열에 대한 참조값을 리턴합니다.

## 구현

이제 이 메서드를 직접 구현해보겠습니다.

먼저, 배열을 거꾸로 뒤집는 것부터 만들어보겠습니다. 여기서 한가지 주의해야 하는 것이 있는데, `reverse()` 메서드는 배열에 값이 할당되어 있지 않은 비어있는 요소가 있다면 비어있는 요소 그대로 가져와 순서만 바꿔줘야 합니다.

이를 고려하지 않고 코드를 작성하게 되면, 비어있는 요소에 대해 `undefined` 를 할당하게 됩니다.

```javascript
Array.prototype.reverse = function () {
  const reversed = [];
  for (let i = this.length; i > 0; i--) {
    if (i - 1 in this === false) continue;
    reversed[this.length - i] = this[i - 1];
  }

  return reversed;
};
```

하지만, `reverse()` 메서드는 새로운 배열을 리턴하는 것이 아니라, 메서드를 호출한 기존 배열을 변경해야 합니다.

따라서, 거꾸로 된 새로운 배열 요소들을 호출한 배열의 요소로서 재할당해주도록 하겠습니다.

```javascript
Array.prototype.reverse = function () {
  const reversed = [];
  for (let i = this.length; i > 0; i--) {
    if (i - 1 in this === false) continue;
    reversed[this.length - i] = this[i - 1];
  }

  // 추가
  for (let j = 0; j < reversed.length; j++) {
    this[j] = reversed[j];
  }

  return this;
};
```

하지만 위의 방식은 `reverse()` 메서드와 동일하게 동작하지 않습니다. 어떤 문제가 존재할까요?

바로, 비어있는 요소에 대해 `undefined` 를 할당합니다. 조금 더 구체적으로 표현해보면, 비어있는 요소를 비어있는 요소로서 할당하지 않고 `undefined` 가 할당되는 겁니다. 앞서 언급했던 문제와 동일한 문제가 발생했습니다.

예를 들어보면 이런 상황인 것이죠. 제가 만든 위의 메서드 코드를 가지고 실행을 해보면, 다음과 같은 결과가 발생합니다.

```javascript
const arr = [1, , 3, 4];

arr.reverse();

console.log(arr);

// 기대한 결과: [4, 3, <1 empty item>, 1]
// 실제 결과: [4, 3, undefined, 1]
```

처음에 reverse 된 배열을 만들 때, `in` 연산자를 이용하여 비어있는 요소를 건너뛰고 할당하는 것은 가능했지만, 기존 배열에 재할당할 때는 이 방법이 적용되지 않습니다.

기존 배열에서 요소가 할당되어 있을 때, 이를 건너뛰게 되면 그 값이 그대로 남아있기 때문에 그렇습니다.

코드를 통해, 한번 확인을 해볼까요?

```javascript
Array.prototype.reverse = function () {
  const reversed = [];
  for (let i = this.length; i > 0; i--) {
    if (i - 1 in this === false) continue;
    reversed[this.length - i] = this[i - 1];
  }

  for (let j = 0; j < reversed.length; j++) {
    if (j in reversed === false) continue; // 추가
    this[j] = reversed[j];
  }

  return this;
};

const arr = [1, , 3, 4];

arr.reverse();

console.log(arr);
// 기대한 결과: [4, 3, <1 empty item>, 1]
// 실제 결과: [4, 3, 3, 1]
```

비어있는 요소에 대해 할당을 건너뛰게 되어 버리니, 기존 배열에 있던 요소인 `3` 이 그대로 나타나게 되는 것 보이시죠?

만약, reverse 된 배열 요소를 재할당하기 전에, 기존 배열의 키를 모두 제거한다면 어떻게 될까요?

배열도 객체이기 때문에, 키를 가지고 있으며, 키를 제거할 수 있습니다.  
객체에서 키를 제거하면, 그 키에 할당된 값도 당연히 비어있게 될 겁니다.

```javascript
const arr = [1, 2, 3];

delete arr[0];

console.log(arr); // [<1 empty item>, 2, 3]
console.log(arr[0]); // undefined, 실제로는 비어있음
```

키 값이 비어있으므로, 비어있는 요소에 대한 할당을 건너뛰게 되면, 요소가 비어있는 채로 남아있게 됩니다. 즉, reversed 된 배열과 똑같은 배열을 만들 수 있게 됩니다.

이제 이것을 코드에 적용해보면, 아래와 같이 작성할 수 있습니다.

```javascript
Array.prototype.reverse = function () {
  const reversed = [];
  for (let i = this.length; i > 0; i--) {
    if (i - 1 in this === false) continue;
    reversed[this.length - i] = this[i - 1];
  }

  for (let j = 0; j < reversed.length; j++) {
    delete this[j]; // 추가
    if (j in reversed === false) continue;
    this[j] = reversed[j];
  }

  return this;
};
```
