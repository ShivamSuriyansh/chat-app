import { useRef, useState } from "react";

const GenerateCode = ({handleGenerateRoomCode,joinCode,setRoomCode,setCode,setJoinCode}:{handleGenerateRoomCode:()=>void,joinCode:string | undefined,setJoinCode:(code:string| undefined)=>void ,setCode: (code:string| undefined)=>void , setRoomCode: (code:string| undefined)=> void})=>{
    const [isCopied, setIsCopied] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleCopy = async () => {
        if (inputRef.current) {
            try {
                await navigator.clipboard.writeText(inputRef.current.value);
                setIsCopied(true);
        
                // Reset to default state after 2 seconds
                setTimeout(() => {
                setIsCopied(false);
                }, 2000);
            } catch (err) {
                console.error('Failed to copy: ', err);
            }
        }
    };

    return(        
        <div className="w-full max-w-sm">
      <div className="mb-2 flex justify-between items-center">
        <label htmlFor="url-shortener" className="text-sm font-medium text-gray-900 dark:text-white">
          Room Code:
        </label>
      </div>
      <div className="flex items-center">
        <button onClick={handleGenerateRoomCode} className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-white bg-blue-700 dark:bg-blue-600 border hover:bg-blue-800 dark:hover:bg-blue-700 rounded-s-lg border-blue-700 dark:border-blue-600 hover:border-blue-700 dark:hover:border-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
          Generate
        </button>
        <div className="relative w-full">
          <input
            ref={inputRef}
            id="url-shortener"
            type="text"
            
            className="bg-gray-50 border border-e-0 border-gray-300 text-white dark:text-white text-sm border-s-0 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="XY89JHYU8"
            value={joinCode}
            onChange={(e)=>{
                setJoinCode(e.target.value);
                setRoomCode(e.target.value);
                setCode(e.target.value);
            }}
          />
        </div>
        <button
          onClick={handleCopy}
          className="flex-shrink-0 z-10 inline-flex items-center py-3 px-4 text-sm font-medium text-center text-gray-500 dark:text-gray-400 hover:text-gray-900 bg-gray-100 border border-gray-300 rounded-e-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:hover:text-white dark:border-gray-600"
          type="button"
        >
          <span id="default-icon" className={!isCopied ? 'block' : 'hidden'}>
            <svg
              className="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 18 20"
            >
              <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
            </svg>
          </span>
          <span id="success-icon" className={isCopied ? 'block' : 'hidden'}>
            <svg
              className="w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 16 12"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 5.917 5.724 10.5 15 1.5"
              />
            </svg>
          </span>
        </button>
        <div content={isCopied ? 'Copied!' : 'Copy link'}>
          <div id="tooltip-url-shortener" role="tooltip" className="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
            {isCopied ? 'Copied!' : 'Copy link'}
            <div className="tooltip-arrow" data-popper-arrow></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateCode;