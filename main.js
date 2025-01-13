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
  resetState();
  let correctAnswer = questions.correct_answer;
  let incorrectAnswer = questions.incorrect_answers;
  let answerList = incorrectAnswer;
  answerList.splice(
    Math.floor(Math.random() * (incorrectAnswer.length + 1)),
    0,
    correctAnswer
  );
  questionElement.innerHTML = questions.question;
  answerList.forEach((answer) => {
    const button = document.createElement("button");
    button.innerText = answer;
    button.classList.add("btn");
    if (answer === correctAnswer) {
      button.dataset.correct = "true";
    }
    button.addEventListener("click", selectAnswer);
    answersElement.appendChild(button);
  });
}

function resetState() {
  clearStatusClass(document.body);
  nextButton.classList.add("hide");
  while (answersElement.firstChild) {
    answersElement.removeChild(answersElement.firstChild);
  }
}

function selectAnswer(e) {
  const selectedButton = e.target;
  const correct = selectedButton.dataset.correct === "true";
  setStatusClass(document.body, correct);
  Array.from(answersElement.children).forEach((button) => {
    setStatusClass(button, button.dataset.correct === "true");
  });
  nextButton.classList.remove("hide");
}

function setStatusClass(element, correct) {
  clearStatusClass(element);
  if (correct) {
    element.classList.add("correct");
  } else {
    element.classList.add("wrong");
  }
}

function clearStatusClass(element) {
  element.classList.remove("correct");
  element.classList.remove("wrong");
}

fetchQuestion();
