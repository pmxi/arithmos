class AddQuestion {
    constructor() {
        this.a = Math.floor(Math.random() * 10);
        this.b = Math.floor(Math.random() * 10);
        this.answer = this.a + this.b;
    }

    checkAnswer(answer) {
        return this.answer == answer;
    }

    toString() {
        return `${this.a} + ${this.b} = `;
    }
}

class Arithmetic {
    constructor(questionElement) {
        this.questionElement = questionElement;
        this.numCorrect = 0;
        this.numIncorrect = 0;
        this.question = new AddQuestion();
        this.renderQuestion();
    }

    /**
     * @param answer {number} The answer to check
     * @returns {boolean} is correct?
     */
    answerQuestion(answer) {
        if (this.question.checkAnswer(answer)) {
            this.numCorrect++;
            this.nextQuestion();
            return true;
        } else {
            this.numIncorrect++;
            return false;
        }

    }

    nextQuestion() {
        this.question = new AddQuestion();
        this.renderQuestion();
    }

    renderQuestion() {
        this.questionElement.innerText = this.question.toString();
    }

    get percentCorrect() {
        return Math.floor(this.numCorrect / (this.numCorrect + this.numIncorrect) * 100);
    }

}


const answerInput = document.getElementById('answer');
const submitButton = document.getElementById('submit');
const scoreTable = {
    "numCorrect": document.getElementById('numCorrect'),
    "numIncorrect": document.getElementById('numIncorrect'),
    "percentCorrect": document.getElementById("percentCorrect"),
}

function updateScoreTable(arithmetic) {
    scoreTable.numCorrect.innerText = arithmetic.numCorrect;
    scoreTable.numIncorrect.innerText = arithmetic.numIncorrect;
    scoreTable.percentCorrect.innerText = arithmetic.percentCorrect.toString();
}

const questionElement = document.getElementById('questionText');
const arithmetic = new Arithmetic(questionElement);

answerInput.addEventListener('input', () => {
    if (arithmetic.answerQuestion(answerInput.value)) {
        answerInput.value = "";
        updateScoreTable(arithmetic);
    }
});
