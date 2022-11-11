const clearBtn = document.querySelector('#clear');
const dotBtn = document.querySelector('#dot');
const numberButtons = document.querySelectorAll('.number');
const operatorButtons = document.querySelectorAll('.operator');
const expression = document.querySelector('.expression');
const result = document.querySelector('.result');

let output = 0;
let currentInput = 0;
let operator = '';
let isFirst = false;

for (const numberButton of numberButtons) {
  numberButton.addEventListener('click', () => {
    // 현재 숫자가 0인 경우
    // 1. 0 클릭 => 무시
    // 2. 0 이외 클릭 => 그 값으로 변경

    // 현재 숫자가 0이 아닌 경우
    // 숫자를 클릭할 때마다 그 숫자를 이전 숫자의 오른쪽에 추가

    // 연산자가 존재하는 경우에 숫자를 입력한 경우 => 두번째 숫자 입력에 해당
    // 두번째 숫자를 처음 입력하는 경우라면, 이전 첫번째 숫자를 화면에 보여주고, 입력한 숫자를 현재 숫자에 할당함.
    // 그게 아니라면, 현재 숫자의 오른쪽에 추가

    if (result) {
      if (operator === '') {
        if (result.textContent === '0') {
          if (numberButton.textContent === '0') return;
          result.textContent = numberButton.textContent;
          currentInput = Number(result.textContent);
          return;
        }

        result.textContent += numberButton.textContent ?? '';
        currentInput = Number(result.textContent);
      } else {
        if (isFirst) {
          result.textContent = numberButton.textContent;
          currentInput = Number(result.textContent);
          isFirst = false;
          return;
        }
        result.textContent += numberButton.textContent ?? '';
        currentInput = Number(result.textContent);
      }
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

    if (result && expression && operatorButton.textContent) {
      if (operator === '') {
        operator = operatorButton.textContent;
        output = currentInput;
        currentInput = 0;
        result.textContent = `${output}`;
        expression.textContent = `${output} ${operator}`;
        isFirst = true;
      } else {
        if (operator !== operatorButton.textContent) {
          if (isFirst) {
            operator = operatorButton.textContent;
            expression.textContent = `${output} ${operator}`;
          } else {
            switch (operator) {
              case '+':
                output += currentInput;
                break;
              case '-':
                output -= currentInput;
                break;
              case '*':
                output *= currentInput;
                break;
              case '÷':
                output /= currentInput;
                break;
            }
            operator = operatorButton.textContent;
            result.textContent = `${output}`;
            expression.textContent = `${output} ${operator}`;
            currentInput = 0;
            isFirst = true;
          }
          
          return;
        }

        if (isFirst) return;
        switch (operator) {
          case '+':
            output += currentInput;
            break;
          case '-':
            output -= currentInput;
            break;
          case '*':
            output *= currentInput;
            break;
          case '÷':
            output /= currentInput;
            break;
        }
        currentInput = 0;
        result.textContent = `${output}`;
        expression.textContent = `${output} ${operator}`;
        isFirst = true;
      }
    }
  });
}

clearBtn?.addEventListener('click', () => {
  // 초기화
  if (expression && result) {
    expression.textContent = '';
    result.textContent = '0';
    output = 0;
    currentInput = 0;
    operator = '';
  }
});

dotBtn?.addEventListener('click', () => {
  // 현재 입력 숫자에 점이 포함되어 있다면, 점 입력 더이상 불가
  // 두번째 숫자를 한번도 입력하지 않은 경우 => 0. 형태로 추가
  // 한번이라도 입력한 경우 => 현재 숫자에 .만 붙임
  if (result) {
    if (Number.isInteger(currentInput)) {
      if (isFirst) {
        result.textContent = '0.';
        isFirst = false;
      } else {
        result.textContent += '.';
      }
    }
  }
});
