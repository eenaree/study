# Array.prototype.pop()

## Syntax

```javascript
pop();
```

## 기본 동작

```javascript
const fruits = ['apple', 'banana', 'watermelon', 'orange'];

const popped = fruits.pop();

console.log(popped);
// 'orange'

console.log(fruits);
// ['apple', 'banana', 'watermelon']
```

`pop()` 메서드는 메서드를 호출한 배열의 마지막 요소를 제거하고, 그 요소를 리턴합니다.

또한, 기존 배열을 변경합니다.

## 구현

### Array.prototype.length

배열에는 `length` 프로퍼티가 존재합니다. 배열 메서드를 이용하지 않고, for문과 같은 반복문을 이용할 때, 이 프로퍼티를 많이 사용합니다.

Array 생성자 함수의 프토토타입에 정의되어 있는 프로퍼티이기 때문에 가능한 일이죠.

이 `length` 프로퍼티는 배열의 길이를 알아낼 목적으로 많이 사용되지만, 쓰기가 가능한 프로퍼티입니다. 때문에 `length` 프로퍼티에 값을 할당할 경우, 배열에 변화가 발생하기 때문에 주의해서 사용해야 합니다.

어떤 변화가 발생하는지, 코드를 통해 확인해보도록 하겠습니다.

```javascript
const arr = [1, 2, 3, 4, 5];

arr.length = 2;
console.log(arr); // [1, 2]
console.log(arr[3]); // undefined

arr.length = 5;
console.log(arr); // [1, 2, <3 empty items>]
console.log(arr[3]); // undefined, 실제로는 비어있음
```

배열의 길이보다 작은 값을 할당하게 되면 그 값을 넘어서는 요소들이 삭제되고, 배열의 길이보다 큰 값을 할당하게 되면, 빈 슬롯이 추가되는 것을 확인할 수 있습니다.

```javascript
const arr = [1, 2, 3];

arr[3] = 4;
console.log(arr); // [1, 2, 3, 4]

arr.push(5);
console.log(arr); // [1, 2, 3, 4, 5]
```

위와 같이 배열에 변화를 줄 수 있는 것도, 이 `length` 프로퍼티의 속성이 쓰기 가능하게 설정되었기 때문에 가능한 일입니다.

이러한 배열의 변화를 이용하면, `pop()` 메서드 또한 쉽게 구현할 수 있습니다.

`pop()` 메서드는 배열의 마지막 요소 1개만을 배열에서 제거합니다. 앞서, `length` 프로퍼티 값을 실제 배열의 길이보다 작은 값으로 할당하게 되면, 그 값을 넘어서는 배열의 요소가 삭제되었죠? 이것을 활용하면 됩니다.

```javascript
Array.prototype.pop = function() {
  const lastElement = this[this.length - 1];
  this.length = this.length - 1;

  return lastElement;
};
```

### 빈 배열 처리하기

빈 배열에 대해 메서드를 실행하는 경우에는, 요소 자체가 없으므로 제거할 요소도 없습니다.

위의 코드를 빈 배열에 대해 호출할 경우, `length` 프로퍼티가 0이기 때문에, 음수 인덱스 값으로 마지막 요소를 찾는 버그가 발생합니다.

따라서, 빈 배열일 경우 `undefined` 를 리턴해주도록 하겠습니다.

```javascript
Array.prototype.pop = function() {
  if (this.length === 0) return undefined; // 추가

  const lastElement = this[this.length - 1];
  this.length = this.length - 1;

  return lastElement;
};
```
