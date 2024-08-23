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
import { deplUrlHttp } from "../config";
import axios from "axios";
import Contacts from "../components/Contacts";


interface Friend {
    id: string;
    username: string;
    name: string;
  }
  
export interface FriendsResponse {
    id: string;
    userId: string;
    friendId: string;
    friend: Friend;
}

export interface message {
    content:string;
    deliveredAt:string
    id: string
    receiverId :string
    roomId :string
    senderId : string
    sentAt:string
    status : string
}


const Chat = ({ text, send, value, setValue, authenticatedUser }:{text : any, send :(value:string)=>void, value :string, setValue : (value:string)=>void, authenticatedUser:string}) => {
    const [friendList , setFriendList] = useState<FriendsResponse[] | null>(null);
    const [userAccount, setUserAccount] = useRecoilState(userAccountState);
    const [openAddFriend, setOpenAddFriend] = useState<boolean>(false);
    const [openFriendRequests, setOpenFriendRequests] = useState<boolean>(false);
    const [showToast, setShowToast] = useState<boolean>(false);
    const [chatId , setChatId] = useState<string>('');
    const [selectedFriendId , setSelectedFriendId] = useState<string>('');
    const [messages, setMessages] = useState<message[]>([]);
    
    const messageEndRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLTextAreaElement | null>(null);
    
    const navigate = useNavigate();
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUserAccount = localStorage.getItem('userAccount');

        if (!authenticatedUser && !storedToken){
            navigate('/login');
        }else {
            // Restore user account from localStorage if available
            if (storedUserAccount) {
                const parsedAccount = JSON.parse(storedUserAccount);
                setUserAccount(parsedAccount);
            }
        }
    }, [authenticatedUser,navigate,setUserAccount]);

    useEffect(() => {
        localStorage.setItem('userAccount', JSON.stringify(userAccount));
    }, [userAccount]);


    useEffect(() => {
        const scrollBottom = () => {
            messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        };
        scrollBottom();
        console.log(messages)
    }, [messages]);


    const handleSendMessage = (value: string) => {
        if (!value) return;
        const message = {
            value,
            username: authenticatedUser,
            chatId
        };
        setUserAccount((prev) => {
            const updatedAccount = {
                ...prev,
                content: value,
                sentAt: new Date().toISOString(),
                sender: prev.userId,
                chatId: chatId
            };

            send(JSON.stringify(updatedAccount)); 
            return updatedAccount;
        });
        setValue('');
        inputRef.current?.focus();
    };


    const handleToggleAddFriend = () => {
        setOpenAddFriend((prev) => !prev);
    };

    const handleToggleFriendRequests = () => {
        setOpenFriendRequests((prev) => !prev);
    };


    const handleShowToast = () => {
        setShowToast(true);
        setTimeout(() => {
        setShowToast(false);
        }, 3000); // Automatically hide toast after 3 seconds
    };


    useEffect(()=>{
        const getFriends = async () => {
            try{
                const response = await axios.get(`${deplUrlHttp}/api/friends`,{
                params: {
                    userId: userAccount.userId,
                  },
                });
                console.log('FriendList',response.data.friends)
                setFriendList(response.data.friends);
            }catch(e){
                console.log('error while fetching friends: ',e);
            }
        }

        getFriends();
    },[openFriendRequests,userAccount.userId,userAccount])




    return (
        <>
        {showToast && (
            <div className="fixed top-4 right-4">
                <Toast message="Friend Request Sent" onClose={() => setShowToast(false)} />
            </div>
        )}
        <div className=" flex gap-10">
            <div className=" friends h-screen w-[30rem] bg-slate-900">
                {friendList?.map((friend,i)=>(
                    <div key={i}>
                        <Contacts setMessages={setMessages} chatId={chatId} setSelectedFriendId={setSelectedFriendId} friend={friend.friend} setChatId={setChatId} />
                    </div>
                ))}
            </div>
            <div className="flex flex-col gap-2 overflow-y-auto scroll-smooth transition-all duration-150  mt-[5rem] min-w-fit">
                {openAddFriend && (
                    <div className="fixed inset-0 flex items-center justify-center z-10 bg-gray-900 bg-opacity-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                            <AddFriends handleToggleAddFriend={handleToggleAddFriend} handleShowToast={handleShowToast}/>
                        </div>
                    </div>
                )}
                {openFriendRequests && (
                    <div className="fixed z-10 inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
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
                <div className="bg-slate-100 w-[50rem] px-1 py-2 rounded-xl flex flex-col gap-4 max-h-[30rem] overflow-auto min-h-[30rem] shadow-lg custom-scrollbar">
                    <div className="message w-full">
                        {messages && messages.map((msg: message, i: number) => {
                            return (
                                <div key={i}>
                                    <Message msg={msg} authenticatedUser={authenticatedUser} previousUsername={messages[i - 1]} />
                                </div>
                            );
                        })}
                        <div ref={messageEndRef} />
                    </div>
                </div>
                <div className="send-input flex gap-2 w-full mt-3 shadow-2xl">
                    <SendMessage setMessages={setMessages} selectedFriendId={selectedFriendId} chatId={chatId} value={value} setValue={setValue} handleSendMessage={handleSendMessage} inputRef={inputRef} />
                </div>
            </div>
        </div>
        </>
    );
}

export default Chat;
