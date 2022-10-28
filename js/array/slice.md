# Array.prototype.slice()

```javascript
const sports = ['soccer', 'baseball', 'basketball', 'swimming'];

console.log(sports.slice(1));
// ['baseball', 'basketball', 'swimming']

console.log(sports.slice(1, 3));
// ['baseball', 'basketball']

console.log(sports.slice(-1));
// ['swimming']

console.log(sports.slice(-3, -1));
// ['baseball', 'basketball']

console.log(sports.slice());
// ['soccer', 'baseball', 'basketball', 'swimming']
```

`slice()` 메서드는 메서드를 호출한 배열을 복사합니다. 이 메서드는 2개의 인자를 받습니다.

첫번째 인자에는 배열에서 복사할 요소의 시작점이 될 인덱스 값, 두번째 인자에는 복사에 포함되지 않는 요소의 인덱스 값을 전달할 수 있습니다.

2개의 인자 모두 필수가 아니기 때문에, 인자가 전달되지 않으면 모든 요소를 복사합니다.  
첫번째 인자만 전달되고, 두번째 인자가 전달되지 않았을 경우에는 첫번째 인자 값에 해당하는 요소부터 마지막 요소까지 모두 복사됩니다.

또한 배열을 복사하더라도 기존의 배열이 변경되지 않고, 새로운 배열을 리턴합니다.

<br />

이제 이러한 특징을 가지고 메서드를 구현해보겠습니다.

메서드가 전달 받는 2개의 인자는 모두 필수 인자가 아니므로, 인자를 전달받지 않았을 때를 대비한 기본값이 필요할 것입니다.

인자를 전달받지 않았을 때는 호출한 배열의 모든 요소를 복사하므로, 이를 for문과 같은 반복문을 이용한다면 시작 인덱스 값은 0, 마지막 인덱스는 배열의 길이를 전달해주면 될 것 같습니다.

그런데 만약 인자가 전달되었는데, 그 값이 음수인 경우에는 어떻게 해야 할까요?

음수가 전달되는 경우에는 호출한 배열의 앞이 아닌 뒤에서부터 요소를 검색합니다.
따라서, 인덱스 값을 정확히 구하려면 실제 호출한 배열의 길이와 음수 값을 더해야 합니다.

```javascript
Array.prototype.slice = function (start, end) {
  const startIndex = (start >= 0 ? start : this.length + start) || 0;
  const endIndex = (end >= 0 ? end : this.length + end) || this.length;
  const newArray = [];

  for (let i = startIndex; i < endIndex; i++) {
    if (i === this.length) break;
    newArray[newArray.length] = this[i];
  }

  return newArray;
};
```

두번째 인자 `end` 값이 메서드를 호출한 배열의 길이보다 크게 되면 배열에 존재하지 않는 값인 `undefined` 가 새로운 배열에 복사될 겁니다. 호출한 배열에 존재하는 요소만 복사되어야 하므로, 이때가 되면 break문을 실행하여 새로운 배열에 요소를 추가하는 작업을 종료합니다.

또 한가지 고려해야 하는 인자 값의 경우가 있습니다. 인자 값으로 숫자가 아닌 값이 들어올 경우입니다. 숫자가 와야 하는 것이 맞지만, 실제 `slice()` 메서드를 호출할 때, 인자에 숫자가 아닌 값들을 전달하여도 에러가 발생하지 않고 배열이 복사되는 것을 확인할 수 있습니다.

숫자가 아닌 값들로 테스트 해본 결과, 숫자형으로 형변환이 먼저 이뤄진 후 복사가 이뤄지는 것으로 추측됩니다.

자바스크립트에서는 비교 연산자를 적용하기 앞서, 먼저 피연산자에 대해 숫자형으로 형변환이 이뤄지기 때문에 이와 관련된 특별한 코드가 필요하지는 않습니다.  
`undefined` 의 경우, 숫자형으로 변환시 `NaN` 으로 변경되지만, 비교 연산자의 피연산자로 `NaN` 값이 올 경우에는 항상 false를 리턴합니다.

## 유사배열 객체에 대한 slice() 메서드 실행

`slice()` 메서드도 호출한 객체의 `length` 프로퍼티를 확인합니다.

`length` 프로퍼티 값이 존재한다면, 배열을 복사할 수 있는 것이죠.  
존재하지 않는다면, 어떤 요소도 복사되지 않고 빈 배열이 리턴돼야 합니다.

앞서 작성한 코드는 시작 인덱스와 마지막 인덱스의 값을 설정할 때, `length` 프로퍼티 값을 이용하기 때문에 값이 존재하지 않는 경우에는 빈 배열이 리턴되도록 조건문을 추가해주겠습니다.

```javascript
Array.prototype.slice = function (start, end) {
  if (!this.length) return []; // 추가

  const startIndex = (start >= 0 ? start : this.length + start) || 0;
  const endIndex = (end >= 0 ? end : this.length + end) || this.length;
  const newArray = [];

  for (let i = startIndex; i < endIndex; i++) {
    if (i === this.length) break;
    newArray[newArray.length] = this[i];
  }

  return newArray;
};
```

이제 객체의 `length` 프로퍼티의 존재하지 않으면, 호출한 배열의 어떤 요소도 복사되지 않습니다.
