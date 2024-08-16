import { Avatar } from "./Avatar";

interface friend {
    id:string;
    username:string;
    name:string;
}

const Contacts = ({friend ,setChatId}:{friend: friend,setChatId:(value:string)=>void})=>{

    const handleSettingChatId=(id:string)=>{
        setChatId(id);
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