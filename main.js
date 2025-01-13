const startButton = document.getElementById("start-btn");
const nextButton = document.getElementById("next-btn");
const questionContainer = document.getElementById("question-container");
const questionElement = document.getElementById("question");
const answersElement = document.getElementById("answer-buttons");
const url = "https://opentdb.com/api.php?amount=10&type=multiple";

function startGame() {
  startButton.classList.add("hide");
  questionContainer.classList.remove("hide");
}

startButton.addEventListener("click", startGame);

async function fetchQuestion() {
  const response = await fetch(url);
  const questions = await response.json();
  showQuestion(questions.results[0]);
}

function showQuestion(questions) {
  let correctAnswer = questions.correct_answer;
  let incorrectAnswer = questions.incorrect_answers;
  let answerList = incorrectAnswer;
  answerList.splice(
    Math.floor(Math.random() * (incorrectAnswer.length + 1)),
    0,
    correctAnswer
  );
  questionElement.innerHTML = `${questions.question}`;
  answersElement.innerHTML = `${answerList
    .map(
      (answer, index) =>
        `<button class="btn"> ${index + 1}. ${answer} </button>`
    )
    .join("")}`;
}

fetchQuestion();
