import { useRecoilValue } from "recoil";
import { Avatar } from "./Avatar"
import userAccountState from "../recoil/States";


const Message =  ({msg ,authenticatedUser, previousUsername}:{msg : any, authenticatedUser: string, previousUsername:any}) => {


  console.log('%%%%%%%%%%%%%',previousUsername);
  const userAccount = useRecoilValue(userAccountState)


  const timeOnly = new Date(msg.sentAt).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit'
  });
  const pos = userAccount.username===msg.sender.name ? "end" : "start";
  const showAvatar = msg.sender.name !== (previousUsername?.sender ? previousUsername.sender.name : '');


  return (
    <div className={`flex justify-${pos} max-w-full`}>
      <div className="flex gap-1 justify-end items-center p-1">
        {pos === 'start' ? (
          <div className="flex gap-0">
              <div className={`${!showAvatar ? 'opacity-0' : ""}`}>
                <Avatar authenticatedUser={msg.sender.name}  />
              </div>
            <div className="rounded-lg text-white flex flex-col items-center justify-start  mx-2">
              {showAvatar && 
                <div className="text-slate-900 font-semibold text-xs rounded-t-lg w-full text-start py-1">
                  {msg.sender.name}
                </div>
              }
              <div className="bg-slate-50 flex justify-center items-end gap-2 shadow-xl rounded-bl-lg rounded-tr-lg  px-1 py-1">
                <div className="text-sm px-2 py-1 max-w-[30rem] text-slate-900">
                  {msg.content}
                </div>
                <div className="text-[10px] text-black">{timeOnly}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex gap-0">
              
            <div className="rounded-lg text-white flex flex-col items-center justify-start  mx-2">
              {showAvatar && 
                <div className="text-slate-900 font-semibold text-xs rounded-t-lg w-full text-end py-1">
                  {msg.sender.name}
                </div>
              }
              <div className="bg-teal-400 flex justify-center items-end gap-2 shadow-xl rounded-br-lg rounded-tl-lg  px-1 py-1">
                <div className="text-sm px-2 py-1 max-w-[30rem] text-slate-900">
                  {msg.content}
                </div>
                <div className="text-[10px] text-black">{timeOnly}</div>
              </div>
            </div>
            <div className={`${!showAvatar ? 'opacity-0' : ""}`}>
                <Avatar authenticatedUser={msg.sender.name}  />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Message