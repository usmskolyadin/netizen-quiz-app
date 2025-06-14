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
  categories: { name: string; id: number; quiz_id: number }[];

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
  const [userResults, setUserResults] = useState<{ quiz_id: number; score: number }[]>([]);
  const [totalQuestions, setTotalQuestions] = useState<number>(0);

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null || currentQuestion === undefined) return;

    setAnswerSubmitted(true);

    const selected = currentQuestion.answers.find(a => a.id === selectedAnswer);
    if (selected?.is_correct) {
      setIsCorrect(true);
      setScore(prev => prev + currentQuestion.points);
    } else {
      setIsCorrect(false);
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
    const fetchUserResults = async () => {
      if (!user?.id) return;

      try {
        const res = await axios.get(`/api/results?user_id=${user.id}`);
        setUserResults(res.data);
      } catch (err) {
        console.error("Ошибка при получении результатов:", err);
      }
    };

    fetchUserResults();
  }, [user?.id]);

  useEffect(() => {
    if (isFinished && user && quiz) {
      const sendResult = async () => {
        try {
          await axios.post(`https://netizenworld.ru/tma/quizes/${quiz.id}/results`, {
            user_id: user.id,
            score,
          });

          const updatedUser = await axios.get(`/api/register?tg_id=${user.id}`);
          setUser({
            id: updatedUser.data.id,
            total_score: updatedUser.data.total_score,
          });

          console.log('Результат успешно отправлен и total_score обновлён');
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
      setTotalQuestions(response.data.length);
      setAnswerSubmitted(false);
    } catch (err) {
      setError('Failed to load questions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRestart = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`https://netizenworld.ru/tma/tma/quizes/${id}/questions`);
      setQuestions(response.data);
      setMainVisible(true);
      setIsFinished(false);
      setTotalQuestions(response.data.length);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setCurrentQuestionIndex(0);
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
                onClick={handleRestart}
                  className="bg-[#AAAAAA] text-lg px-4 py-3 w-full mt-2 text-white"
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
            <div className="w-full h-6 py-4 bg-[#010089] items-center flex justify-between">
              <p className="uppercase px-2 text-md py-1">{quiz.categories.map(cat => cat.name).join(', ')}</p>
              <svg className="mx-2" width="55" height="20" viewBox="0 0 45 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M45 14V0L31.2091 0V14H45Z" fill="#C0C0C0"/>
                        <path d="M44.2344 0.773686V13.1895L44.9965 14V0L44.2344 0.773686Z" fill="#2A2927"/>
                        <path d="M44.2344 0.770765V13.1866L44.6336 13.5918V0.402344L44.2344 0.770765Z" fill="#4C4C4C"/>
                        <path d="M44.2358 0.773686L44.9979 0H31.207L32.0054 0.773686H44.2358Z" fill="#E6E6E6"/>
                        <path d="M44.239 0.770765L44.6382 0.402344H31.6094L32.0086 0.770765H44.239Z" fill="#F2F2F2"/>
                        <path d="M32.0054 13.1895V0.773686L31.207 0V14L32.0054 13.1895Z" fill="#E6E6E6"/>
                        <path d="M32.0086 13.1866V0.770765L31.6094 0.402344V13.5918L32.0086 13.1866Z" fill="#F2F2F2"/>
                        <path d="M32.0054 13.1836L31.207 13.9941H44.9979L44.2358 13.1836H32.0054Z" fill="#2A2927"/>
                        <path d="M32.0086 13.1836L31.6094 13.5889H44.6382L44.239 13.1836H32.0086Z" fill="#4C4C4C"/>
                        <path d="M44.2343 0.773438H32.0039V13.1892H44.2343V0.773438Z" fill="#C0C0C0"/>
                        <path d="M41.3026 2.97517L34.1172 10.2695L34.8871 11.0511L42.0725 3.75671L41.3026 2.97517Z" fill="#1D1D1B"/>
                        <path d="M34.8871 2.98018L34.1172 3.76172L41.3026 11.0561L42.0725 10.2745L34.8871 2.98018Z" fill="#1D1D1B"/>
                        <path d="M29.3945 14V0L15.6036 0V14H29.3945Z" fill="#C0C0C0"/>
                        <path d="M28.6328 0.773686V13.1895L29.3949 14V0L28.6328 0.773686Z" fill="#2A2927"/>
                        <path d="M28.6328 0.770765V13.1866L29.032 13.5918V0.402344L28.6328 0.770765Z" fill="#4C4C4C"/>
                        <path d="M28.6304 0.773686L29.3925 0H15.6016L16.4 0.773686H28.6304Z" fill="#E6E6E6"/>
                        <path d="M28.6374 0.770765L29.0366 0.402344H16.0078L16.407 0.770765H28.6374Z" fill="#F2F2F2"/>
                        <path d="M16.4 13.1895V0.773686L15.6016 0V14L16.4 13.1895Z" fill="#E6E6E6"/>
                        <path d="M16.407 13.1866V0.770765L16.0078 0.402344V13.5918L16.407 13.1866Z" fill="#F2F2F2"/>
                        <path d="M16.4 13.1836L15.6016 13.9941H29.3925L28.6304 13.1836H16.4Z" fill="#2A2927"/>
                        <path d="M16.407 13.1836L16.0078 13.5889H29.0366L28.6374 13.1836H16.407Z" fill="#4C4C4C"/>
                        <path d="M28.6327 0.773438H16.4023V13.1892H28.6327V0.773438Z" fill="#C0C0C0"/>
                        <path d="M26.6378 11.1969H18.3633V2.79688H26.6378V11.1969ZM19.452 10.0916H25.5491V3.90214H19.452V10.0916Z" fill="#1D1D1B"/>
                        <path d="M26.096 3.34766H18.9102V4.74765H26.096V3.34766Z" fill="#1D1D1B"/>
                        <path d="M13.793 14V0L0.00205231 0V14H13.793Z" fill="#C0C0C0"/>
                        <path d="M13.0273 0.773686V13.1895L13.7895 14V0L13.0273 0.773686Z" fill="#2A2927"/>
                        <path d="M13.0273 0.770765V13.1866L13.4265 13.5918V0.402344L13.0273 0.770765Z" fill="#4C4C4C"/>
                        <path d="M13.0288 0.773686L13.7909 0H0L0.798404 0.773686H13.0288Z" fill="#E6E6E6"/>
                        <path d="M13.028 0.770765L13.4272 0.402344H0.398438L0.797639 0.770765H13.028Z" fill="#F2F2F2"/>
                        <path d="M0.798404 13.1895V0.773686L0 0V14L0.798404 13.1895Z" fill="#E6E6E6"/>
                        <path d="M0.797639 13.1866V0.770765L0.398438 0.402344V13.5918L0.797639 13.1866Z" fill="#F2F2F2"/>
                        <path d="M0.798404 13.1836L0 13.9941H13.7909L13.0288 13.1836H0.798404Z" fill="#2A2927"/>
                        <path d="M0.797639 13.1836L0.398438 13.5889H13.4272L13.028 13.1836H0.797639Z" fill="#4C4C4C"/>
                        <path d="M13.0234 0.773438H0.792969V13.1892H13.0234V0.773438Z" fill="#C0C0C0"/>
                        <path d="M9.51115 9.90625H4.28516V11.3799H9.51115V9.90625Z" fill="#1D1D1B"/>
                      </svg>
            </div>
            <Image 
              className="max-h-36 object-cover" 
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
              {quiz.collaborator_name !== "string" && (
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
              )}
              <p className="text-gray-800 text-md">{quiz.description}</p>
              
              <div className="flex justify-center my-4">
                <svg className="mr-2" width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="24" height="24" fill="#25CE16"/>
                  <path d="M18 6V7.5H16.5V9H15V10.5H13.5V12H12V13.5H10.5V15H9.75V15.75H8.25V15H7.5V13.5H6V12.75H4.5V15H6V16.5H7.5V18H8.25V18.75H9.75V18H10.5V16.5H12V15H13.5V13.5H15V12H16.5V10.5H18V9H19.5V6H18Z" fill="white"/>
                </svg>
                <p className="text-black text-lg">ПРОЙДЕНО 0/{questions.length}</p>
              </div>

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
                  {currentQuestionIndex < questions.length - 1 ? 'Далее' : 'Завершить квиз'}
                </button>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}