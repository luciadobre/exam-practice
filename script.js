const questionContainer = document.getElementById("question-container");
const submitButton = document.getElementById("submit-button");
const nextButton = document.getElementById("next-button");
const result = document.getElementById("result");

let questionsOrder = [];
let currentQuestionIndex = 0;
let score = 0;
let answered = false;

let questions = []; // Load questions from JSON file

// Function to load questions from a JSON file
async function loadQuestions() {
  try {
    const response = await fetch("questions.json");
    questions = await response.json();
    shuffleQuestions();
    displayQuestion();
  } catch (error) {
    console.error("Error loading questions:", error);
  }
}

loadQuestions();

function shuffleQuestions() {
  questionsOrder = [...Array(questions.length).keys()];
  for (let i = questionsOrder.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questionsOrder[i], questionsOrder[j]] = [
      questionsOrder[j],
      questionsOrder[i],
    ];
  }
}

function displayQuestion() {
  const currentQuestion = questions[questionsOrder[currentQuestionIndex]];
  const answersHTML = currentQuestion.answers
    .map((answer, index) => {
      return `<input type="checkbox" name="answer${index}" value="${index}">${answer}<br>`;
    })
    .join("");

  questionContainer.innerHTML = `
    <p>${currentQuestion.questionText}</p>
    <form>${answersHTML}</form>
  `;

  result.innerHTML = "";
  nextButton.style.display = "none";
  answered = false;
}

submitButton.addEventListener("click", () => {
  if (answered) return;

  const currentQuestion = questions[questionsOrder[currentQuestionIndex]];
  const selectedAnswers = Array.from(
    document.querySelectorAll("input[type=checkbox]:checked")
  ).map((input) => parseInt(input.value));

  const isCorrect =
    JSON.stringify(selectedAnswers.sort()) ===
    JSON.stringify(currentQuestion.correctAnswers.sort());

  if (isCorrect) {
    score++;
    result.innerHTML = "<p>Correct!</p>";
  } else {
    result.innerHTML = `<p>Incorrect. The correct answers are: ${currentQuestion.correctAnswers
      .map((index) => currentQuestion.answers[index])
      .join(", ")}</p>`;
  }

  nextButton.style.display = "block";
  answered = true;
});

nextButton.addEventListener("click", () => {
  currentQuestionIndex++;

  if (currentQuestionIndex < questionsOrder.length) {
    displayQuestion();
  } else {
    currentQuestionIndex = 0;
    shuffleQuestions();
    displayQuestion();
    result.innerHTML = `<p>Your score: ${score} out of ${questions.length}</p>`;
  }
});
