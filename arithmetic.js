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

class AddQuestion {
    constructor(a, b) {
        this.a = a;
        this.b = b;
        this.answer = this.a + this.b;
    }

    checkAnswer(answer) {
        return this.answer === Number(answer);
    }

    toString() {
        return `${this.a} + ${this.b} = `;
    }
}

class Arithmetic {
    constructor(aIntRange, bIntRange, questionElement) {
        this.aIntRange = aIntRange;
        this.bIntRange = bIntRange;
        this.questionElement = questionElement;
        this.numAnswered = 0;
        this.question = new AddQuestion(this.aIntRange.randomValue(), this.bIntRange.randomValue());
        this.renderQuestion();
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
        this.question = new AddQuestion(this.aIntRange.randomValue(), this.bIntRange.randomValue());
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


const answerInput = document.getElementById('answer');
const scoreTable = {
    "numAnswered": document.getElementById('numAnswered'),
    "avgTimePerQuestion": document.getElementById('avgTimePerQuestion'),
}

function updateScoreTable(arithmetic) {
    scoreTable.numAnswered.innerText = arithmetic.numAnswered;
    scoreTable.avgTimePerQuestion.innerText = arithmetic.getAvgTimePerQuestion();
}


const questionElement = document.getElementById('questionText');
const arithmetic = new Arithmetic(new IntRange(1, 101), new IntRange(1, 101), questionElement);

answerInput.addEventListener('input', () => {
    if (arithmetic.answerQuestion(answerInput.value)) {
        answerInput.value = "";
        updateScoreTable(arithmetic);
    }
});

// TODO: add ability to customize difficulty level
// TODO: ability to choose operation
// TODO: fixed time limit
// TODO: multiplayer
