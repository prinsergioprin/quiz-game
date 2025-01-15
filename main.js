// list of variables
const startText = document.getElementById("start-text");
const startButton = document.getElementById("start-btn");
const checkButton = document.getElementById("check-btn");
const nextButton = document.getElementById("next-btn");
const questionContainer = document.getElementById("question-container");
const questionElement = document.getElementById("question");
const answersElement = document.getElementById("answer-buttons");
const progressContainer = document.getElementById("progress-container");
const scoreDisplay = document.getElementById("score-display");
const url = "https://opentdb.com/api.php?amount=10&type=multiple";
let selectedButton = null;
let score = 0;
let questions;
let currentQuestionIndex;

// fetch questions from the trivia API
async function fetchQuestions() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    questions = data.results;
  } catch (error) {
    questionContainer.innerHTML =
      "Error: We were not able to load your questions. Please refresh the page.";
  }
}

// general game logic
startButton.addEventListener("click", () => {
  if (startButton.innerText === "Restart quiz") {
    resetGame();
  }
  startGame();
});
checkButton.addEventListener("click", checkAnswer);
nextButton.addEventListener("click", () => {
  currentQuestionIndex++;
  setNextQuestion();
});

async function startGame() {
  await fetchQuestions();
  startButton.classList.add("hide");
  startText.classList.add("hide");
  questionContainer.classList.remove("hide");
  checkButton.classList.remove("hide");
  checkButton.classList.add("disabled");
  checkButton.disabled = true;
  progressContainer.classList.remove("hide");
  scoreDisplay.classList.add("hide");
  currentQuestionIndex = 0;
  score = 0;
  setNextQuestion();
  createProgressBar();
}

function setNextQuestion() {
  resetState();
  if (currentQuestionIndex < questions.length) {
    showQuestion(questions[currentQuestionIndex]);
  } else {
    showFinalScore();
  }
}

function showQuestion(question) {
  let correctAnswer = question.correct_answer;
  let incorrectAnswer = question.incorrect_answers;
  let answerList = incorrectAnswer;
  answerList.splice(
    Math.floor(Math.random() * (incorrectAnswer.length + 1)),
    0,
    correctAnswer
  );
  questionElement.innerHTML = question.question;
  answerList.forEach((answer) => {
    const button = document.createElement("button");
    button.innerText = unescapeHTML(answer);
    button.classList.add("btn");
    if (answer === correctAnswer) {
      button.dataset.correct = "true";
    }
    button.addEventListener("click", selectAnswer);
    answersElement.appendChild(button);
  });
}

function selectAnswer(e) {
  if (selectedButton) {
    selectedButton.classList.remove("selected");
  }
  selectedButton = e.target;
  selectedButton.classList.add("selected");
  checkButton.classList.remove("disabled");
  checkButton.disabled = false;
}

function checkAnswer() {
  if (!selectedButton) return;
  const correct = selectedButton.dataset.correct === "true";
  Array.from(answersElement.children).forEach((button) => {
    setStatusClass(button, button.dataset.correct === "true");
    button.disabled = true;
    button.style.cursor = "auto";
  });
  updateProgressBar(correct);
  if (correct) {
    score++;
  }
  checkButton.classList.add("hide");
  if (currentQuestionIndex < questions.length - 1) {
    nextButton.classList.remove("hide");
  } else {
    showFinalScore();
  }
}

function showFinalScore() {
  questionContainer.classList.add("hide");
  scoreDisplay.classList.remove("hide");
  scoreDisplay.innerHTML = `You got ${score} out of ${questions.length} questions correct!`;
  scoreDisplay.style.fontSize = "1.2rem";
  startButton.innerText = "Restart quiz";
  startButton.classList.remove("hide");
}

// progress bar logic
function createProgressBar() {
  progressContainer.innerHTML = "";
  for (let i = 0; i < questions.length; i++) {
    const segment = document.createElement("div");
    segment.classList.add("progress-segment", "progress-unanswered");
    progressContainer.appendChild(segment);
  }
}

function updateProgressBar(correct) {
  const segments = progressContainer.children;
  segments[currentQuestionIndex].classList.remove("progress-unanswered");
  segments[currentQuestionIndex].classList.add(
    correct ? "progress-correct" : "progress-wrong"
  );
}

// helper functions
function resetState() {
  nextButton.classList.add("hide");
  checkButton.classList.remove("hide");
  checkButton.classList.add("disabled");
  checkButton.disabled = true;
  selectedButton = null;
  while (answersElement.firstChild) {
    answersElement.removeChild(answersElement.firstChild);
  }
}

function resetGame() {
  questionContainer.classList.remove("hide");
  progressContainer.classList.remove("hide");
  scoreDisplay.classList.add("hide");
  startButton.classList.add("hide");
  checkButton.classList.remove("hide");
  nextButton.classList.add("hide");
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

function unescapeHTML(str) {
  const parser = new DOMParser();
  const decoded = parser.parseFromString(
    `<!doctype html> <body>${str}`,
    "text/html"
  ).body.textContent;
  return decoded;
}
