import { useNavigate } from "react-router-dom";
import Message from "../components/Message";
import { useEffect, useRef, useState } from "react";
import userAccountState from "../recoil/States";
import { useRecoilState } from "recoil";
import SendMessage from "../components/SendMessage";
import '../CustomScrollbar.css';
import AddFriends from "../components/AddFriends";
import FriendRequests from "../components/FriendRequests";
import Toast from "../components/Toast";

const Chat = ({ text, send, value, setValue, authenticatedUser }:{text : any, send :(value:string)=>void, value :string, setValue : (value:string)=>void, authenticatedUser:string}) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!authenticatedUser || !localStorage.getItem('token')) {
            navigate('/');
        }
    }, [authenticatedUser, navigate]);

    const messageEndRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
        const scrollBottom = () => {
            messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        };
        scrollBottom();
    }, [text]);

    const [userAccount, setUserAccount] = useRecoilState(userAccountState);

    const handleSendMessage = (value: string) => {
        if (!value) return;
        const message = {
            value,
            username: authenticatedUser,
        };
        setUserAccount((prev) => {
            const updatedAccount = {
                ...prev,
                content: value,
                sentAt: new Date().toISOString(),
                sender: prev.userId,
            };

            send(JSON.stringify(updatedAccount)); 
            return updatedAccount;
        });
        setValue('');
        inputRef.current?.focus(); 
    };

    const [openAddFriend, setOpenAddFriend] = useState<boolean>(false);

    const handleToggleAddFriend = () => {
        setOpenAddFriend((prev) => !prev);
    };
    const [openFriendRequests, setOpenFriendRequests] = useState<boolean>(false);

    const handleToggleFriendRequests = () => {
        setOpenFriendRequests((prev) => !prev);
    };

    const [showToast, setShowToast] = useState<boolean>(false);

    const handleShowToast = () => {
        setShowToast(true);
        setTimeout(() => {
        setShowToast(false);
        }, 3000); // Automatically hide toast after 3 seconds
    };

    return (
        <>
        {showToast && (
            <div className="fixed top-4 right-4">
                <Toast message="Friend Request Sent" onClose={() => setShowToast(false)} />
            </div>
        )}
            <div className="flex flex-col gap-2 overflow-y-auto scroll-smooth transition-all duration-150">
                {openAddFriend && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                            <AddFriends handleToggleAddFriend={handleToggleAddFriend} handleShowToast={handleShowToast}/>
                        </div>
                    </div>
                )}
                {openFriendRequests && (
                    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
                        <FriendRequests handleToggleFriendRequests={handleToggleFriendRequests} />
                    </div>
                )}
                <div className="flex gap-10">
                    <div className="w-fit bg-teal-300 px-4 py-2 rounded-lg shadow-lg mb-3 focus:bg-teal-600 active:bg-teal-600 hover:bg-teal-500">
                        <button onClick={handleToggleAddFriend} className="text-sm text-slate-800 font-medium">Add Friends</button>
                    </div>
                    <div className="w-fit bg-teal-300 px-4 py-2 rounded-lg shadow-lg mb-3 focus:bg-teal-600 active:bg-teal-600 hover:bg-teal-500">
                        <button onClick={handleToggleFriendRequests} className="text-sm text-slate-800 font-medium">Requests</button>
                    </div>
                </div>
                <div className="bg-slate-100 w-[50rem] px-1 py-2 rounded-xl flex flex-col gap-4 max-h-[30rem] overflow-auto min-h-[25rem] shadow-lg custom-scrollbar">
                    <div className="message w-full">
                        {text && text.map((msg: any, i: number) => {
                            return (
                                <div key={i}>
                                    <Message msg={msg} authenticatedUser={authenticatedUser} previousUsername={text[i - 1]} />
                                </div>
                            );
                        })}
                        <div ref={messageEndRef} />
                    </div>
                </div>
                <div className="send-input flex gap-2 w-full mt-3 shadow-2xl">
                    <SendMessage value={value} setValue={setValue} handleSendMessage={handleSendMessage} inputRef={inputRef} />
                </div>
            </div>
        </>
    );
}

export default Chat;
