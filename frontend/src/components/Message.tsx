import { Avatar } from "./Avatar"

const Message = ({msg}:{msg : string}) => {
  return (
    <div className=" flex gap-2 justify-start items-center p-1">
      <div> <Avatar /></div>
      <div className=" bg-green-400 rounded-xl text-white px-3 py-2 mt-2 flex gap-2 item-center justify-center">
          <div> {msg}</div>
      </div>
    </div>
  )
}

export default Message