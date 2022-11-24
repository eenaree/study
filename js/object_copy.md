# 객체의 얕은 복사와 깊은 복사

객체에는 참조 값이 저장되기 때문에, 같은 객체를 참조하고 있는 다른 변수에서 이를 변경하게 될 경우, 같은 객체를 참조하고 있던 또 다른 변수들에게도 영향을 미칩니다.

```javascript
const original = [1, 2, 3];
const copy = original;

console.log(copy); // [1, 2, 3]

copy[0] = 10;

console.log(original); // [10, 2, 3]
console.log(copy); // [10, 2, 3]
```

## 얕은 복사

얕은 복사는 원본 객체의 최상위 객체만을 복사합니다.

예를 들어, 원본 배열과 이를 얕은 복사한 배열이 있다고 가정할 때,

```javascript
const original = [1, { list: [1, 2, 3] }];

const copy = original.slice();
```

최상위 객체에 대해 얕은 복사가 발생했기 때문에, `original` 에 할당된 객체에 대한 참조 값이 `copy` 에는 연결되어 있지 않습니다.

`copy` 가 참조하고 있는 배열은 `original` 과는 다른 배열인 것이죠.

따라서, `copy` 에 할당된 배열 요소를 변경하더라도, 원본 객체인 `original` 의 값에 변화가 발생하지 않습니다.

```javascript
copy[0] = 10;
copy[1] = { list: [4, 5] };

console.log(copy); // [10, { list: [4, 5] }]
console.log(original); // [1, { list: [1, 2, 3] }]
```

그러나, 최상위 객체에 대해서만 복사가 발생했기 때문에, 중첩된 하위 객체는 여전히 참조 관계가 유지되어 있습니다.

따라서, 하위 객체의 프로퍼티 값을 변경하면, 이는 원본 객체에 영향을 줍니다.

```javascript
copy[1].list = [4, 5];

console.log(copy); // [1, { list: [4, 5] }]
console.log(original); // [1, { list: [4, 5] }]
```

## 얕은 복사 직접 구현해보기

먼저, 배열이 아닌 일반 객체에 대해서만 얕은 복사가 이뤄지도록 해보겠습니다.

```javascript
function shallowCopy(obj) {
  const newObj = {};

  for (const key in obj) {
    if (Object.hasOwn(obj, key)) {
      newObj[key] = obj[key];
    }
  }

  return newObj;
}
```

객체를 순회할 때는 `for in` 문을 사용합니다.

그런데, `for in` 문은 해당 객체에 정의된 키 말고도 프로토타입에 정의된 키도 포함하여 순회하기 때문에 이를 제외해주는 작업이 필요합니다.

객체 생성자 함수의 프로토타입에 정의된 `hasOwnProperty` 메서드를 이용하면 이를 제외할 수 있습니다.

최근에 static 메서드로 추가된 `hasOwn` 메서드는 프로토타입에 정의된 `hasOwnProperty` 메서드보다 더 직관적입니다.

복사하려는 객체 obj에 바로 `hasOwnProperty` 메서드를 사용해도 되지만, 이 메서드를 해당 객체가 덮어썼을 가능성을 고려하여 안전하게 생성자 함수의 static 메서드를 호출했습니다. 또한, `hasOwn` 메서드는 `Object.create(null)` 로 만들어진 프로토타입이 없는 객체에도 사용할 수 있습니다.

이후, 얕은 복사를 실행하는 함수 안에서 새 객체를 정의하고 복사하려는 키와 값을 새 객체에 할당해준 후, 이 객체를 리턴해주면 됩니다.

### 배열 객체에 대해 얕은 복사 적용하기

하지만 위의 함수에서 얕은 복사는 일반 객체에 대해서만 적용 가능합니다.

일반 객체가 아닌 배열 객체에도 적용될 수 있도록 하려면, 어떻게 해야 할까요?

리턴할 새 객체를 초기화하기 전에, 이 객체가 배열인지 일반 객체인지 확인하면 됩니다.

```javascript
function shallowCopy(obj) {
  const newObj =
    Object.prototype.toString.call(obj) === '[object Array]' ? [] : {};
  // ...생략
  return newObj;
}
```

배열 생성자 함수에 내장된 static 메서드인 `Array.isArray` 을 이용해 배열임을 확인하거나, 객체 생성자 함수의 프로토타입 메서드인 `toString` 메서드를 사용할 수 있습니다.

배열 생성자 함수에도 `toString` 메서드가 내장되어 있지만, 배열 생성자 함수의 프로토타입인 객체 생성자 함수에 내장된 `toString` 메서드를 이용하면 배열 객체와 일반 객체에 대해 각각 `[object Array]`, `[object Object]` 를 리턴하기 때문에 전달된 객체가 배열인지 일반 객체인지 구분할 수 있습니다.

```javascript
console.log(Object.prototype.toString.call([])); // [object Array]
console.log(Object.prototype.toString.call({})); // [object Object]
```

## 깊은 복사

깊은 복사는 얕은 복사와 달리, 복사하려는 원본 객체의 중첩된 하위 객체까지도 복사하는 것을 말합니다.

즉, 앞서 보여드린 얕은 복사의 예시에서 하위 객체인 `list` 프로퍼티의 값을 변경하더라도 원본 객체에는 어떤 변경도 발생하지 않는 것이죠.

이를 구현하려면, 복사하려는 프로퍼티의 값이 객체에 해당하는지 확인한 후, 객체에 해당할 경우 참조 관계를 끊고 새로운 객체에 이를 복사하는 작업이 필요할 것입니다.

## 깊은 복사 직접 구현해보기

```javascript
function deepCopy(obj) {
  const newObj =
    Object.prototype.toString.call(obj) === '[object Array]' ? [] : {};

  for (const key in obj) {
    if (Object.hasOwn(obj, key)) {
      // 추가
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        newObj[key] = deepCopy(obj[key]);
      } else {
        newObj[key] = obj[key];
      }
    }
  }

  return newObj;
}
```

얕은 복사를 구현하는 작업 코드에서 if문을 하나 추가했습니다. 이 if문은 객체의 프로퍼티 값이 객체 혹은 배열인지 확인합니다.

프로퍼티 값이 객체나 배열에 해당할 경우, 함수 안에서 같은 함수를 호출하여 항상 새로운 객체로 생성하여 값을 저장하고, 아닐 경우에는 기존 프로퍼티 값을 그대로 할당합니다.

깊은 복사가 잘 되는지 한번 테스트 코드를 실행해보겠습니다.

```javascript
const obj = { a: 1, b: [1, 2, 3], c: { result: ['win'] } };
const obj2 = deepCopy(obj);

obj2.b = ['soccer', 'baseball'];
obj2.c.result = true;

console.log(obj); // { a: 1, b: [1, 2, 3], c: { result: ['win'] } }
console.log(obj2); // { a: 1, b: ['soccer', 'baseball'], c: { result: true } }
```

복사한 객체인 `obj2` 의 프로퍼티 b와 c의 값인 중첩된 하위 객체를 변경하더라도, 원본 객체인 `obj` 의 b, c 프로퍼티에 저장된 객체는 다른 객체이기 때문에 영향을 받지 않습니다.
