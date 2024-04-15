import { Avatar } from "./Avatar"

const Message = ({msg ,authenticatedUser}:{msg : string, authenticatedUser:string}) => {
  console.log('##########', authenticatedUser);
  return (
    <div className=" flex gap-2 justify-start items-center p-1 mt-2">
      <div> <Avatar authenticatedUser={msg.split('*')[1]} /></div>
      <div className=" bg-green-400 rounded-xl text-white px-3 py-2 flex  gap-2 item-center justify-center shadow-lg">
          <div> {msg.split('*')[0]}</div>
      </div>
    </div>
  )
}

export default Message