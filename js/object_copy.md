# 객체의 얕은 복사와 깊은 복사

어떤 변수 A에 특정 객체를 할당하게 되면, 이 변수 A는 그 객체에 대한 참조 값을 저장합니다.

만약, 또 다른 변수 B가 변수 A와 같은 객체에 대한 참조 값을 저장할 때, 이 객체의 특정 프로퍼티의 값을 변경된다면, 이 객체를 참조하고 있던 변수들에게도 영향을 미칩니다.

간단한 예시 코드를 살펴보겠습니다.

```javascript
const original = [1, 2, 3];
const copy = original;

console.log(copy); // [1, 2, 3]
console.log(original === copy); // true

copy[0] = 10;

console.log(original); // [10, 2, 3]
console.log(copy); // [10, 2, 3]
console.log(original === copy); // true
```

숫자 배열 `[1, 2, 3]` 에 첫번째 요소의 값이 10으로 변경되니, 같은 배열을 참조하고 있던, `original` 변수의 첫번째 요소가 모두 변경된 것을 볼 수 있죠?

특정 프로퍼티 값이 변경되더라도, 여전히 같은 객체를 참조하기 때문에, 두 변수를 `===` 비교 연산자를 통해 비교하면 `true` 가 리턴됩니다.

이번에는, `copy` 변수에 새로운 배열을 할당해보겠습니다.

```javascript
copy = [4, 5];

console.log(original); // [1, 2, 3]
console.log(copy); // [4, 5]
consolel.log(original === copy); // false

copy[0] = 10;
console.log(original); // [1, 2, 3]
console.log(copy); // [10, 5]
console.log(original === copy); // false
```

할당을 통해, `copy` 변수는 기존에 참조하고 있던 `[1, 2, 3]` 이라는 배열과의 참조 관계를 끊어내고, 새로운 배열 객체 `[4, 5]` 와의 참조 관계를 생성했습니다.

따라서, `original` 과 `copy` 변수는 이제 더이상 같은 객체를 참조하지 않습니다. 앞선 예제와 달리, 이제 비교 연산자를 통해 두 변수를 비교할 경우, `false` 를 리턴합니다.

서로 다른 객체를 참조하기 때문에, `copy` 변수의 특정 프로퍼티의 값을 변경하더라도, `original` 변수가 참조하고 있는 객체에는 변화가 발생하지 않습니다.

<br />

여기서 중요하게 기억해야 할 것은 **새로운 값을 할당하는 것과 특정 프로퍼티 값을 변경하는 것이 서로 다른 의미를 갖는다는 것입니다.** 이 개념은 아래에서 설명할 객체의 얕은 복사를 이해하는 데에 매우 중요합니다.

## 얕은 복사

얕은 복사는 원본 객체의 최상위 객체만을 복사합니다.

예를 들어, 원본 배열과 이를 얕은 복사한 배열이 있다고 가정할 때,

```javascript
const original = [1, { list: [1, 2, 3] }];

const copy = original.slice();
```

최상위 객체에 대해 얕은 복사가 발생했기 때문에, `original` 에 할당된 객체에 대한 참조 값이 `copy` 에는 연결되어 있지 않습니다.

`copy` 가 참조하고 있는 배열은 `original` 과는 다른 배열인 것이죠.

따라서, `copy` 에 할당된 특정 배열 요소를 변경하더라도, 원본 객체인 `original` 에 아무런 변화도 발생하지 않습니다.

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

그러나, 위에서 `prototype` 메서드를 일부 변경했을 것을 감안하여, static 메서드를 사용했으므로, `Array.isArray` 메서드를 통해 배열 여부를 확인하는 것이 더 좋을 것 같습니다.

## 깊은 복사

깊은 복사는 얕은 복사와 달리, 복사하려는 원본 객체의 중첩된 하위 객체까지도 복사하는 것을 말합니다.

즉, 앞서 보여드린 얕은 복사의 예시에서 하위 객체인 `list` 프로퍼티의 값을 변경하더라도 원본 객체에는 어떤 변경도 발생하지 않는 것이죠.

이를 구현하려면, 복사하려는 프로퍼티의 값이 객체에 해당하는지 확인한 후, 객체에 해당할 경우 참조 관계를 끊고 새로운 객체에 이를 복사하는 작업이 필요할 것입니다.

## 깊은 복사 직접 구현해보기

```javascript
function deepCopy(obj) {
  const newObj = Array.isArray(obj) ? [] : {};

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
