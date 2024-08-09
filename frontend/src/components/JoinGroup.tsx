import { useState } from "react";
import GenerateCode from "./GenerateCode";

const JoinGroup = ({ setCode, setRoomCode }: { setCode: (code: string | undefined) => void, setRoomCode: (code: string | undefined) => void }) => {

    const [isJoinOpen, setIsJoinOpen] = useState<boolean>(false);
    const [joinCode, setJoinCode] = useState<string | undefined>('');

    const toggleJoin = () => {
        setIsJoinOpen((prev: boolean) => !prev);
    }

    const generateCode = (length = 8) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const charactersLength = characters.length;

        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }

        return result;
    };

    const handleGenerateRoomCode = () => {
        const code = generateCode();
        setCode(code);
        setRoomCode(code);
        setJoinCode(code);
    }

    return (
        <div className="flex justify-center items-center w-full">
            <button onClick={toggleJoin} data-modal-target="default-modal" data-modal-toggle="default-modal" className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" type="button">
                Join Group
            </button>

            <div
                id="default-modal"
                aria-hidden="true"
                className={`fixed inset-0 z-50 flex justify-center items-center h-full w-full overflow-y-auto transition-opacity duration-1000 ease-out ${isJoinOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
                style={{ display: isJoinOpen ? 'flex' : 'none' }}
                >
                <div className="relative p-4 w-full max-w-2xl max-h-full">
                    {/* <!-- Modal content --> */}
                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        {/* Modal header */}
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                Join a Group
                            </h3>
                            <button onClick={toggleJoin} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="default-modal">
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>

                        <div className="input-room-code flex justify-center items-center gap-2 pb-4">
                            <GenerateCode handleGenerateRoomCode={handleGenerateRoomCode} joinCode={joinCode} setJoinCode={setJoinCode} setCode={setCode} setRoomCode={setRoomCode} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default JoinGroup;
