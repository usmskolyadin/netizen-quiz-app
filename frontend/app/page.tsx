import { Coin } from "@/components/Coin";
import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-white flex justify-between items-center">
      <div className="text-white min-w-[320px] min-h-[741px] max-w-[320px] max-h-[741px] bg-black relative">
          <div className="absolute inset-0 z-10 pointer-events-none">
            <Image 
              src="/telek.png" 
              alt="Decorative overlay"
              fill
              className="object-contain opacity-35"
              style={{ mixBlendMode: 'lighten' }} 
            />
          </div>
        <header className="flex py-5 items-center text-white justify-between mx-4">
          <h1 className="text-xl uppercase">NETQUIZE</h1>
          <div className="flex">
            <p className="mr-2">999</p>
            <Coin />
          </div>
        </header>
        <main className="flex flex-col  mx-4">
          <div className="relative w-full border-r border-b border-5 border-white overflow-hidden">
            <div className="w-full h-6 px-2 bg-[#010089] flex justify-between items-center">
              <p className="uppercase  text-md">Музыка</p>
              <svg width="45" height="14" viewBox="0 0 45 14" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            <div className="relative">
              <Image className="w-full" src={"/testimg.png"} alt={""} width={1000} height={1000} />
              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.8),transparent)]" />
            </div>
            <div className="absolute bottom-4 left-4 z-10">
              <h3 className="uppercase text-md text-[#F97316]">Новинка</h3>
              <h3 className="uppercase text-xl">LUCKI - GEMINI</h3>
            </div>
          </div>

          <section className="mt-4">
            <div className="flex justify-between">
              <h1 className="text-xl uppercase">Квизы</h1>
              <div className="flex justify-between items-center">
                <p className="uppercase text-md mr-2">Все</p>
                <svg width="12" height="21" viewBox="0 0 12 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 9.5V8.5H10V7.5H8V5.5H6V3.5H4V1.5H2V0.5H0V3.5H2V5.5H4V7.5H6V9.5H8V11.5H6V13.5H4V15.5H2V17.5H0V20.5H2V19.5H4V17.5H6V16.5V15.5H8V14.5V13.5H10V12.5H11V11.5H12V10.5V9.5H11Z" fill="#EDEDED"/>
                </svg>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-5 mt-3">
              <div className="relative border-2 border-white w-full x">
                <div className="w-full h-6 bg-[#010089]">
                  <p className="uppercase px-2 text-xs py-1">Музыка</p>
                </div>
                <Image className="h-40 object-cover" src={"/item.png"} alt={""} width={1000} height={100}/>

                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.8),transparent)]" />
                <div className="absolute bottom-2 left-2">
                  <h3 className="uppercase text-xs text-[#F97316]">Новинка</h3>
                  <h3 className="uppercase text-md mt-1">LUCKI - GEMINI</h3>
                </div>
              </div>
              <div className="relative border-2 border-white w-full x">
                <div className="w-full h-6 bg-[#010089]">
                  <p className="uppercase px-2 text-xs py-1">Музыка</p>
                </div>
                <Image className="h-40 object-cover" src={"/item.png"} alt={""} width={1000} height={100}/>

                <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.8),transparent)]" />
                <div className="absolute bottom-2 left-2">
                  <h3 className="uppercase text-xs text-[#F97316]">Новинка</h3>
                  <h3 className="uppercase text-md mt-1">LUCKI - GEMINI</h3>
                </div>
              </div>
            </div>
          </section>

        </main>
      </div>

      
      <div className="text-white min-w-[320px] min-h-[741px] max-w-[320px] max-h-[741px] bg-black relative">
          <div className="absolute inset-0 z-10 pointer-events-none">
            <Image 
              src="/telek.png" 
              alt="Decorative overlay"
              fill
              className="object-contain opacity-35"
              style={{ mixBlendMode: 'lighten' }} 
            />
          </div>
        <header className="flex py-5 items-center text-white justify-between mx-4">
          <div className="flex justify-between items-center">
            <svg width="12" height="21" viewBox="0 0 12 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 0.5V1.5H8V3.5H6V5.5H4V7.5H2V8.5H1V9.5H0V11.5H1V12.5H2V13.5H4V15.5H6V17.5H7H8V18.5V19.5H10V20.5H12V17.5H10V15.5H8V13.5H6V11.5H4V9.5H6V7.5H8V5.5H10V3.5H12V0.5H10Z" fill="white"/>
            </svg>
            <p className="uppercase text-md ml-2">назад</p>
          </div>
          <div className="flex">
            <p className="mr-2">999</p>
            <Coin />
          </div>
        </header>
        <main className="flex flex-col mx-4">
          <section className="">
            
            <div className="relative border-2 border-white w-full bg-white">
              <div className="w-full h-6 bg-[#010089]">
                <p className="uppercase px-2 text-xs py-1">Музыка</p>
              </div>
              <Image className="max-h-40 object-cover" src={"/item.png"} alt={""} width={1000} height={100}/>
              <div className="absolute max-h-46 inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.8),transparent)]" />
              <div className="px-2 py-2">
              <div className=" flex justify-between">
                <h3 className="uppercase text-xl mt-1 text-black">ОТКУДА СЕМПЛ ??</h3>
                <div className="bg-[#CECECE]">
                  <div className="flex items-center py-2 px-2">
                    <p className="mr-2 text-xs text-black ">999</p>
                    <Coin />
                  </div>
                </div>  
              </div>
              <div className="py-2">
                <h2 className="text-black text-xs mb-1">Соавтор</h2>
                <div className="flex items-center">
                  <Image className="w-8 h-8 rounded-full object-cover" src={"/swag.png"} alt={""} width={100} height={100} />
                  <h2 className="uppercase text-black text-xs ml-2">Виталий</h2>
                </div>
              </div>
              <p className="text-black text-xs">Готов пройти тест, который опкажет на кого-то похож из репперов? Тогда скорее проходи тест!</p>
              <button className="bg-[#0100BE] px-4 py-2 w-full mt-2">Пройти</button>
              </div>
            </div>

          </section>
        </main>
      </div>




      <div className="text-white min-w-[320px] min-h-[741px] max-w-[320px] max-h-[741px] bg-black relative">
          <div className="absolute inset-0 z-10 pointer-events-none">
            <Image 
              src="/telek.png" 
              alt="Decorative overlay"
              fill
              className="object-contain opacity-35"
              style={{ mixBlendMode: 'lighten' }} 
            />
          </div>
        <header className="flex py-5 items-center text-white justify-between mx-4">
          <div className="flex justify-between items-center">
            <svg width="12" height="21" viewBox="0 0 12 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 0.5V1.5H8V3.5H6V5.5H4V7.5H2V8.5H1V9.5H0V11.5H1V12.5H2V13.5H4V15.5H6V17.5H7H8V18.5V19.5H10V20.5H12V17.5H10V15.5H8V13.5H6V11.5H4V9.5H6V7.5H8V5.5H10V3.5H12V0.5H10Z" fill="white"/>
            </svg>
            <p className="uppercase text-md ml-2">на главную</p>
          </div>
          <div className="flex">
            <p className="mr-2">999</p>
            <Coin />
          </div>
        </header>
        <main className="flex flex-col mx-4">
          <section className="">
            
            <div className="relative border-2 border-white w-full bg-white">
              <div className="px-2 py-2">
                <div className="flex justify-between border-b border-black mb-2">
                  <h3 className="uppercase text-xl mt-1 text-black">2/12</h3>
                  <div className="bg-[#ffffff] h-4">
                    <div className="flex items-center py-2 px-2">
                      <div className="bg-[#010089] h-5 w-3 border-1 border-b border-r border-[#0100BE]"></div>
                      <div className="bg-[#010089] h-5 w-3 border-1 border-b border-r border-[#0100BE]"></div>
                      <div className="bg-[#010089] h-5 w-3 border-1 border-b border-r border-[#0100BE]"></div>
                      <div className="bg-[#010089] h-5 w-3 border-1 border-b border-r border-[#0100BE]"></div>
                      <div className="bg-[#010089] h-5 w-3 border-1 border-b border-r border-[#0100BE]"></div>
                      <div className="bg-[#010089] h-5 w-3 border-1 border-b border-r border-[#0100BE]"></div>
                      <div className="bg-[#010089] h-5 w-3 border-1 border-b border-r border-[#0100BE]"></div>
                    </div>
                  </div>  
                </div>
                <div className="justify-center items-center flex flex-col">
                  <p className="text-black text-xs justify-center flex">Готов пройти тест, который опкажет на кого-то похож из репперов? Тогда скорее проходи тест!</p>
                  <Image className="w-full py-2 max-h-[200px] object-cover" src={"/swag.png"} alt={""} width={1000} height={1000} />
                </div>
                
                <button className="bg-[#0100BE] px-4 py-2 w-full mt-2">Ответить</button>
              </div>
            </div>

          </section>
        </main>
      </div>
    </div>
  );
}
