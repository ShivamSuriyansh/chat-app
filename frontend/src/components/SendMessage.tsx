import React, { useEffect, useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { deplUrlHttp } from '../config';
import { useRecoilValue } from 'recoil';
import userAccountState from '../recoil/States';
import axios from 'axios';
import { message } from '../pages/Chat';

interface SendMessageProps{
    value : string;
    setValue : (value : string)=>void;
    handleSendMessage : (value:string)=>void;
    inputRef: React.MutableRefObject<HTMLTextAreaElement | null>
    chatId: string
    selectedFriendId: string;
    setMessages:React.Dispatch<React.SetStateAction<message[]>>;
}

const SendMessage:React.FC<SendMessageProps> = ({value , setValue , handleSendMessage , inputRef,chatId ,selectedFriendId ,setMessages}) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
    const [openEmote , setOpenEmote] = useState<boolean>(false);
    const  userAccount = useRecoilValue(userAccountState);

    const handleEmojiClick = (emoji:any)=>{
        console.log(emoji); 
        setDebouncedValue(prev => prev+ emoji.emoji)
    }

    useEffect(() => {
        const handler = setTimeout(() => {
          setValue(debouncedValue);
        }, 300); // Delay of 300ms
    
        // Cleanup function to clear timeout if value changes before 300ms
        return () => {
          clearTimeout(handler);
        };
      }, [debouncedValue, setValue]);
    
      const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
          setDebouncedValue(e.target.value);
      };

      const sendMessage = async() => {
        if (!debouncedValue || !chatId) return;
        console.log('userId',userAccount.userId , "chatId: ",chatId, 'content', debouncedValue, 'recieverId: ',selectedFriendId)

        const newMessage = {
            content: debouncedValue,
            senderId: userAccount.userId,
            receiverId: selectedFriendId,
            roomId: chatId,
            sentAt: new Date().toISOString(),
        };
    
        // Optimistically update the UI with the new message
        setMessages((prev:any) => [...prev, newMessage]);

        try {
            const response = await axios.post(`${deplUrlHttp}/api/sendMessage`, {
                roomId: chatId,
                senderId: userAccount.userId, // Assuming userAccount holds the current user's info
                content: debouncedValue,
                receiverId: selectedFriendId
            });
    
            if (response.data) {
                handleSendMessage(debouncedValue); // Update the UI with the new message
                setValue(''); 
                setDebouncedValue('');
            } else {
                console.error('Message sending failed');
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className=' w-full shadow-xl'>
            <label htmlFor="chat" className="sr-only">Your message</label>
            <div className="flex items-center px-3 py-2 rounded-tl-xl rounded-br-xl bg-slate-700">
                <button
                    type="button"
                    className="inline-flex justify-center p-2 text-gray-400 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-white "
                    >
                    <svg
                        className="w-5 h-5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 18"
                        >
                        <path
                            fill="currentColor"
                            d="M13 5.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM7.565 7.423 4.5 14h11.518l-2.516-3.71L11 13 7.565 7.423Z"
                            />
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M18 1H2a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z"
                            />
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 5.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM7.565 7.423 4.5 14h11.518l-2.516-3.71L11 13 7.565 7.423Z"
                            />
                    </svg>
                    <span className="sr-only">Upload image</span>
                </button>
                <div className={`${openEmote ? 'flex': 'hidden'} absolute left-[39.2rem] top-[39%]`}>
                    <EmojiPicker width={350} height={350} onEmojiClick={(e)=>handleEmojiClick(e)}/>
                </div>
                <button
                    type="button"
                    className="p-2 text-gray-400 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-white "
                    onClick={()=>setOpenEmote(prev => !prev)}
                    >
                    
                    <svg
                        className="w-5 h-5"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 20"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13.408 7.5h.01m-6.876 0h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM4.6 11a5.5 5.5 0 0 0 10.81 0H4.6Z"
                            />
                    </svg>
                    <span className="sr-only">Add emoji</span>
                </button>
                <textarea
                    ref={inputRef}
                    id="chat"
                    rows={1}
                    value={debouncedValue}
                    onChange={handleChange}
                    className="block mx-4 p-2.5 w-full text-sm text-white bg-gray-900 rounded-tl-lg rounded-br-lg border outline-none border-teal-300 focus:ring-teal-100 focus:border-blue-200 placeholder:text-white "
                    placeholder="Your message..."
                    />
                <button
                    onClick={()=>{
                        sendMessage();
                        setOpenEmote(false);
                    }}
                    type="submit"
                    className="inline-flex justify-center p-3 text-black rounded-lg outline-none cursor-pointer hover:bg-white "
                    >
                    <svg
                        className="w-5 h-5 rotate-90 rtl:-rotate-90"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 18 20"
                        >
                        <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z"/>
                    </svg>
                    <span className="sr-only">Send message</span>
                </button>
            </div>
        </div>
    );
};

export default SendMessage;
