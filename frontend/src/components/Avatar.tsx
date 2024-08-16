

export const Avatar = ({authenticatedUser}:{authenticatedUser:string}) => {
  return <div className="relative flex items-center z-0 justify-center w-10 h-10 overflow-hidden shadow-lg bg-slate-50 rounded-full ">
  <span className="font-medium text-black ">{authenticatedUser[0].toUpperCase()}</span>
</div>

}
