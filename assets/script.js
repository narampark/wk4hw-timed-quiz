// array of questions and its corresponding answer choices
const questions = [
  {
    // correct property given to each answer with the correct answer given "true"
    question: "Inside which HTML element do we put the JavaScript?",
    answers: [
      { text: "&lt;js&gt;", correct: false },
      { text: "&lt;java&gt;", correct: false },
      { text: "&lt;javascript&gt;", correct: false },
      { text: "&lt;script&gt;", correct: true },
    ],
  },
  {
    question: "Which of these is not a data type in JavaScript?",
    answers: [
      { text: "Primitive", correct: false },
      { text: "Number", correct: false },
      { text: "Boolean", correct: false },
      { text: "Defined", correct: true },
    ],
  },
  {
    question: "What does DOM stand for?",
    answers: [
      { text: "Document Orient Model", correct: false },
      { text: "Document Object Model", correct: true },
      { text: "Dynamic Object Model", correct: false },
      { text: "Document Object Manager", correct: false },
    ],
  },
  {
    question: "Which of the following means strict equality in JavaScript?",
    answers: [
      { text: "!==", correct: false },
      { text: "===", correct: true },
      { text: "==", correct: false },
      { text: "!=", correct: false },
    ],
  },
  {
    question: "How do you add a comment in JavaScript?",
    answers: [
      { text: "// comment", correct: true },
      { text: "*/ comment /*", correct: false },
      { text: "-- comment --", correct: false },
      { text: "// comment //", correct: false },
    ],
  },
  {
    question: "What does addEventListener() do?",
    answers: [
      { text: "Calls up a function in the Javascript", correct: false },
      { text: "Adds a new HTML element", correct: false },
      { text: "Adds styling to the CSS", correct: false },
      { text: "Adds an event listener to an HTML element", correct: true },
    ],
  },
  {
    question:
      "Which data type represents a collection of key-value pairs in JavaScript?",
    answers: [
      { text: "Object", correct: true },
      { text: "Array", correct: false },
      { text: "String", correct: false },
      { text: "Function", correct: false },
    ],
  },
  {
    question: "Which data type is used to represent a sequence of characters?",
    answers: [
      { text: "String", correct: true },
      { text: "Array", correct: false },
      { text: "Object", correct: false },
      { text: "Function", correct: false },
    ],
  },
  {
    question: "What does event.preventDefault() method do?",
    answers: [
      { text: "Cancel the defualt behavior of an event", correct: true },
      { text: "Trigger an event", correct: false },
      { text: "Store an event in local storage", correct: false },
      { text: "Stop the propagation of an event", correct: false },
    ],
  },
  {
    question: "What does the querySelector() method do?",
    answers: [
      { text: "Selects elements by class name", correct: false },
      {
        text: "Selects the first element that matches a CSS selector",
        correct: true,
      },
      { text: "Selects elements by their tag name", correct: false },
      { text: "Selects elements by ID name", correct: false },
    ],
  },
];
// the HTML elements that will be changed throughout the quiz
const questionEl = document.getElementById("question");
const answerButtonsEl = document.getElementById("answer-buttons");
const submitButtonEl = document.getElementById("submit-button");
const timerEl = document.getElementById("timer");

// variables to keep track of the quiz's state
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeRemaining = 60;

// function to start the quiz
function startQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  submitButtonEl.innerHTML = "Submit Answer";
  showQuestion();
  // start the timer when the quiz starts
  startTimer();
}

// function to start the timer
function startTimer() {
  timer = setInterval(function () {
    if (timeRemaining <= 0) {
      clearInterval(timer);
      handleTimeUp();
    } else {
      //gives the remaining time on the quiz page
      timerEl.textContent = `Time Remaining: ${timeRemaining} seconds`;
      timeRemaining--;
    }
  }, 1000);
}
// function to stop the timer
function stopTimer() {
  clearInterval(timer);
}

// function to handle when time is up
function handleTimeUp() {
  handleIncorrectAnswer();
  setTimeout(showScore, 1000);
}

// function to deduct 5 seconds from the timer everytime an incorrect answer to a question is given
function handleIncorrectAnswer() {
  timeRemaining -= 5;
  if (timeRemaining < 0) {
    timeRemaining = 0;
  }
  timerEl.textContent = `Time Remaining: ${timeRemaining} seconds`;
}

// function to show the correct question and answer choices as the user goes through the quiz so that only 1 question and 1 set of corresponding choices comes up
function showQuestion() {
  resetState();
  let currentQuestion = questions[currentQuestionIndex];
  let questionNumber = currentQuestionIndex + 1;
  questionEl.innerHTML = questionNumber + ". " + currentQuestion.question;
  currentQuestion.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.innerHTML = answer.text;
    button.classList.add("btn");
    answerButtonsEl.appendChild(button);
    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }
    button.addEventListener("click", selectAnswer);
  });
}
// function to replace the previous question and answers
function resetState() {
  submitButtonEl.style.display = "none";
  while (answerButtonsEl.firstChild) {
    answerButtonsEl.removeChild(answerButtonsEl.firstChild);
  }
}
// the e selects the element that triggered the event
function selectAnswer(e) {
  const selectedButton = e.target;
  const isCorrect = selectedButton.dataset.correct === "true";
  if (isCorrect) {
    selectedButton.classList.add("correct");
    score++;
  } else {
    selectedButton.classList.add("incorrect");
    handleIncorrectAnswer();
  }
  // stops the user from being able to select other choices after they make their choice
  Array.from(answerButtonsEl.children).forEach((button) => {
    if (button.dataset.correct === "true") {
      button.classList.add("correct");
    }
    button.disabled = true;
  });
  submitButtonEl.style.display = "block";
}

// function to tally up the final score and give the prompt to the user to punch in their initials for the highscore list
function showScore() {
  resetState();
  const playerInitials = prompt("Enter initials (2 characters):");
  if (playerInitials && playerInitials.length === 2) {
    const highscores = JSON.parse(localStorage.getItem("highscores")) || [];
    highscores.push({ initials: playerInitials, score });
    localStorage.setItem("highscores", JSON.stringify(highscores));
  }
  questionEl.innerHTML = `Score: ${score}/${questions.length}`;
  // button to allow user to go back to the index.html when the quiz ends
  submitButtonEl.innerHTML = "Go Back";
  submitButtonEl.style.display = "block";
  submitButtonEl.addEventListener("click", () => {
    window.location.href = "index.html";
  });
}

function handleSubmitButton() {
  currentQuestionIndex++;
  // if not at the end of the quiz, show the next question
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    // if at the end, give the score and prompt user name input
    showScore();
  }
}

// add event listener to the submit button
submitButtonEl.addEventListener("click", () => {
  if (currentQuestionIndex < questions.length) {
    handleSubmitButton();
  } else {
    startQuiz();
  }
});

// starts the quiz
startQuiz();
