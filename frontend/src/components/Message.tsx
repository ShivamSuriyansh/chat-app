import { Avatar } from "./Avatar"

const Message =  ({msg ,authenticatedUser}:{msg : string, authenticatedUser: string}) => {

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
  const username = JSON.parse(data).username || null;
  const message = JSON.parse(data).value || null;
  console.log('THIS IS Message :', username , message);
  const pos = authenticatedUser===username ? "end" : "start";
  return (
    <div className={`flex justify-${pos} max-w-lg`}>
    <div className=" flex gap-2 justify-start items-center p-1 mt-2">
    {pos === 'start' ? (
  <div className=" flex gap-1">
    <Avatar authenticatedUser={username} />
    <div className="bg-green-400 rounded-lg text-white flex flex-col items-center justify-start shadow-lg">
      <div className="text-slate-500 font-semibold text-xs bg-green-500 rounded-t-lg px-2 w-full">
        {username}
      </div>
      <div className="text-sm px-2 py-1 max-w-[20rem]">{message}</div>
    </div>
  </div>
) : (
  <div className="flex gap-1 ">
    <div className="bg-green-400 rounded-lg text-white flex flex-col items-center justify-start shadow-lg">
      <div className="text-slate-500 font-semibold text-xs bg-green-500 rounded-t-lg px-2 w-full">
        {username}
      </div>
      <div className="text-sm px-2 py-1 max-w-[20rem]">{message}</div>
    </div>
    <Avatar authenticatedUser={username} />
  </div>
)}

    </div>
    </div>
  )
}

export default Message