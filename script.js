const quizData = [
  {
    question: "What is the capital of France?",
    choices: ["Madrid", "Paris", "Berlin", "Rome"],
    answer: "Paris"
  },
  {
    question: "What does HTML stand for?",
    choices: [
      "Hyper Trainer Marking Language",
      "Hyper Text Marketing Language",
      "Hyper Text Markup Language",
      "Hyper Tool Markup Language"
    ],
    answer: "Hyper Text Markup Language"
  },
  {
    question: "Which language runs in a web browser?",
    choices: ["Python", "C", "Java", "JavaScript"],
    answer: "JavaScript"
  },
  {
    question: "What year was JavaScript launched?",
    choices: ["1996", "1995", "1994", "1997"],
    answer: "1995"
  },
  {
    question: "Which company developed JavaScript?",
    choices: ["Google", "Netscape", "Microsoft", "Apple"],
    answer: "Netscape"
  }
];

let shuffledQuiz = [];
let currentQuestion = 0;
let score = 0;
let userAnswers = [];
let timerInterval;
let timeLeft = 10;

const questionEl = document.getElementById('question');
const answersEl = document.getElementById('answers');
const nextBtn = document.getElementById('next-btn');
const questionNumberEl = document.getElementById('question-number');
const quizContainer = document.getElementById('quiz');
const resultContainer = document.getElementById('result');
const scoreEl = document.getElementById('score');
const summaryEl = document.getElementById('summary');
const progressBar = document.getElementById('progress-bar');
const timerEl = document.getElementById('time-left');

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

function startQuiz() {
  shuffledQuiz = shuffleArray([...quizData]);
  currentQuestion = 0;
  score = 0;
  userAnswers = [];
  loadQuestion();
}

function loadQuestion() {
  clearInterval(timerInterval);
  timeLeft = 10;
  timerEl.textContent = timeLeft;
  timerInterval = setInterval(() => {
    timeLeft--;
    timerEl.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      autoSelect();
    }
  }, 1000);

  const current = shuffledQuiz[currentQuestion];
  questionEl.textContent = current.question;
  const shuffledChoices = shuffleArray([...current.choices]);
  answersEl.innerHTML = '';

  shuffledChoices.forEach(choice => {
    const li = document.createElement('li');
    li.textContent = choice;
    li.addEventListener('click', () => selectAnswer(li));
    answersEl.appendChild(li);
  });

  questionNumberEl.textContent = `Question ${currentQuestion + 1} of ${shuffledQuiz.length}`;
  nextBtn.disabled = true;
  updateProgress();
}

function selectAnswer(selectedLi) {
  const choices = answersEl.querySelectorAll('li');
  choices.forEach(li => li.classList.remove('selected'));
  selectedLi.classList.add('selected');
  nextBtn.disabled = false;
}

function autoSelect() {
  const choices = answersEl.querySelectorAll('li');
  choices[0].click();
  nextBtn.click();
}

nextBtn.addEventListener('click', () => {
  clearInterval(timerInterval);
  const selected = answersEl.querySelector('.selected');
  if (!selected) return;

  const userAnswer = selected.textContent;
  const correctAnswer = shuffledQuiz[currentQuestion].answer;

  selected.classList.add(userAnswer === correctAnswer ? 'correct' : 'incorrect');
  if (userAnswer === correctAnswer) score++;

  userAnswers.push({
    question: shuffledQuiz[currentQuestion].question,
    userAnswer,
    correctAnswer
  });

  setTimeout(() => {
    currentQuestion++;
    if (currentQuestion < shuffledQuiz.length) {
      loadQuestion();
    } else {
      showResults();
    }
  }, 600);
});

function showResults() {
  clearInterval(timerInterval);
  quizContainer.style.display = 'none';
  resultContainer.style.display = 'block';
  scoreEl.textContent = `Your Score: ${score} out of ${shuffledQuiz.length}`;

  summaryEl.innerHTML = '';
  userAnswers.forEach((item, index) => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>Q${index + 1}:</strong> ${item.question}<br/>
                    <span style="color: ${item.userAnswer === item.correctAnswer ? 'green' : 'red'};">
                    Your Answer: ${item.userAnswer}</span><br/>
                    Correct Answer: ${item.correctAnswer}`;
    summaryEl.appendChild(li);
  });
}

function restartQuiz() {
  resultContainer.style.display = 'none';
  quizContainer.style.display = 'block';
  startQuiz();
}

function updateProgress() {
  const progressPercent = ((currentQuestion) / shuffledQuiz.length) * 100;
  progressBar.style.width = `${progressPercent}%`;
}

startQuiz();

