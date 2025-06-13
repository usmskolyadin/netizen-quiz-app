'use client'

import { Coin } from "@/components/Coin";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useParams } from 'next/navigation';
import { CustomVideoPlayer } from "@/components/CustomVideoPlayer";
import CustomAudioPlayer from "@/components/CustomAudioPlayer";

type QuizBasic = {
  id: number;
  title: string;
  description: string;
  image_url: string;
  is_popular?: boolean;
  is_new?: boolean;
  max_score: number;
  collaborator_name?: string;
  collaborator_logo?: string;
  collaborator_link?: string;
}

type Question = {
  id: number;
  text: string;
  question_type: string;
  presentation_type: string;
  media_url: string | null;
  explanation: string;
  points: number;
  answers: {
    id: number;
    text: string;
    is_correct: boolean;
  }[];
}

export default function Detail() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quiz, setQuiz] = useState<QuizBasic | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [isMainVisible, setMainVisible] = useState(true);
  const [user, setUser] = useState<{id: number, total_score: number} | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);

  const handleSubmitAnswer = () => {
    setAnswerSubmitted(true);
    if (isCorrect) {
      setScore(prev => prev + currentQuestion.points);
    }
  };
  
  useEffect(() => {
    const initUser = async () => {
      const tg = (window as any).Telegram.WebApp;
      const user = tg?.initDataUnsafe?.user;

      if (user?.id) {
        try {
          const response = await axios.get(`/api/register?tg_id=${user.id}`);
          setUser({
            id: response.data.id,
            total_score: response.data.total_score || 0
          });
        } catch (error) {
          console.error("Error fetching user:", error);
          setUser({
            id: user.id,
            total_score: 0
          });
        }
      }
    };

    initUser();
  }, []);

  useEffect(() => {
    if (isFinished && user && quiz) {
      const sendResult = async () => {
        try {
          await axios.post('https://netizenworld.ru/tma/tma/results/', {
            quiz: quiz.id,
            user: user.id,
            score,
          });
          console.log('Результат успешно отправлен');
        } catch (err) {
          console.error('Ошибка при отправке результата:', err);
        }
      };

      sendResult();
    }
  }, [isFinished, user, quiz, score]);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(`https://netizenworld.ru/tma/tma/quizes/${id}`);
        setQuiz(response.data);
      } catch (err) {
        setError('Failed to load quiz');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchQuiz();
    }
  }, [id]);

  const handleStart = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://netizenworld.ru/tma/tma/quizes/${id}/questions`);
      setQuestions(response.data);
      setMainVisible(false);
      setIsFinished(false);
      setSelectedAnswer(null);
      setIsCorrect(null);
    } catch (err) {
      setError('Failed to load questions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSelect = (answerId: number, isCorrect: boolean) => {
    setSelectedAnswer(answerId);
    setIsCorrect(isCorrect);
    if (isCorrect) {
      setScore(prev => prev + currentQuestion.points);
    }
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setAnswerSubmitted(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleBack = () => {
    router.push('/');
  };

  const renderMediaContent = () => {
    if (!currentQuestion?.media_url) return null;

    switch (currentQuestion.presentation_type) {
      case 'photo':
        return (
          <Image 
            className="max-h-40 object-cover mx-auto"
            src={currentQuestion.media_url}
            alt="Question image"
            width={600}
            height={400}
          />
        );
      case 'video':
        return (
          <CustomVideoPlayer 
            src={currentQuestion.media_url}
          />
        );
      case 'audio':
        return (
          <CustomAudioPlayer 
            src={currentQuestion.media_url}
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return <div className="text-white w-full h-screen bg-black flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-white w-full h-screen bg-black flex items-center justify-center">{error}</div>;
  }

  if (!quiz) {
    return <div className="text-white w-full h-screen bg-black flex items-center justify-center">Quiz not found</div>;
  }

  if (isFinished) {
    return (

      <div className="text-white w-full h-full min-h-screen bg-black relative">
        <div className="absolute inset-0 z-10 pointer-events-none">
          <Image 
            src="/telek.png" 
            alt="Decorative overlay"
            fill
            priority
            quality={100}
            className="object-cover opacity-35"
          />
        </div>
        <header className="flex py-5 items-center text-white justify-between mx-4">
          <div className="flex justify-between items-center">
            <svg width="12" height="21" viewBox="0 0 12 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 0.5V1.5H8V3.5H6V5.5H4V7.5H2V8.5H1V9.5H0V11.5H1V12.5H2V13.5H4V15.5H6V17.5H7H8V18.5V19.5H10V20.5H12V17.5H10V15.5H8V13.5H6V11.5H4V9.5H6V7.5H8V5.5H10V3.5H12V0.5H10Z" fill="white"/>
            </svg>
            <p onClick={handleBack} className="uppercase text-md ml-2">на главную</p>
          </div>
          <div className="flex">
            <p className="mr-2">{user?.total_score || 0}</p>
            <Coin />
          </div>
        </header>
        <main className={`flex flex-col mx-4`}>
          <section>
            <div className="relative border-2 border-white w-full bg-[#C0C0C0]">
              <div className="flex items-center border-b border-black mt-2 mx-2">
              <div className="w-full h-6 flex items-center text-black mb-2">
                <p className="uppercase px-2 text-xl py-1">
                  {currentQuestionIndex + 1}/{questions.length}
                </p>
              </div>
              <div
                style={{
                  borderTop: '3px solid #293133',
                  borderLeft: '3px solid #293133',
                  borderRight: '3px solid white',
                  borderBottom: '3px solid white'
                }} 
                className="w-full h-7 flex items-center mb-2"
              >
                {Array.from({ length: 12 }).map((_, index) => {
                  const filledSteps = Math.round(((currentQuestionIndex + 1) / questions.length) * 12);
                  return (
                    <span
                      key={index}
                      className={`bg-[#010089] h-6 w-4 " ${
                        index < filledSteps ? 'bg-[#010089] border-b border-[#4D77FF] border-1   border-r' : 'bg-transparent'
                      }`}
                    />
                  );
                })}
              </div>
            </div>
              <div className="px-2 py-2 flex flex-col items-center">
                <div className="items-center flex justify-between">
                  <h3 className="uppercase text-2xl my-2 text-[#25CE16] break-words">ПОЗДРАВЛЯЕМ!</h3> 
                </div>
                <div className="py-1">
                  <h2 className="text-black text-md mb-1">Вы прошли квиз</h2>
                </div>
                <div className="items-center flex justify-between py-2">
                  <h3 className="uppercase text-2xl mt-1 font-medium text-black break-words">{quiz.title}</h3> 
                </div>
                <div className="py-2">
                  <h2 className="text-black text-md">Награда:</h2>
                </div>


                <div className="py-4 flex items-center">
                  <h2 className="text-black text-lg mr-1">{score}</h2>
                  <Coin />
                </div>
                
                
                <button 
                  className="bg-[#0100BE] text-lg px-4 py-3 w-full mb-1 text-white"
                >
                  <a href="/">НА ГЛАВНУЮ</a>
                </button>
                <button 
                  className="bg-[#AAAAAA] text-lg px-4 py-3 w-full mt-2 text-white"
                  onClick={handleStart}
                >
                  ПРОЙТИ ЕЩЕ РАЗ
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="text-white w-full h-full min-h-screen bg-black relative">
      <div className="absolute inset-0 z-10 pointer-events-none">
        <Image 
          src="/telek.png" 
          alt="Decorative overlay"
          fill
          priority
          quality={100}
          className="object-cover opacity-35"
        />
      </div>
      
      <header className="flex py-5 items-center text-white justify-between mx-4">
        <div className="flex justify-between items-center">
          <svg width="12" height="21" viewBox="0 0 12 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 0.5V1.5H8V3.5H6V5.5H4V7.5H2V8.5H1V9.5H0V11.5H1V12.5H2V13.5H4V15.5H6V17.5H7H8V18.5V19.5H10V20.5H12V17.5H10V15.5H8V13.5H6V11.5H4V9.5H6V7.5H8V5.5H10V3.5H12V0.5H10Z" fill="white"/>
          </svg>
          <p onClick={handleBack} className="uppercase text-md ml-2">на главную</p>
        </div>
        <div className="flex">
          <p className="mr-2">{user?.total_score || 0}</p>
          <Coin />
        </div>
      </header>

      <main className={`flex flex-col mx-4 ${isMainVisible ? "" : "hidden"}`}>
        <section>
          <div className="relative border-2 border-white w-full bg-[#C0C0C0]">
            <div className="w-full h-6 bg-[#010089]">
              <p className="uppercase px-2 text-xs py-1">Музыка</p>
            </div>
            <Image 
              className="max-h-40 object-cover" 
              src={quiz.image_url} 
              alt="Quiz cover" 
              width={1000} 
              height={400}
            />
            <div className="absolute max-h-46 inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.8),transparent)]" />
            <div className="px-2 py-2">
              <div className="items-center flex justify-between">
                <h3 className="uppercase text-xl mt-1 text-black break-words w-64">{quiz.title}</h3>
                <div className="bg-[#CECECE] max-h-10">
                  <div className="flex items-center py-2 px-2">
                    <p className="mr-2 text-lg text-black ">{quiz.max_score}</p>
                    <Coin />
                  </div>
                </div>    
              </div>
              <div className="py-2">
                <h2 className="text-black text-lg mb-1">Соавтор</h2>
                <div className="flex items-center">
                  <Image 
                    className="w-8 h-8 rounded-full object-cover" 
                    src={quiz.collaborator_logo || "/placeholder.png"} 
                    alt="Collaborator logo" 
                    width={32} 
                    height={32} 
                  />
                  <h2 className="uppercase text-black text-lg ml-2">{quiz.collaborator_name}</h2>
                </div>
              </div>
              <p className="text-black text-lg">{quiz.description}</p>
              
              <button 
                className="bg-[#0100BE] text-lg px-4 py-3 w-full mt-2 text-white"
                onClick={handleStart}
              >
                Пройти
              </button>
            </div>
          </div>
        </section>
      </main>

      <main className={`flex flex-col mx-4 ${isMainVisible ? "hidden" : ""}`}>
        <section>
          <div className="relative border-2 border-white w-full bg-[#C0C0C0] px-2 py-4">
            <div className="flex items-center border-b border-black">
              <div className="w-full h-6 flex items-center text-black mb-2">
                <p className="uppercase px-2 text-xl py-1">
                  {currentQuestionIndex + 1}/{questions.length}
                </p>
              </div>
              <div
                style={{
                  borderTop: '3px solid #293133',
                  borderLeft: '3px solid #293133',
                  borderRight: '3px solid white',
                  borderBottom: '3px solid white'
                }} 
                className="w-full h-7 flex items-center mb-2"
              >
                {Array.from({ length: 12 }).map((_, index) => {
                  const filledSteps = Math.round(((currentQuestionIndex + 1) / questions.length) * 12);
                  return (
                    <span
                      key={index}
                      className={`bg-[#010089] h-6 w-4 " ${
                        index < filledSteps ? 'bg-[#010089] border-b border-[#4D77FF] border-1   border-r' : 'bg-transparent'
                      }`}
                    />
                  );
                })}
              </div>
            </div>
            
            <div className="px-2 py-2">
              <h3 className="uppercase text-xl mt-1 text-black break-words mb-2 text-center">
                {currentQuestion?.text}
              </h3>
              
              {renderMediaContent()}
              
              <div className="mt-6 space-y-2">
                {currentQuestion?.answers.map(answer => {
                  const isSelected = selectedAnswer === answer.id;
                  const isSubmitted = answerSubmitted;

                  let bgColor = 'bg-gray-200 hover:bg-gray-300';
                  let textColor = 'text-black';
                  let border = '';

                  if (isSubmitted && isSelected) {
                    if (answer.is_correct) {
                      bgColor = 'bg-[#25CE16]';
                      border = 'border-2 border-[#25CE16]';
                    } else {
                      bgColor = 'bg-[#E2302A]';
                      border = 'border-2 border-red-500';
                    }
                  } else if (isSelected) {
                    bgColor = 'bg-blue-200';
                    textColor = 'text-blue-900';
                  }

                  return (
                    <button
                      key={answer.id}
                      onClick={() => !answerSubmitted && setSelectedAnswer(answer.id)}
                      style={{
                        borderTop: '3.5px solid white',
                        borderLeft: '3.5px solid white',
                        borderRight: '3.5px solid #293133',
                        borderBottom: '3.5px solid #293133',
                      }}
                      className={`w-full py-3 px-4 text-lg flex justify-center ${bgColor} ${border} ${textColor} transition-colors`}
                    >
                      {answer.text}
                    </button>
                  );
                })}
              </div>
              
              {answerSubmitted && selectedAnswer !== null && !isCorrect && (
                <div className="mt-4 text-lg text-black rounded flex justify-center">
                  <h1>{currentQuestion.explanation}</h1>
                </div>
              )}
              {!answerSubmitted ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={selectedAnswer === null}
                  className={`w-full py-3.5 text-lg my-2 font-medium mt-6 transition-colors ${selectedAnswer !== null ? 'bg-[#0100BE] text-white hover:bg-blue-900' : 'bg-gray-400 text-white cursor-not-allowed'}`}
                >
                  Ответить
                </button>
              ) : (
                <button
                  onClick={goToNextQuestion}
                  className="w-full py-3.5 bg-[#0100BE] hover:bg-blue-900 text-lg my-2 font-medium text-white mt-6"
                >
                  {currentQuestionIndex < questions.length - 1 ? 'Следующий вопрос' : 'Завершить квиз'}
                </button>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}