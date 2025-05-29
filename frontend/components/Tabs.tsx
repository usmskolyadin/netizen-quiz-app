'use client'

import { useState } from 'react'
import { QuizeItem } from './QuizeItem'

export default function Tabs() {
  const [activeTab, setActiveTab] = useState(1)

  const tabs = [
    { id: 1, title: 'Музыка' },
    { id: 2, title: 'Мода' },
    { id: 3, title: 'Искусство' }
  ]

  const tabContents = [
    { id: 1, content: 'Содержимое первой вкладки' },
    { id: 2, content: 'Контент второй вкладки' },
    { id: 3, content: 'Третья вкладка информация' }
  ]

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

      <div className="">
        {tabContents.map(content => (
          <div 
            key={content.id}
            className={`${activeTab === content.id ? 'block' : 'hidden'} grid grid-cols-2 gap-5 mt-3`}
          >
            <QuizeItem />
            <QuizeItem />
            <QuizeItem />
            <QuizeItem />
          </div>
        ))}
      </div>
    </div>
  )
}