/**
 * Used to specify a range of integers. Useful for setting difficulty levels.
 */
class IntRange {
    /**
     * @param min {Number} (inclusive)
     * @param max {Number} (exclusive)
     * @param step {Number} (default 1)
     */
    constructor(min, max, step = 1) {
        this.min = min;
        this.max = max;
        this.step = step;
    }

    /**
     * @returns {number} random number in range
     */
    randomValue() {
        return Math.floor(Math.random() * (this.max - this.min) / this.step) * this.step + this.min;
    }
}

/**
 * represents an operator
 */
class Operator {
    /**
     * @param symbol {String}
     * @param func {Function}
     */
    constructor(symbol, func) {
        this.symbol = symbol;
        this.func = func;
    }

    toString() {
        return this.symbol;
    }
}

class BinaryQuestion {
    /**
     * @param operator {Operator}
     * @param a {Number}
     * @param b {Number}
     */

    constructor(operator, a, b) {
        this.a = a;
        this.b = b;
        this.operator = operator;
        this.answer = this.operator.func(a, b);
    }

    checkAnswer(answer) {
        return this.answer === Number(answer);
    }

    toString() {
        return `${this.a} ${this.operator} ${this.b} = `;
    }
}


class QuestionGenerator {
    /**
     * @param operator {Operator}
     * @param aIntRange {IntRange}
     * @param bIntRange {IntRange}
     */
    constructor(operator, aIntRange, bIntRange) {
        this.operator = operator;
        this.aIntRange = aIntRange;
        this.bIntRange = bIntRange;
    }

    generateQuestion() {
        return new BinaryQuestion(this.operator, this.aIntRange.randomValue(), this.bIntRange.randomValue());
    }
}

/**
 * holds the main logic of the game
 */
class Arithmetic {
    /**
     * @param questionElement {HTMLElement}
     * @param questionGenerator {QuestionGenerator}
     */
    constructor(questionElement, questionGenerator) {
        this.questionElement = questionElement;
        this.questionGenerator = questionGenerator;
        this.numAnswered = 0;
        this.nextQuestion();
    }

    /**
     * @param answer {number} The answer to check
     * @returns {boolean} is correct?
     */
    answerQuestion(answer) {
        if (this.question.checkAnswer(answer)) {
            this.numAnswered++;
            this.nextQuestion();
            if (this.numAnswered === 1) {
                this.startTime = Date.now();
            }
            return true;
        } else {
            return false;
        }

    }

    nextQuestion() {
        this.question = this.questionGenerator.generateQuestion();
        this.renderQuestion();
    }

    renderQuestion() {
        this.questionElement.innerText = this.question.toString();
    }

    /**
     * @returns {number} milliseconds per question. Timer starts when first question is answered.
     */
    getAvgTimePerQuestion() {
        if (this.numAnswered === 0) {
            return 0;
        }
        return Math.floor((Date.now() - this.startTime) / this.numAnswered);
    }
}

const settingsForm = document.getElementById('settings');
const answerInput = document.getElementById('answer');
const questionElement = document.getElementById('questionText');

const scoreTable = {
    'numAnswered': document.getElementById('numAnswered'),
    'avgTimePerQuestion': document.getElementById('avgTimePerQuestion'),
    updateScoreTable(arithmetic) {
        this.numAnswered.innerText = arithmetic.numAnswered;
        this.avgTimePerQuestion.innerText = arithmetic.getAvgTimePerQuestion();
    }
}

const operators = {
    'addition': new Operator('+', (a, b) => a + b),
    'subtraction': new Operator('-', (a, b) => a - b),
    'multiplication': new Operator('*', (a, b) => a * b),
    'division': new Operator('/', (a, b) => a / b),
}


let arithmetic = new Arithmetic(questionElement,
    new QuestionGenerator(operators.addition, new IntRange(0, 10), new IntRange(0, 10)));

settingsForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const data = new FormData(settingsForm);
    let min = Number(data.get('min'));
    let max = Number(data.get('max'));
    arithmetic = new Arithmetic(questionElement,
        new QuestionGenerator(operators[data.get('operator')], new IntRange(min, max), new IntRange(min, max)));
});

answerInput.addEventListener('input', () => {
    if (arithmetic.answerQuestion(answerInput.value)) {
        answerInput.value = '';
    }
});

setInterval(() => {
    scoreTable.updateScoreTable(arithmetic);
}, 1000);

// TODO: timer
// TODO: operation checkbox (ability to choose multiple)
// TODO: add ability to customize difficulty level
// TODO: time limit
// TODO: multiplayer. 2 players 1v1 sounds funS

