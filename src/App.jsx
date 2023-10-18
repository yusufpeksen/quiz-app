import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameFinished , setGameFinished] = useState(false)
  const [questions, setQuestions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [trueAnswers, setTrueAnswers] = useState(0);
  const [falseAnswers, setFalseAnswers] = useState(0);

  useEffect(() => {
    axios
      .get(
        "https://opentdb.com/api.php?amount=10&category=21&difficulty=easy&type=multiple"
      )
      .then((response) => {
        setQuestions(response.data.results);
      });
  }, []);

  useEffect(() => {
    if (questions.length > 0) {
      pushAnswers(questions);
    }
  }, [questions]);

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function pushAnswers(questions) {
    const updatedAnswers = [];
    
    questions.forEach((question) => {
      const array = [];

      array.push(question.correct_answer);
      question.incorrect_answers.forEach((answer) => {
        array.push(answer);
      });

      updatedAnswers.push(shuffleArray(array));
    });

    setAnswers(updatedAnswers);
  }

  function gameStart() {
    setGameStarted(true);
  }

  function increaseQuestionIndex() {
    setQuestionIndex(questionIndex + 1);
  }

  const handleRadioChange = (e) => {
    setSelectedAnswer(e.target.value);
  };

  function handleSubmit() {
    if (selectedAnswer) {
      if (selectedAnswer === questions[questionIndex].correct_answer) {
        setTrueAnswers(trueAnswers + 1);
      } else {
        setFalseAnswers(falseAnswers + 1);
      }
      setSelectedAnswer(''); // Seçilen yanıtı sıfırla
      if (questionIndex + 1 < questions.length) {
        increaseQuestionIndex();
      } else {
        // Tüm soruları cevapladıysanız, oyunu tamamlayın veya baştan başlayın.
        setGameFinished(true);
      }
    } else {
      console.log("Seçim yapınız");
    }
  }

  return (
    <div
      className={
        "max-[600px]:w-[300px] flex flex-col items-center justify-center bg-[#2a9d8f] rounded-[10px] w-[700px] transition-all duration-500 " +
        (gameStarted ? "h-[600px]" : "h-[500px]")
      }
    >
      {!gameStarted && (
        <>
          <h1 className="max-[600px]:text-[30px] text-center text-white text-[50px] font-bold tracking-[0.5px]">
            Welcome to QuizApp!
          </h1>
          <p className="text-center w-[60%] text-[#e9c46a] mt-[20px] text-[18px]">
            You are going to see 10 questions about 'Sports'. No time limit.
            Difficulty 'Easy'. If you want to start click 'Start' button.
          </p>
          <button
            onClick={gameStart}
            className="bg-[#f4a261] text-[20px] py-[5px] px-[30px] rounded-[20px] text-center mt-[20px] text-white transition-colors duration-300 hover-bg-[#bf7f4a] float-right"
          >
            Start
          </button>
        </>
      )}

      {gameStarted && !gameFinished && (
        <div className="max-[600px]:static relative ">
          <span className="max-[600px]:top-[50px] max-[600px]:right-[60px] absolute -top-[100px] right-[20px] text-white text-[18px]">
            Score: {trueAnswers} / {questions.length}
          </span>
          <div className="w-[600px] mx-auto">
            <h2 className="max-[600px]:text-[20px] max-[600px]:w-[200px] max-[600px]:mx-auto text-center text-white text-[25px]" dangerouslySetInnerHTML={{ __html: `Q${questionIndex + 1} - ${questions[questionIndex].question}` }}>
            </h2>
            {answers[questionIndex].map((answer, index) => (
              <div key={index} className="flex flex-col gap-4">
                <label className="text-[20px] mt-[7px] text-center">
                  <input
                    className="mr-[15px]"
                    onChange={handleRadioChange}
                    checked={selectedAnswer === answer}
                    type="radio"
                    name="answer"
                    value={answer}
                  />
                  {answer}
                </label>
              </div>
            ))}
          </div>
          <button
            onClick={handleSubmit}
            className="max-[600px]:right-[130px] bg-[#f4a261] text-[20px] py-[5px] px-[30px] rounded-[20px] text-center mt-[20px] text-white transition-colors duration-300 absolute right-[50px] hover-bg-[#bf7f4a]"
          >
            Next
          </button>
        </div>
      )}

      {gameFinished &&
        <div>
          <p className="text-white text-[30px] text-center">Congratulations , you finished all questions. Your score is : {trueAnswers} / {questions.length}</p>
        </div>
      }

    </div>
  );
}

export default App;
