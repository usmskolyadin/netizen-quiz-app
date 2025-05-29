import Image from "next/image";

export const QuizeItem = () => {
    return (
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
    )
}