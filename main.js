// list of variables
// DOM elements
const startText = document.getElementById("start-text");
const startButton = document.getElementById("start-btn");
const checkButton = document.getElementById("check-btn");
const nextButton = document.getElementById("next-btn");
const questionContainer = document.getElementById("question-container");
const questionElement = document.getElementById("question");
const answersElement = document.getElementById("answer-buttons");
const progressContainer = document.getElementById("progress-container");
const scoreDisplay = document.getElementById("score-display");

// API URL could be in the fetchQuestions function to avoid global variable. If it is a constant, it should be in all capital letters as best practice.
const URL = "https://opentdb.com/api.php?amount=10&type=multiple";

// global variables
let selectedButton = null;
let score = 0;
let questions;
let currentQuestionIndex;

// fetch questions from the trivia API
async function fetchQuestions() {
  try {
    const response = await fetch(URL);
    // response error handling
    if (!response.ok) {
      throw new Error(`Error fetching questions: ${response.status}`);
    }
    const data = await response.json();
    questions = data.results;
  } catch (error) {
    // textContent is better than innerHTML for security reasons
    questionContainer.textContent =
      "Error: We were not able to load your questions. Please refresh the page.";
    // console.error for debugging purposes
    console.error("Failed to fetch questions:", error);
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
  // this can be consolidated into one line
  // this increments currentQuestionIndex and then sets the next question
  setNextQuestion(++currentQuestionIndex);
});

async function startGame() {
  await fetchQuestions();

  // simplify with a forEach loop
  [startButton, startText, scoreDisplay].forEach((el) =>
    el.classList.add("hide")
  );

  // simplify with a forEach loop
  [questionContainer, checkButton, progressContainer].forEach((el) =>
    el.classList.remove("hide")
  );

  checkButton.classList.add("disabled");
  checkButton.disabled = true;

  currentQuestionIndex = 0;
  score = 0;

  setNextQuestion();
  createProgressBar();
}

function setNextQuestion() {
  resetState();
  // simplify with a ternary operator
  currentQuestionIndex < questions.length
    ? showQuestion(questions[currentQuestionIndex])
    : showFinalScore();
}

// create a function to shuffle the answers
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

function showQuestion(question) {
  // declare variables with const
  const correctAnswer = question.correct_answer;
  // break up the logic into a separate function
  const answerList = [...question.incorrect_answers, correctAnswer];
  shuffleArray(answerList);

  // textContent is better than innerHTML for security reasons and add unescapeHTML function to decode HTML entities
  questionElement.textContent = unescapeHTML(question.question);
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

  // can be consolidated into one line
  if (correct) score++;
  checkButton.classList.add("hide");

  // this can be simplified with a ternary operator
  currentQuestionIndex < questions.length - 1
    ? nextButton.classList.remove("hide")
    : showFinalScore();
}

function showFinalScore() {
  questionContainer.classList.add("hide");
  scoreDisplay.classList.remove("hide");
  // textContent is better than innerHTML for security reasons
  scoreDisplay.textContent = `You got ${score} out of ${questions.length} questions correct!`;
  scoreDisplay.style.fontSize = "1.2rem";
  startButton.innerText = "Restart quiz";
  startButton.classList.remove("hide");
}

// progress bar logic
function createProgressBar() {
  // textContent is better than innerHTML for security reasons
  progressContainer.textContent = "";
  // use forEach loop to create progress segments to be consistent with the rest of the code
  questions.forEach(() => {
    const segment = document.createElement("div");
    segment.classList.add("progress-segment", "progress-unanswered");
    progressContainer.appendChild(segment);
  });
}

function updateProgressBar(correct) {
  // updated for readability
  const segments = progressContainer.children[currentQuestionIndex];
  segments.classList.remove("progress-unanswered");
  segments.classList.add(correct ? "progress-correct" : "progress-wrong");
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
  // refactor to use a forEach loop for readability
  [questionContainer, progressContainer, checkButton].forEach((element) =>
    element.classList.remove("hide")
  );
  [scoreDisplay, startButton, nextButton].forEach((element) =>
    element.classList.add("hide")
  );
}

function setStatusClass(element, correct) {
  clearStatusClass(element);
  // use ternary operator for readability
  correct ? element.classList.add("correct") : element.classList.add("wrong");
}

function clearStatusClass(element) {
  // this can be consolidated into one line
  element.classList.remove("correct", "wrong");
}

function unescapeHTML(str) {
  // refactor for readability
  const parser = new DOMParser();
  return parser.parseFromString(`<!doctype html><body>${str}`, "text/html").body
    .textContent;
}
