import { Avatar } from "./Avatar"

const Message =  ({msg ,authenticatedUser, previousUsername}:{msg : string, authenticatedUser: string, previousUsername:string}) => {

  function convertBufferToString(bufferData :any) {
    if (!bufferData || !bufferData.type || bufferData.type !== 'Buffer') {
      return null; // Handle invalid data or non-Buffer type
    }
  
    // Use TextDecoder for modern browsers (recommended)
    if (typeof TextDecoder === 'function') {
      const decoder = new TextDecoder();
      return decoder.decode(new Uint8Array(bufferData.data));
    }
  
    // Fallback for older browsers (less efficient) 
    return String.fromCharCode.apply(String, bufferData.data);
  }

  const data= convertBufferToString(JSON.parse(msg).data)
  // console.log('%%%%%%%%%%%%%%%%%%%%',data);
  // const username = JSON.parse(data).username || null;
  const username = JSON.parse(data).username || null;
  // const message = JSON.parse(data).value || null;
  const message = JSON.parse(data).content || null;
  const sent = JSON.parse(data).sentAt;
  const timeOnly = new Date(sent).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit'
  });
  // console.log('((((((((((',username)
  // console.log('THIS IS Message :', username , message);
  const pos = authenticatedUser===username ? "end" : "start";
  const previousUsername1 = convertBufferToString(JSON.parse(previousUsername || '{}').data);
  console.log('Hiiiii', JSON.parse(previousUsername1 || '{}').username)
  const showAvatar = JSON.parse(previousUsername1 || '{}').username !== username
  console.log(previousUsername1 , username)


  return (
    <div className={`flex justify-${pos} max-w-full`}>
      <div className="flex gap-1 justify-end items-center p-1">
        {pos === 'start' ? (
          <div className="flex gap-0">
              <div className={`${!showAvatar ? 'opacity-0' : ""}`}>
                <Avatar authenticatedUser={username}  />
              </div>
            <div className="rounded-lg text-white flex flex-col items-center justify-start  mx-2">
              {showAvatar && 
                <div className="text-slate-900 font-semibold text-xs rounded-t-lg w-full text-start py-1">
                  {username}
                </div>
              }
              <div className="bg-slate-50 flex justify-center items-end gap-2 shadow-xl rounded-bl-lg rounded-tr-lg  px-1 py-1">
                <div className="text-sm px-2 py-1 max-w-[30rem] text-slate-900">
                  {message}
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
                  {username}
                </div>
              }
              <div className="bg-teal-400 flex justify-center items-end gap-2 shadow-xl rounded-br-lg rounded-tl-lg  px-1 py-1">
                <div className="text-sm px-2 py-1 max-w-[30rem] text-slate-900">
                  {message}
                </div>
                <div className="text-[10px] text-black">{timeOnly}</div>
              </div>
            </div>
            <div className={`${!showAvatar ? 'opacity-0' : ""}`}>
                <Avatar authenticatedUser={username}  />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Message