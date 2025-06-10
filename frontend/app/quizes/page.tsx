"use client";
import { Coin } from "@/components/Coin";
import Tabs from "@/components/Tabs";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import axios from "axios";


export default function AllQuizes() {
  const router = useRouter();
  const [quizes, setQuizes] = useState<any[]>([]);
  const [user, setUser] = useState<{id: number, total_score: number} | null>(null);
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
      const response = await axios.get('/api/quizes');
      setQuizes(response.data);
    };

    fetchQuizes();
  }, []);

  const handleBack = () => {
    router.push('/');
  };

  return (
    <div className="text-white w-full h-screen bg-black relative">
      <div className="absolute w-full inset-0 z-10 pointer-events-none">
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
          <p onClick={handleBack} className="uppercase text-md ml-2 cursor-pointer">назад</p>
        </div>
        <div className="flex">
          <p className="mr-2">{user?.total_score || 0}</p>
          <Coin />
        </div>
      </header>

      <main className="flex flex-col mx-4">
        <section>
          <div className="flex justify-between">
            <h1 className="text-xl uppercase">Квизы</h1>
          </div>
          <div className="min-h-[200px]">
            <Tabs />
          </div>
        </section>
      </main>
    </div>
  );
}
