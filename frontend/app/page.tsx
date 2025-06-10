'use client'

import { Coin } from "@/components/Coin";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import Slider from "@/components/Slider";

interface Quiz {
  id: number;
  title: string;
  description: string;
  image_url: string;
  is_popular: boolean;
  is_new: boolean;
  max_score: number;
  collaborator_name: string;
  collaborator_logo: string;
  collaborator_link: string;
  categories: { name: string; id: number; quiz_id: number }[];
  questions: any[];
  score_ratings: any[];
}

export default function Home() {
  const [user, setUser] = useState<{id: number, total_score: number} | null>(null);
  const [quizes, setQuizes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
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
    const fetchQuizes = async () => {
      try {
        const response = await axios.get('/api/quizes');
        setQuizes(response.data);
      } catch (err) {
        console.error("Error fetching quizes:", err);
        setError("Failed to load quizes");
      } finally {
        setLoading(false);
      }
    };

    fetchQuizes();
  }, []);

  if (loading) {
    return <div className="w-full text-white min-h-screen bg-black flex items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="w-full text-white min-h-screen bg-black flex items-center justify-center">{error}</div>;
  }

  return (
    <div className="w-full text-white min-h-screen bg-black relative">
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
        <h1 className="text-2xl uppercase">NETQUIZE</h1>
        <div className="flex">
          <p className="mr-2">{user?.total_score || 0}</p>
          <Coin />
        </div>
      </header>
      <main className="flex flex-col mx-4">
        <Slider quizes={quizes} />
        <section className="my-4">
          <div className="flex justify-between">
            <h1 className="text-2xl uppercase">Квизы</h1>
            <div className="flex justify-between items-center">
              <p className="uppercase text-md mr-2"><Link href="/quizes/">Все</Link></p>
              <svg width="12" height="21" viewBox="0 0 12 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 9.5V8.5H10V7.5H8V5.5H6V3.5H4V1.5H2V0.5H0V3.5H2V5.5H4V7.5H6V9.5H8V11.5H6V13.5H4V15.5H2V17.5H0V20.5H2V19.5H4V17.5H6V16.5V15.5H8V14.5V13.5H10V12.5H11V11.5H12V10.5V9.5H11Z" fill="#EDEDED"/>
              </svg>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-5 mt-3">
            {quizes.map((quiz) => (
              <Link key={quiz.id} href={`/quizes/${quiz.id}`}>
                <div className="relative border-2 border-white w-full">
                  <div className="w-full h-6 bg-[#010089]">
                    <p className="uppercase px-2 text-xs py-1">
                      {quiz.categories.map(cat => cat.name).join(', ')}
                    </p>
                  </div>
                  <Image 
                    className="h-40 object-cover" 
                    src={quiz.image_url || "/placeholder.png"} 
                    alt={quiz.title} 
                    width={1000} 
                    height={100}
                    priority
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.8),transparent)]" />
                  <div className="absolute bottom-2 left-2">
                    {quiz.is_new && <h3 className="uppercase text-md font-medium text-[#F97316]">Новинка</h3>}
                    <h3 className="uppercase text-md mt-1 break-words w-40">{quiz.title}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}