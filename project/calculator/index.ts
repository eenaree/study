const clearBtn = document.querySelector('#clear');
const clearEntryBtn = document.querySelector('#clear_entry');
const dotBtn = document.querySelector('#dot');
const equalBtn = document.querySelector('#equal');
const numberButtons = document.querySelectorAll('.number');
const operatorButtons = document.querySelectorAll('.operator');
const expression = document.querySelector('.expression');
const result = document.querySelector('.result');

let firstNumber = 0;
let secondNumber = 0;
let operator = '';
let isFirst = false;
let equal = false;

if (!(result instanceof HTMLElement)) {
  throw new Error('result must be an HTML element');
}

if (!(expression instanceof HTMLElement)) {
  throw new Error('expression must be be an HTML element');
}

const calculate = (operator: string, firstNumber: number, secondNumber: number) => {
  let output = 0;
  switch (operator) {
    case '+':
      output = firstNumber + secondNumber;
      break;
    case '-':
      output = firstNumber - secondNumber;
      break;
    case '*':
      output = firstNumber * secondNumber;
      break;
    case '÷':
      output = firstNumber / secondNumber;
      break;
    default:
      console.log('matching operator is not exist.');
  }

  return output;
};

for (const numberButton of numberButtons) {
  numberButton.addEventListener('click', () => {
    // 현재 숫자가 0인 경우
    // 1. 0 클릭 => 무시
    // 2. 0 이외 클릭 => 그 값으로 변경

    // 현재 숫자가 0이 아닌 경우
    // 숫자를 클릭할 때마다 그 숫자를 이전 숫자의 오른쪽에 추가

    if (numberButton.textContent === null) return;
    if (equal) {
      expression.textContent = '';
      result.textContent = numberButton.textContent;
      firstNumber = Number(result.textContent);
      equal = false;
      return;
    }

    if (isFirst) {
      result.textContent = numberButton.textContent;
      secondNumber = Number(result.textContent);
      isFirst = false;
      return;
    }

    if (result.textContent === '0') {
      result.textContent = numberButton.textContent;
    } else {
      result.textContent += numberButton.textContent;
    }

    if (operator === '') {
      firstNumber = Number(result.textContent);
    } else {
      secondNumber = Number(result.textContent);
    }
  });
}

for (const operatorButton of operatorButtons) {
  operatorButton.addEventListener('click', () => {
    // 연산자가 없는 경우 (첫번째 숫자 입력 단계)
    // => 연산자를 클릭할 경우, 연산을 실행하지 않고 연산자를 추가함.
    // => 현재 숫자를 이전 숫자에 저장하고, 표현식을 변경함.

    // 연산자가 이미 있는 경우 (두번째 숫자 입력 단계)
    // 1. 기존 연산자와 다른 연산자를 클릭한 경우
    // 숫자를 한번이라도 입력했다면 => 이전 연산자로 연산 실행 후, 연산자 변경
    // 숫자를 한번도 입력하지 않았다면 => 연산자 변경만 함
    // 2. 기존 연산자와 같은 연산자를 클릭한 경우
    // 숫자를 한번이라도 입력했다면 => 연산 실행
    // 숫자를 한번도 입력하지 않았다면면 => 연산 실행 x

    if (operatorButton.textContent === null) return;
    if (equal) {
      operator = operatorButton.textContent;
      firstNumber = Number(result.textContent);
      secondNumber = Number(result.textContent);
      expression.textContent = `${firstNumber} ${operator}`;
      equal = false;
      isFirst = true;
      return;
    }

    if (isFirst) {
      operator = operatorButton.textContent;
      expression.textContent = `${firstNumber} ${operator}`;
      result.textContent = `${firstNumber}`;
      secondNumber = firstNumber;
      return;
    }

    if (operator === '') {
      operator = operatorButton.textContent;
      expression.textContent = `${firstNumber} ${operator}`;
      result.textContent = `${firstNumber}`;
      secondNumber = firstNumber;
      isFirst = true;
      return;
    }

    if (operator !== operatorButton.textContent) {
      const output = calculate(operator, firstNumber, secondNumber);
      operator = operatorButton.textContent;
      firstNumber = output;
      secondNumber = output;
      expression.textContent = `${firstNumber} ${operator}`;
      result.textContent = `${output}`;
      isFirst = true;
      return;
    }

    const output = calculate(operator, firstNumber, secondNumber);
    firstNumber = output;
    secondNumber = output;
    expression.textContent = `${firstNumber} ${operator}`;
    result.textContent = `${output}`;
    isFirst = true;
  });
}

clearBtn?.addEventListener('click', () => {
  // 초기화
  expression.textContent = '';
  result.textContent = '0';
  firstNumber = 0;
  secondNumber = 0;
  operator = '';
});

clearEntryBtn?.addEventListener('click', () => {
  // 현재 입력 숫자 삭제
  // 수식 계산이 이뤄진 후에 클릭한 경우 => 전부 초기화
  if (equal) {
    expression.textContent = '';
    result.textContent = '0';
    firstNumber = 0;
    secondNumber = 0;
    operator = '';
  } else {
    result.textContent = '0';
    isFirst = true;
  }
});

dotBtn?.addEventListener('click', () => {
  // 현재 입력 숫자에 점이 포함되어 있다면, 점 입력 더이상 불가
  // 두번째 숫자를 한번도 입력하지 않은 경우 => 0. 형태로 추가
  // 한번이라도 입력한 경우 => 현재 숫자에 .만 붙임
  if (Number.isInteger(secondNumber)) {
    if (isFirst) {
      result.textContent = '0.';
      isFirst = false;
    } else {
      result.textContent += '.';
    }
  }
});

equalBtn?.addEventListener('click', () => {
  // 연산자가 존재하지 않는 경우 => 무시
  // 연산자가 존재하는 경우 => 연산 실행

  // 연산이 실행됐다면 => 표현식에 숫자들과 연산자, equal 까지 표현
  // 연산이 실행된 후,
  // 1. 숫자 클릭 => 클릭한 숫자만 현재 숫자로 보여주기(결과창), 그 이외 값은 초기화
  // 2. 연산자 클릭 => 클릭한 연산자와 현재 결과를 합친 표현식 보여주기. 첫번째 입력 상태 여부 초기화

  if (operator === '') return;

  const output = calculate(operator, firstNumber, secondNumber);
  expression.textContent = `${firstNumber} ${operator} ${secondNumber} =`;
  result.textContent = `${output}`;
  operator = '';
  equal = true;
});
