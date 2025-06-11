'use client'

import { Coin } from "@/components/Coin";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useParams } from 'next/navigation';

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
      setScore(prev => prev + 1);
    }
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
    } else {
      router.push(`/quiz/${id}/results?score=${score}`);
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
          <video 
            className="max-h-60 w-full mx-auto"
            controls
            src={currentQuestion.media_url}
          />
        );
      case 'audio':
        return (
          <audio 
            className="w-full"
            controls
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
          <p onClick={handleBack} className="uppercase text-md ml-2">назад</p>
        </div>
        <div className="flex">
          <p className="mr-2">{user?.total_score || 0}</p>
          <Coin />
        </div>
      </header>

      <main className={`flex flex-col mx-4 ${isMainVisible ? "" : "hidden"}`}>
        <section>
          <div className="relative border-2 border-white w-full bg-white">
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
                    <p className="mr-2 text-xs text-black ">{quiz.max_score}</p>
                    <Coin />
                  </div>
                </div>    
              </div>
              <div className="py-2">
                <h2 className="text-black text-xs mb-1">Соавтор</h2>
                <div className="flex items-center">
                  <Image 
                    className="w-8 h-8 rounded-full object-cover" 
                    src={quiz.collaborator_logo || "/placeholder.png"} 
                    alt="Collaborator logo" 
                    width={32} 
                    height={32} 
                  />
                  <h2 className="uppercase text-black text-xs ml-2">{quiz.collaborator_name}</h2>
                </div>
              </div>
              <p className="text-black text-xs">{quiz.description}</p>
              
              <button 
                className="bg-[#0100BE] px-4 py-2 w-full mt-2 text-white"
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
          <div className="relative border-2 border-white w-full bg-white px-2 py-4">
            <div className="flex items-center border-b border-black">
              <div className="w-full h-6 flex items-center text-black mb-2">
                <p className="uppercase px-2 text-xl py-1">
                  {currentQuestionIndex + 1}/{questions.length}
                </p>
              </div>
              <div className="w-full h-8 flex items-center mb-2">
                {Array.from({ length: currentQuestionIndex + 1 }).map((_, index) => (
                  <span 
                    key={index} 
                    className="bg-[#010089] h-6 w-4 border-b border-[#4D77FF] border-2 border-r"
                  />
                ))}
              </div>
            </div>
            
            <div className="px-2 py-2">
              <h3 className="uppercase text-xl mt-1 text-black break-words mb-2 text-center">
                {currentQuestion?.text}
              </h3>
              
              {renderMediaContent()}
              
              <div className="mt-4 space-y-2">
                {currentQuestion?.answers.map(answer => (
                  <button 
                    key={answer.id}
                    onClick={() => !selectedAnswer && handleAnswerSelect(answer.id, answer.is_correct)}
                    className={`
                      w-full py-3 px-4 text-left
                      ${selectedAnswer === answer.id 
                        ? answer.is_correct 
                          ? 'bg-green-100 border-2 border-green-500' 
                          : 'bg-red-100 border-2 border-red-500'
                        : 'bg-gray-200 hover:bg-gray-300'
                      }
                      text-black rounded-lg transition-colors
                    `}
                  >
                    {answer.text}
                  </button>
                ))}
              </div>

              {selectedAnswer && (
                <button
                  onClick={goToNextQuestion}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-white mt-4"
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