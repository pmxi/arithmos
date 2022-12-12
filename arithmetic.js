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

class Question {
    /**
     * @param question {String}
     * @param answer {Number}
     */
    constructor(question, answer) {
        this.question = question;
        this.answer = answer;
    }

    /**
     * @param answer {Number|String}
     * @returns {Boolean}
     */
    checkAnswer(answer) {
        return this.answer === Number(answer);
    }

    toString() {
        return this.question;
    }
}

class AdditionQuestionGenerator {
    constructor(aIntRange, bIntRange) {
        this.aIntRange = aIntRange;
        this.bIntRange = bIntRange;
    }

    generateRandomQuestion() {
        let a = this.aIntRange.randomValue();
        let b = this.bIntRange.randomValue();

        return new Question(`${a} + ${b} = `, a + b);
    }
}

class SubtractionQuestionGenerator {
    constructor(aIntRange, bIntRange) {
        this.aIntRange = aIntRange;
        this.bIntRange = bIntRange;
    }

    generateRandomQuestion() {
        let a = this.aIntRange.randomValue();
        let b = this.bIntRange.randomValue();

        return new Question(`${a} - ${b} = `, a - b);
    }
}

class MultiplicationQuestionGenerator {
    constructor(aIntRange, bIntRange) {
        this.aIntRange = aIntRange;
        this.bIntRange = bIntRange;
    }

    generateRandomQuestion() {
        let a = this.aIntRange.randomValue();
        let b = this.bIntRange.randomValue();

        return new Question(`${a} \u00d7 ${b} = `, a * b);
    }
}

class DivisionQuestionGenerator {
    constructor(aIntRange, bIntRange) {
        this.aIntRange = aIntRange;
        this.bIntRange = bIntRange;
    }

    generateRandomQuestion() {
        let a = this.aIntRange.randomValue();
        let b = this.bIntRange.randomValue();
        let answer = Math.floor((a * 100 / b)) / 100;

        return new Question(`${a} \u00f7 ${b} = `, answer);
    }

}


const questionGenerators = {
    addition: AdditionQuestionGenerator,
    subtraction: SubtractionQuestionGenerator,
    multiplication: MultiplicationQuestionGenerator,
    division: DivisionQuestionGenerator
}

class MultipleQuestionGenerator {

    constructor(questionGenerators) {
        if (questionGenerators.length === 0) {
            throw new Error('No question generators specified');
        }
        this.questionGenerators = questionGenerators;
    }

    generateRandomQuestion() {
        let index = Math.floor(Math.random() * this.questionGenerators.length);
        return this.questionGenerators[index].generateRandomQuestion();
    }
}

/**
 * holds the main logic of the game
 */
class Arithmetic {
    /**
     * @param {HTMLElement} questionElement
     * @param questionGenerator
     */
    constructor(questionElement, questionGenerator) {
        this.questionElement = questionElement;
        this.questionGenerator = questionGenerator;
        this.numAnswered = 0;
        this.nextQuestion();
    }

    /**
     * @param {number} answer The answer to check
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
        }
        return false;

    }

    nextQuestion() {
        this.question = this.questionGenerator.generateRandomQuestion();
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


let arithmetic = new Arithmetic(
    questionElement,
    new MultipleQuestionGenerator([
        new AdditionQuestionGenerator(new IntRange(0, 10), new IntRange(0, 10))
    ])
);


settingsForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(settingsForm);

    let min = Number(data.get('min'));
    let max = Number(data.get('max'));
    let operatorNames = data.getAll('operator');
    let questionGeneratorList = [];
    for (let operatorName of operatorNames) {
        questionGeneratorList.push(
            new questionGenerators[operatorName](new IntRange(min, max), new IntRange(min, max)));
    }
    let questionGenerator = new MultipleQuestionGenerator(questionGeneratorList);
    arithmetic = new Arithmetic(questionElement, questionGenerator);
    answerInput.focus();
});

answerInput.addEventListener('input', () => {
    if (arithmetic.answerQuestion(answerInput.value)) {
        answerInput.value = '';
    }
});

setInterval(() => {
    scoreTable.updateScoreTable(arithmetic);
}, 1000);
