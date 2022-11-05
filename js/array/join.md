# Array.prototype.join()

## 기본 동작

```javascript
const elements = ['Fire', 'Air', 'Water'];

console.log(elements.join());
// 'Fire,Air,Water'

console.log(elements.join('-'));
// 'Fire-Air-Water'

console.log(elements.join(''));
// 'FireAirWater'
```

`join()` 메서드는 배열 요소에 있는 값들을 하나의 문자열로 합친 새로운 문자열을 리턴합니다.

매개변수 값에 특정 문자열이 전달되면, 각각의 요소와 해당 문자열을 합치지만, 전달된 값이 없다면 `,` 과 함께 각각의 요소들이 합쳐집니다.

빈 문자열을 전달하게 되면, `,` 가 추가되지 않고 각 요소들끼리만 합쳐집니다.

배열이 생성될 때, 내장 객체 생성자 함수인 Array가 호출되므로, Array 생성자 함수의 prototype 프로퍼티가 참조하는 프로토타입 객체에 `join()` 메서드가 구현되어 있습니다.

## 구현

위에 나타난 특징들을 가지고, for문과 if문을 이용하여 `join()` 메서드를 구현해보겠습니다.

```javascript
Array.prototype.join = function (seperator = ',') {
  let str = '';
  for (let i = 0; i < this.length; i++) {
    if (i + 1 == this.length) {
      str += this[i];
    } else {
      str += this[i] + '' + seperator;
    }
  }
  return str;
};
```

`this` 는 항상 함수가 호출될 때 그 값이 결정되므로, 여기서는 `join()` 메서드를 호출한 객체인 배열이 될 것입니다.

함수의 인자로 전달되는 값에는 문자열이 아닐 수도 있습니다.

예를 들어, `[1, 2].join(3)` 과 같은 코드가 실행될 때, `seperator` 를 덧셈 연산자와 사용하게 되면, 숫자 간에 연산이 발생하게 되므로 이는 `join()` 메서드처럼 동작하지 않게 되죠.  
따라서, 연산이 발생하지 않도록 빈 문자열을 중간에 넣어줍니다.

### undefined, null 처리하기

하지만 제가 작성한 코드는 `join()` 메서드와 동일하게 동작하지 않습니다.

배열 요소에 `undefined`, `null` 이 존재한다면 이 값들은 문자열 undefined, null로 전환되지 않고, 빈 문자열로 전환되기 때문입니다.

```javascript
const arr = [1, undefined, null];

console.log(arr.join());
// '1,,'

console.log(arr.join('-'));
// '1--'

console.log(arr.join(''));
// '1'
```

위의 코드처럼 동작할 수 있도록 코드를 변경해보겠습니다.

```javascript
Array.prototype.join = function (seperator = ',') {
  let str = '';
  for (let i = 0; i < this.length; i++) {
    if (this[i] === null || this[i] === undefined) this[i] = ''; // 추가한 코드
    if (i + 1 == this.length) {
      str += this[i];
    } else {
      str += this[i] + '' + seperator;
    }
  }
  return str;
};
```

위의 코드는 제가 동작 방식을 인지하고 간단하게 구현해본 코드일 뿐, 실제 `join()` 메서드의 구현체와 동일하지 않습니다.
