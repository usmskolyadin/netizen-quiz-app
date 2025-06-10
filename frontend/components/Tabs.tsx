'use client'

import { useEffect, useState, useMemo } from 'react'
import axios from 'axios'
import Image from 'next/image'
import Link from 'next/link'

interface Quiz {
  id: number
  title: string
  image_url: string
  is_new: boolean
  categories: { name: string }[]
}

export default function Tabs() {
  const [activeTab, setActiveTab] = useState('all') // 'all' или название категории
  const [quizes, setQuizes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)

  // Получаем уникальные категории из всех квизов (без учета регистра)
  const categories = useMemo(() => {
    const allCategories = quizes.flatMap(quiz => 
      quiz.categories?.map(c => c.name.toLowerCase()) || []
    )
    
    // Удаляем дубликаты, сохраняем оригинальные названия и сортируем
    const uniqueCategories = new Map<string, string>()
    quizes.forEach(quiz => {
      quiz.categories?.forEach(cat => {
        const lowerName = cat.name.toLowerCase()
        if (!uniqueCategories.has(lowerName)) {
          // Сохраняем оригинальное название (первое встретившееся)
          uniqueCategories.set(lowerName, cat.name)
        }
      })
    })
    
    return Array.from(uniqueCategories.values()).sort()
  }, [quizes])

  useEffect(() => {
    const fetchQuizes = async () => {
      try {
        const response = await axios.get('/api/quizes')
        setQuizes(response.data)
      } catch (error) {
        console.error('Error fetching quizes:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchQuizes()
  }, [])

  // Фильтруем квизы по активной вкладке (без учета регистра)
  const filteredQuizes = useMemo(() => {
    if (activeTab === 'all') return quizes
    return quizes.filter(quiz => 
      quiz.categories?.some(cat => 
        cat.name.toLowerCase() === activeTab.toLowerCase()
      )
    )
  }, [quizes, activeTab])

  if (loading) {
    return <div className="text-white py-4">Загрузка...</div>
  }

  return (
    <div className="">
      <div className="flex border-b border-gray-200 overflow-x-auto">
        {/* Вкладка "Все" */}
        <button
          onClick={() => setActiveTab('all')}
          className={`py-2 px-4 cursor-pointer font-medium text-sm focus:outline-none whitespace-nowrap ${
            activeTab === 'all'
              ? 'border-b-2 border-[#6CED52] text-[#6CED52]'
              : 'text-white hover:text-gray-200'
          }`}
        >
          Все
        </button>

        {/* Вкладки категорий */}
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setActiveTab(category)}
            className={`py-2 px-4 cursor-pointer font-medium text-sm focus:outline-none whitespace-nowrap ${
              activeTab.toLowerCase() === category.toLowerCase()
                ? 'border-b-2 border-[#6CED52] text-[#6CED52]'
                : 'text-white hover:text-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 my-4">
        {filteredQuizes.length > 0 ? (
          filteredQuizes.map((quiz) => (
            <Link 
              href={`/quizes/${quiz.id}`} 
              key={quiz.id}
              passHref
            >
                <div
                    style={{
                      borderTop: '4px solid white',
                      borderLeft: '4px solid white',
                      borderRight: '4px solid #293133',
                      borderBottom: '4px solid #293133'
                    }}
                  className="relative w-full h-54">
                  <div className="w-full h-6 bg-[#010089]">
                    <p className="uppercase px-2 text-xs py-1">
                      {quiz.categories.map(cat => cat.name).join(', ')}
                    </p>
                  </div>
                  <Image 
                    className="h-46 object-cover" 
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
          ))
        ) : (
          <div className="col-span-2 text-center text-white py-8">
            Нет квизов в этой категории
          </div>
        )}
      </div>
    </div>
  )
}