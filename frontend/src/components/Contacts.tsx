import { useRecoilState, useRecoilValue } from "recoil";
import userAccountState from "../recoil/States";
import { Avatar } from "./Avatar";
import axios from "axios";
import { deplUrlHttp } from "../config";
import { useEffect } from "react";
import { chatIdState } from "../recoil/States";

interface friend {
    id:string;
    username:string;
    name:string;
}

const Contacts = ({friend ,setChatId ,setSelectedFriendId,chatId ,setMessages,setText}:{friend: friend,setChatId:(value:string)=>void ,setSelectedFriendId: (value: string)=>void , chatId:string ,setMessages: (value:any)=>void,setText:(prev:any)=>void})=>{

    const userAccount = useRecoilValue(userAccountState);
    const [_ , setchatIdRecoil] = useRecoilState(chatIdState);


    useEffect(()=>{
        const fetchMessages = async()=>{
            try{
                if(chatId){
                    const response = await axios.get(`${deplUrlHttp}/api/fetchMessage`,{
                    params : {
                        roomId: chatId
                    }
                    });
                    console.log('fetching messages: ',response);
                    // setMessages(response.data.messages)
                    setText(response.data.messages);
                }else{
                    return;
                }
            }catch(e){
                console.log('Error while fetching messages');
            }
        }
        fetchMessages();

    },[chatId,setText])

    const handleSettingChatId= async (id:string)=>{
        try{
            const response = await axios.post(`${deplUrlHttp}/api/getOrCreateRoom`,{
                userId: userAccount.userId,
                friendId: id
            })
            const chatId = response.data.room.id;
            console.log('chatId: ',chatId);
            setChatId(chatId);
            setchatIdRecoil(chatId);
            setSelectedFriendId(id);
        }catch(e){
            console.error('Handle setting Chat Id')
        }
    }

    return (
        <div onClick={()=>handleSettingChatId(friend.id)} className=" flex justify-center items-center p-1 active:bg-slate-700 transition-all duration-500 ease-out active:text-slate-900">
            <div className="  flex flex-col gap-2  px-2 py-1 border-slate-500 h-fit w-[30rem] ">
                <div className=" flex justify-start items-center gap-5">
                    <div className=" p-1 bg-slate-400 rounded-full">
                        <Avatar authenticatedUser={friend.name}></Avatar>
                    </div>
                    <div className=" text-slate-200">
                        {friend.name}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Contacts;