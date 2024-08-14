import { useNavigate } from "react-router-dom"
import axios from 'axios'
import { useState } from "react"

import { useRecoilState } from 'recoil';
import { deplUrlHttp } from "../config";
import userAccountState from "../recoil/States";




const Login = ({setToken ,setAuthenticatedUser} : {setToken : (token: string| null)=> void ,setAuthenticatedUser: (name: string)=> void}) => {

  const [username , setUsername] = useState<string>('');
  const [password , setPassword] = useState<string>('');
  const [userAccount, setUserAccount] = useRecoilState(userAccountState);

  const handleLogin = async (username : string , password:string )=>{
    //axios/ fetch request to /login route
    const response = await axios.post(`${deplUrlHttp}/api/login`, {
      username,
      password
    })
    console.log(response.data.user);
    setAuthenticatedUser(response.data.user.name);
    localStorage.setItem('token',response.data.token);
    setToken(localStorage.getItem("token"));
    setUserAccount({
      sender: '',
      receiver: '',
      content: '',
      status: '',
      userId: response.data.user.id,
      sentAt: '',
      username: response.data.user.name
    })
    navigate("/chat")
  }
  
  const navigate = useNavigate();
  console.log(userAccount)
  return (
    <section className=" w-full shadow-xl" >
  <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
    
      <div className="w-full bg-slate-900 rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-slate-50 md:text-2xl">
                  Sign in to your account
              </h1>
              <form className="space-y-4 md:space-y-6" action="#">
                  <div>
                      <label  className="block mb-2 text-sm font-medium text-slate-100 ">Your email</label>
                      <input type="email" name="email" id="email" value={username} onChange={(e)=>setUsername(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 " placeholder="name@company.com" required />
                  </div>
                  <div>
                      <label  className="block mb-2 text-sm font-medium text-slate-100 ">Password</label>
                      <input type="password" name="password" id="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="••••••••" className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 " required />
                  </div>
                  <div className="flex items-center justify-between">
                      <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 " required />
                          </div>
                          <div className="ml-3 text-sm">
                            <label  className="text-gray-300 ">Remember me</label>
                          </div>
                      </div>
                      <a href="#" className="text-sm font-medium text-slate-200 hover:underline">Forgot password?</a>
                  </div>
                  <button type="submit" onClick={()=>{
                    handleLogin(username , password)
                    }} className="w-full text-white border border-slate-500 hover:bg-slate-100 hover:text-black bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ">Sign in</button>
                  <p className="text-sm font-light text-gray-500 ">
                      Don’t have an account yet? <a href="signup" className="font-medium text-slate-100 hover:underline ">Sign up</a>
                  </p>
              </form>
          </div>
      </div>
  </div>
</section>
  )
}

export default Login