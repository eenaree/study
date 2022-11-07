# Array.prototype.shift()

## Syntax

```javascript
shift();
```

## 기본 동작

```javascript
const arr = [1, 2, 3];

const firstElement = arr.shift();

console.log(firstElement); // 1
console.log(arr); // [2, 3]
```

`shift()` 메서드는 호출한 배열에서 첫번째 요소를 제거한 후, 그 요소를 리턴합니다.

또한, 기존 배열을 변경합니다.

## 구현

`shift()` 메서드는 배열의 첫 요소를 제거하고, 그 다음 요소들의 인덱스를 한단계 앞으로 변경시킵니다.

앞선 인덱스에 값을 재할당해주면 요소의 인덱스를 변경할 수 있을 겁니다.

하지만, 첫번째 요소는 배열에서 사라지기 때문에, 배열의 길이는 기존 배열의 길이보다 1이 줄어들게 됩니다.

이때, `length` 프로퍼티를 이용하면 배열의 길이가 변경됨과 동시에 마지막 요소 또한 배열에서 제거할 수 있습니다.

```javascript
Array.prototype.shift = function () {
  let firstElement;

  for (let i = 0; i < this.length; i++) {
    if (i === 0) firstElement = this[i];

    if (i > 0) this[i - 1] = this[i];

    if (i + 1 === this.length) this.length = this.length - 1;
  }

  return firstElement;
};
```

또한, 0 이하의 정수, 즉 음의 정수 인덱스에 요소를 할당할 수 없으므로, if문으로 분기 처리 해주었습니다.
