'use client'

import { useEffect, useState } from 'react'
import { QuizeItem } from './QuizeItem'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'

export default function Tabs() {
  const [activeTab, setActiveTab] = useState(1)

  const tabs = [
    { id: 1, title: 'Музыка' },
    { id: 2, title: 'Мода' },
    { id: 3, title: 'Искусство' }
  ]
  
  const [quizes, setQuizes] = useState<any[]>([]);

  useEffect(() => {
    const fetchQuizes = async () => {
      const response = await axios.get('/api/quizes');
      setQuizes(response.data);
    };

    fetchQuizes();
  }, []);

  return (
    <div className="">
      <div className="flex border-b border-gray-200">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-2 px-4 cursor-pointer font-medium text-sm focus:outline-none ${
              activeTab === tab.id
                ? 'border-b-2 border-[#6CED52] text-[#6CED52]'
                : 'text-white hover:text-gray-200'
            }`}
          >
            {tab.title}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 my-4">
        {quizes.map((quiz) => {
          return (
            <Link href={`/quizes/${quiz.id}`}>
              <div key={quiz.id} className="relative border-2 border-white w-full">
                <div className="w-full h-6 bg-[#010089]">
                  <p className="uppercase px-2 text-xs py-1">{quiz.categories?.[0]?.name || "Категория"}</p>
                </div>
                <Image className="h-40 object-cover" src={quiz.image_url || "/placeholder.png"} alt={quiz.title} width={1000} height={100} />
                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.8),transparent)]" />
                <div className="absolute bottom-2 left-2 ">
                  {quiz.is_new && <h3 className="uppercase text-xs text-[#F97316]">Новинка</h3>}
                  <h3 className="uppercase text-md mt-1 break-words w-40">{quiz.title}</h3>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}