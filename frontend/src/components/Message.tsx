import { Avatar } from "./Avatar"

const Message =  ({msg ,authenticatedUser}:{msg : string, authenticatedUser:string}) => {

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
  const username = JSON.parse(data).username;
  const message = JSON.parse(data).value;
  console.log('THIS IS MESSAFGE :', username , message);
  return (
    <div className=" flex gap-2 justify-start items-center p-1 mt-2">
      <div> <Avatar authenticatedUser={username} /></div>
      <div className=" bg-green-400 rounded-xl text-white px-3 py-2 flex  gap-2 item-center justify-center shadow-lg">
          <div> {message}</div>
      </div>
    </div>
  )
}

export default Message