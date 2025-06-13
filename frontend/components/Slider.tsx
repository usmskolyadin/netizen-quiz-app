'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { Quiz } from '@/types'
import Link from 'next/link'

export default function QuizSlider({ quizes }: { quizes: Quiz[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isSwiping, setIsSwiping] = useState(false)
  const [startX, setStartX] = useState(0)
  const [translateX, setTranslateX] = useState(0)
  const sliderRef = useRef<HTMLDivElement>(null)
  const animationRef = useRef<number>(null)

  const visibleQuizes = quizes.slice(-3)
  const totalSlides = visibleQuizes.length

  const slides = [...visibleQuizes, ...visibleQuizes, ...visibleQuizes]
  const totalExtendedSlides = slides.length

  useEffect(() => {
    const interval = setInterval(() => {
      goToNext()
    }, 5000)
    return () => clearInterval(interval)
  }, [totalSlides])

  const goToNext = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % totalSlides)
  }, [totalSlides])

  const goToPrev = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + totalSlides) % totalSlides)
  }, [totalSlides])

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsSwiping(true)
    setStartX(e.touches[0].clientX)
    setTranslateX(0)
    cancelAnimationFrame(animationRef.current!)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping) return
    const currentX = e.touches[0].clientX
    const diff = currentX - startX
    setTranslateX(diff)
  }

  const handleTouchEnd = () => {
    if (!isSwiping) return
    setIsSwiping(false)

    if (translateX > 50) {
      goToPrev()
    } else if (translateX < -50) {
      goToNext()
    } else {
      setTranslateX(0)
    }
  }

  const getSlidePosition = (index: number) => {
    const position = (index - currentIndex + totalExtendedSlides) % totalExtendedSlides
    return position
  }

  useEffect(() => {
    if (!isSwiping) {
      setTranslateX(0)
    }
  }, [currentIndex, isSwiping])

  return (
    <div className="relative w-full overflow-x-hidden py-4">
      <div 
        className="relative w-full h-96 mx-auto"
        ref={sliderRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {slides.map((quiz, index) => {
          const position = getSlidePosition(index)
          const isActive = position === totalSlides
          const isNext = position === totalSlides + 1
          const isPrev = position === totalSlides - 1
          const isFar = !isActive && !isNext && !isPrev

          return (
            <Link href={`/quizes/${quiz.id}`}>
                <div
                key={`${quiz.id}-${index}`}
                className={`absolute top-0 left-0 w-full h-full transition-all duration-500 ease-in-out ${
                    isActive ? 'z-10' : 'z-0'
                }`}
                style={{
                    transform: `translateX(${
                    isActive ? `${translateX}px` : 
                    isNext ? `calc(100% + 20px + ${translateX}px)` :
                    isPrev ? `calc(-100% - 20px + ${translateX}px)` :
                    position < totalSlides ? `calc(-200% - 40px + ${translateX}px)` :
                    `calc(200% + 40px + ${translateX}px)`
                    }) scale(${isActive ? 1 : 0.9})`,
                    opacity: isActive ? 1 : isNext || isPrev ? 0.7 : 0,
                    pointerEvents: isActive ? 'auto' : 'none'
                }}
                >
                <div 
                  className="relative w-full h-86 overflow-hidden mx-auto max-w-md"
                  style={{
                    borderTop: '6px solid white',
                    borderLeft: '6px solid white',
                    borderRight: '6px solid #293133',
                    borderBottom: '6px solid #293133'
                  }}
                >
                    <div className="w-full h-6 px-2 bg-[#010089] flex justify-between items-center">
                    <p className="uppercase text-md">Музыка</p>
                      <svg width="45" height="14" viewBox="0 0 45 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      </svg>
                    </div>
                    <div className="relative w-full h-86">
                    <Image 
                        className="w-full h-86 object-cover" 
                        src={quiz.image_url || "/testimg.png"} 
                        alt={quiz.title} 
                        width={1000} 
                        height={1000} 
                        priority={isActive}
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.8),transparent)]" />
                    </div>
                    <div className="absolute bottom-4 left-4 z-10">
                    {quiz.is_new && (
                        <h3 className="uppercase text-md text-[#F97316]">Новинка</h3>
                    )}
                    <h3 className="uppercase break-words w-64 broken text-xl">{quiz.title}</h3>
                    </div>
                </div>
                </div>
            </Link>

          )
        })}
      </div>

      {/* Индикаторы */}
      <div className="flex justify-center  space-x-2">
        {visibleQuizes.map((_, index) => (
          <div
            key={index}
            className={`h-2 w-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-white w-6' : 'bg-gray-500'
            }`}
          />
        ))}
      </div>
    </div>
  )
}