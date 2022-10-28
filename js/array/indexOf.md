# Array.prototype.indexOf()

```javascript
const sports = ['soccer', 'baseball', 'basketball', 'swimming'];

console.log(sports.indexOf('baseball'));
// 1

console.log(sports.indexOf('baseball', 2));
// -1

console.log(sports.indexOf('golf'));
// -1
```

`indexOf()` 메서드는 첫번째 인자에 전달된 값을 메서드를 호출한 배열에서 검색하여 찾은 첫번째 값의 인덱스를 리턴합니다.

전달된 값과 동일한 요소를 찾았다면 해당 요소의 인덱스를 리턴하며, 그렇지 않으면 -1을 리턴합니다.

두번째 인자가 전달되면, 해당 인덱스에 해당하는 위치에서부터 전달된 요소를 검색합니다.

위의 특징을 기반으로 하여 메서드를 구현해보도록 하겠습니다.

우선, 요소를 검색할 위치에 대해 고려하지 않고 코드를 작성해보겠습니다.

```javascript
Array.prototype.indexOf = function (value) {
  for (let i = 0; i < this.length; i++) {
    if (this[i] === value) return i;
  }

  return -1;
};
```

동등 연산자 `==` 는 피연산자 간에 자료형이 다를 경우, 숫자형으로 형변환이 발생합니다.

예를 들어, `[1, 2, 3].indexOf('1')` 과 같은 코드가 실행될 때, 동등 연산자를 사용하게 되면 검색할 값인 `'1'` 은 숫자형으로 변환되어 `1` 이 되므로, -1을 아니라 0을 리턴하게 될 겁니다. 버그가 발생하게 되죠.

따라서, 일치 연산자 `===` 을 사용하여 형변환을 하지 않도록 해주었습니다.

동일한 요소를 찾는 순간, 이 메서드는 할 일을 끝냈으므로 요소를 검색하는 작업을 종료함과 동시에 바로 값을 리턴해주도록 했습니다.

<br />

이제 요소를 검색할 위치도 고려하여 코드를 수정해보겠습니다.

선택 인자이므로 제공되지 않으면 호출한 배열의 맨 앞에서부터 요소를 검색하므로 기본값은 0이 될 겁니다.

이 값에는 0을 포함하여 양수 뿐만 아니라 음수도 전달될 수 있습니다. 음수가 전달되는 경우에는, 요소를 배열의 뒤에서부터 검색하므로 배열의 길이와 음수 값을 더한 값을 가지고 정확한 인덱스 값을 구할 수 있습니다.

그리고 실제 `indexOf()` 메서드를 호출해보면, 두번째 인자 값에 숫자가 아닌 값을 전달하더라도 에러가 발생하지 않습니다. 아마 숫자형으로의 형변환이 발생하는 것 같습니다.

```javascript
Array.prototype.indexOf = function (value, from) {
  let fromIndex = (from >= 0 ? from : this.length + from) || 0; // 추가
  for (let i = fromIndex; i < this.length; i++) {
    if (this[i] === value) return i;
  }

  return -1;
};
```

비교 연산자 `>=` 는 숫자형으로의 형변환을 발생시키기 때문에, 숫자가 아닌 값이 전달될 경우에는 결국 0으로 초기화됩니다.

## 비어있는 요소 처리하기

`indexOf()` 메서드는 배열에 비어있는 요소에 대해서는 검색을 하지 않습니다.

```javascript
console.log([1, , 3].indexOf(undefined)); // -1
```

위의 코드를 보시면, 분명 배열의 2번째 요소는 비어 있습니다. 이 값을 배열 인덱싱을 통해 조회하면 `undefined` 로 출력되지만, 검색할 요소로 `undefined` 를 전달하는 경우에는 -1을 리턴합니다.

반대로 `undefined` 를 직접 배열의 요소로서 할당한 경우에는 어떻게 될까요?

```javascript
console.log([1, undefined, 3].indexOf(undefined)); // 1
```

이 경우에는 정확한 인덱스가 리턴됩니다.

직접 `undefined` 값이 할당되지 않고 요소가 비어있다면 배열을 순회할 때, 요소 자체를 건너뜁니다.
하지만 빈 요소에 대해 모든 배열 메서드가 이를 스킵하는 것은 아닙니다. 이에 대해서는 아래 링크를 참고하세요.

> 참고: [Array methods and empty slots](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array#array_methods_and_empty_slots)

제가 작성한 코드는 위에 있는 2개의 실행 코드에 대해 모두 1을 리턴하므로, 정말로 비어있는 요소인 경우에는 -1을 리턴할 수 있도록 해줘야 합니다.

그런데, `undefined` 와 비어있는 요소를 어떻게 구분할 수 있을까요?

배열도 객체에 해당하기 때문에, 객체와 생김새는 달라도 `length` 프로퍼티 외에 0과 양의 정수를 프로퍼티 키로 갖고 있습니다. 반복문을 돌릴 때, 배열의 길이를 이용할 수 있는 것도 바로 이 때문이죠.

```javascript
const arr = ['one', 'two', 'three'];

// 위의 배열을 다르게 표현하면, 아래와 같이 표현할 수 있습니다.
// 유사배열 객체와 많이 흡사하죠? 하지만 배열입니다.
arr = {
  0: 'one',
  1: 'two',
  2: 'three',
  length: 3,
};
```

`in` 연산자를 이용하면, 비어있는 요소에 대한 프로퍼티 키가 존재하지 않으면 `false` 를 리턴하는 반면, `undefined` 로 할당된 요소는 키가 존재하여 `true` 를 리턴합니다. 따라서, 요소가 정말로 비어있는지 아닌지를 구분할 수 있습니다.

```javascript
Array.prototype.indexOf = function (value, from) {
  let fromIndex = (from >= 0 ? from : this.length + from) || 0;
  for (let i = fromIndex; i < this.length; i++) {
    if (i in this === false) continue; // 추가
    if (this[i] === value) return i;
  }

  return -1;
};
```

이제 비어있는 요소와 `undefined` 를 구분할 줄 아는 `indexOf()` 메서드를 완성했습니다.

## 유사배열 객체에 대한 indexOf() 메서드 실행

`indexOf()` 메서드도 배열 뿐만 아니라 유사배열 객체에도 실행이 가능해야 합니다.

단, `length` 프로퍼티가 존재해야만 이후 각각의 인덱스에 접근하기 때문에, `length` 프로퍼티 값이 존재하지 않는 객체를 대상으로 메서드를 호출할 경우, -1을 리턴합니다.

그래서, 위의 코드에서 변경할 부분은 따로 없습니다.
