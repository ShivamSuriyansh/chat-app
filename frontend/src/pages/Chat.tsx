
import Message from "../components/Message"

const Chat = ({text , send , value , setValue ,authenticatedUser}:{text : any ,  send :(value:string)=>void , value :string , setValue : (value:string)=>void ,authenticatedUser:string}) => {
  return (
    <div className=" flex flex-col gap-2  p-2">
    <div className=" bg-green-200 w-[30rem] p-10 rounded-xl flex flex-col gap-4 max-h-[30rem] overflow-auto min-h-[25rem] shadow-lg">
        <div className=" message">
            {text && text.map((msg: string , i : number)=> (
            <div key={i}>
                <Message msg={msg} authenticatedUser={authenticatedUser} />
            </div>))}
        </div>
        
    </div>
    <div className=" send-input flex gap-2 w-full mt-3 "> 
            <input type="text" value={value}  onChange={(e)=> setValue(e.target.value)} placeholder="message" className=" bg-white text-black p-2 w-[27.5rem] rounded-2xl placeholder:text-slate-400 ring-2 ring-lime-200 focus:ring-lime-500 focus:outline-none text-wrap" />
            <button onClick={()=>{
                send(value);
                setValue('');
                }} className=" bg-slate-800 border border-slate-950 rounded-full text-white p-2 hover:bg-black hover:border hover:border-slate-700"> 
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                </svg>
             </button>
        </div>
    </div>
  )
}

export default Chat