import axios from "axios";
import { useState } from "react";
import { deplUrlHttp } from "../config";
import { useRecoilState, useRecoilValue } from "recoil";
import userAccountState, { friendRequestState } from "../recoil/States";

const AddFriends = ({ handleToggleAddFriend , handleShowToast }: {handleToggleAddFriend: ()=>void, handleShowToast : ()=>void }) => {
  const [email, setEmail] = useState("");
  const [_ , setFriendRequest] = useRecoilState(friendRequestState);
  const userAccount = useRecoilValue(userAccountState);
  const handleSendRequest = async () => {
    console.log(userAccount.userId)
    if (!email) {
        console.log(email)
      return;
    }
    const friendRequest = await axios.post(`${deplUrlHttp}/api/friendRequest`, {
        senderId: userAccount.userId,
        receiverMail : email
    });
    console.log(friendRequest.data);
    setFriendRequest(friendRequest.data);
  };

  return (
    <div className="w-full z-1 h-full bg-teal-700 p-4 rounded-lg relative transition-all duration-300">
      <button
        onClick={handleToggleAddFriend}
        className="absolute top-2 right-2 text-white h-2 w-2 hover:text-gray-300"
        >
        &times;
      </button>
      
      <div className="mb-2 flex justify-between items-center">
        <label
          htmlFor="email-input"
          className="text-sm font-medium text-gray-900 dark:text-white"
          >
          Enter Email:
        </label>
      </div>
      
      <div className="flex items-center">
        <input
          id="email-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full py-2 px-4 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          placeholder="Enter friend's email"
          />
        
        <button
          onClick={()=>{
            handleSendRequest();
            handleShowToast();
            handleToggleAddFriend();
        }}
          className="ml-2 py-2 px-4 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50"
          type="button"
          >
          Send Request
        </button>
      </div>
    </div>
  );
};

export default AddFriends;
