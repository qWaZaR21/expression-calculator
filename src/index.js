function eval() {
    // Do not use eval!!!
    return;
}

function deleteWhitespace(string) {
    return string.split(' ').join('');
}

const isNotFigure = char => char === '/' || char === '*' || char === '+' || char === '-' || char === '(' || char === ')';


const getArrayExpession = (stringWithoutWhitespace => {
    let expessionArray = [];
    let number = '';

    for (let i = 0; i < stringWithoutWhitespace.length; i++) {
        if (isNotFigure(stringWithoutWhitespace[i])) {
            if (number) {
                expessionArray.push(+number);
                number = '';
            }
            expessionArray.push(stringWithoutWhitespace[i]);
        } else {
            number += stringWithoutWhitespace[i];
        }
    }
    if (number) expessionArray.push(+number);

    return expessionArray;
});

// const getBracketsArray = (bracketsAndOtherCharString => {
//     let bracketsArray = string.split('').reduce((result, char) => {
//         if (char === '(' || char === ')') result.push(char);
//         return result;
//     },[]);
//     return bracketsArray;
// });

// const checkGoodBracketsPosition = (bracketsArray) => {
//     let flag = true;
//     const renamethis = bracketsArray.reduce((renamethisarray, bracket) => {
//         if (bracket === '(') renamethisarray.push(bracket);
//         if (bracket === ')' && renamethisarray.length === 0) flag = false;
//         if (bracket === ')') renamethisarray.pop(); 
//         return renamethisarray;
//     }, []);
//     if (!flag) return false;
//     return renamethis.length ? false : true;
// };

const isExpressionValid = (exprArray) => {
    const { isCorrect , stack } = exprArray.reduce(( { isCorrect, stack }, char ) => {
       if (!isCorrect) return { isCorrect };
       if (char === '(') stack.push(char);
       if (!stack.length && char === ')') return { isCorrect: false};
       if (char === ')') stack.pop();
       return { isCorrect, stack };
    }, { isCorrect: true, stack: []});
   return isCorrect && !stack.length;
};

const getIndexInnerSpaceBetweenTheBraces = (numbersAndSingArray) => {
    let openCloseBracketIdArray = [];
    for (let i = 0; i < numbersAndSingArray.length; i++) {
        if (numbersAndSingArray[i] === '(') openCloseBracketIdArray[0] = i;
        if (numbersAndSingArray[i] === ')') {
            openCloseBracketIdArray[1] = i;
            return openCloseBracketIdArray;
        }
    }
    return [];
};

const multiplication = (exprArrayWithoutBrackets) => {
    exprArrayWithoutBrackets.splice(
        exprArrayWithoutBrackets.indexOf('*') - 1, 
        3, 
        exprArrayWithoutBrackets[exprArrayWithoutBrackets.indexOf('*') - 1] * exprArrayWithoutBrackets[exprArrayWithoutBrackets.indexOf('*') + 1]);
};

const division = (exprArrayWithoutBrackets) => {
    if (exprArrayWithoutBrackets[exprArrayWithoutBrackets.indexOf('/') + 1] === 0) throw new Error("TypeError: Division by zero.")
    exprArrayWithoutBrackets.splice(
        exprArrayWithoutBrackets.indexOf('/') - 1, 
        3, 
        exprArrayWithoutBrackets[exprArrayWithoutBrackets.indexOf('/') - 1] / exprArrayWithoutBrackets[exprArrayWithoutBrackets.indexOf('/') + 1]);
};

const getOperationChar = (char1, char2, exprArray) => {
    const char1Index = exprArray.indexOf(char1);
    const char2Index = exprArray.indexOf(char2);
    if (char1Index === -1) return char2;
    if (char2Index === -1) return char1;
    return char2Index > char1Index ? char1 : char2;
};

const multAndDivision = (exprArray) => {
    while (exprArray.indexOf('/') !== -1 || exprArray.indexOf('*') !== -1) { 
        const char = getOperationChar('*', '/', exprArray);
        char === '*' ? multiplication(exprArray) : division(exprArray);
    }
};

const addition = (exprArrayWithoutBrackets) => {
    exprArrayWithoutBrackets.splice(
        exprArrayWithoutBrackets.indexOf('+') - 1, 
        3, 
        exprArrayWithoutBrackets[exprArrayWithoutBrackets.indexOf('+') - 1] + exprArrayWithoutBrackets[exprArrayWithoutBrackets.indexOf('+') + 1]);
};

const subtraction = (exprArrayWithoutBrackets) => {
    exprArrayWithoutBrackets.splice(
        exprArrayWithoutBrackets.indexOf('-') - 1, 
        3, 
        exprArrayWithoutBrackets[exprArrayWithoutBrackets.indexOf('-') - 1] - exprArrayWithoutBrackets[exprArrayWithoutBrackets.indexOf('-') + 1]);
};

const addAndSubtr = (exprArray) => {
    while (exprArray.indexOf('+') !== -1 || exprArray.indexOf('-') !== -1) { 
        const char = getOperationChar('+', '-', exprArray);
        char === '+' ? addition(exprArray) : subtraction(exprArray);
    }
};

const calcSpace = (numbersAndSingArray) => {
    
    let [openBracketIndex, closeBracketIndex] = getIndexInnerSpaceBetweenTheBraces(numbersAndSingArray);

    while (closeBracketIndex){

        let exprArrayWithoutBrackets = numbersAndSingArray.slice(openBracketIndex + 1, closeBracketIndex);
        
        // division(exprArrayWithoutBrackets);
        // multiplication(exprArrayWithoutBrackets);
        multAndDivision(exprArrayWithoutBrackets);
        addAndSubtr(exprArrayWithoutBrackets);

        numbersAndSingArray.splice(openBracketIndex, closeBracketIndex + 1 - openBracketIndex, exprArrayWithoutBrackets[0]);

        [openBracketIndex, closeBracketIndex] = getIndexInnerSpaceBetweenTheBraces(numbersAndSingArray);
    }

    // division(numbersAndSingArray);
    // multiplication(numbersAndSingArray);
    multAndDivision(numbersAndSingArray);
    addAndSubtr(numbersAndSingArray);

    return numbersAndSingArray;
};

function expressionCalculator(expr) {

    let numbersAndSingArray = getArrayExpession(deleteWhitespace(expr));
    if (!isExpressionValid(numbersAndSingArray)) throw new Error("ExpressionError: Brackets must be paired");
    

    const sad = calcSpace(numbersAndSingArray);
    return (sad.length === 1) ? sad[0] : sad[1];
}

module.exports = {
    expressionCalculator
}
