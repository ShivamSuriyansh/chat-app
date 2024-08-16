import { useEffect, useState } from "react";
import axios from "axios";
import { useRecoilValue } from "recoil";
import userAccountState from "../recoil/States";
import { deplUrlHttp } from "../config";
import Loader from "./Loader";
import { Avatar } from "./Avatar";

interface sender {
  id:string;
  username: string;
  name:string;
}

interface FriendRequests {
  id: string;
  senderId: string;
  receiverId: string;
  status: string;
  sentAt: string;
  sender: sender
}

const FriendRequests = ({ handleToggleFriendRequests }: { handleToggleFriendRequests: () => void }) => {
  const [requests, setRequests] = useState<FriendRequests[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const userAccount = useRecoilValue(userAccountState);

  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const response = await axios.get(`${deplUrlHttp}/api/friendRequest`, {
          params: {
            receiverId: userAccount.userId,
          },
        });
        setRequests(response.data);
      } catch (error) {
        console.error("Error fetching friend requests:", error);
      } finally {
        setLoading(false); // Set loading to false once the request is done
      }
    };

    fetchFriendRequests();
  }, [userAccount.userId]);

  const handleAccept =async (id : string)=>{
    const request  = requests.find(req => req.id === id);
    if(!request)return;
    console.log(request);
    // send a request to backend to update the request state to ACCEPTED and enter in the friend model 
    const {senderId , receiverId} = request ;
    try{

      await axios.post(`${deplUrlHttp}/api/acceptRequest`, {
        senderId,
        receiverId
      })
      setRequests(prev => prev.filter(req => req.id !== id));
    }catch(e){
      console.error("Error declining friend request:", e);
    }
  }

  const handleDecline =async (id: string) => {
    const request = requests.find(req => req.id === id);
    if (!request) return;
  
    try {
      // Send request to backend to update the request status to REJECTED
      await axios.post(`${deplUrlHttp}/api/declineRequest`, {
        senderId: request.senderId,
        receiverId: request.receiverId,
        status: 'REJECTED'
      });
  
      setRequests(prev => prev.filter(req => req.id !== id));
    } catch (error) {
      console.error("Error declining friend request:", error);
    }
  };

  return (
    <div className="w-full z-10 max-w-md bg-teal-900 p-6 rounded-lg shadow-lg relative">
      <button
        onClick={handleToggleFriendRequests}
        className="absolute top-2 right-2 text-gray-200 text-2xl hover:text-gray-100"
      >
        &times;
      </button>
      <h2 className="text-xl font-semibold mb-4 text-white">Friend Requests</h2>
      
      {loading ? (
        <Loader /> // Show Loader while fetching data
      ) : requests.length > 0 ? (
        <ul className="list-disc pl-5 flex flex-col justify-center items-between gap-2">
          {requests.map((request) => (
            <li key={request.id} className="flex justify-between items-center mb-2">
              <div className=" flex items-center justify-center gap-2">
                <Avatar authenticatedUser={request.sender.name} />
                <span className="text-gray-100 ">{request.sender.name}</span>
              </div>
              <div className="flex">
                <button onClick={()=>handleAccept(request.id)} className="py-1 px-3 text-sm font-medium text-white bg-teal-600 rounded-lg hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50">
                  Accept
                </button>
                <button onClick={()=>handleDecline(request.id)} className="ml-2 py-1 px-3 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50">
                  Decline
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className=" text-white/50">No friend requests</p>
      )}
    </div>
  );
};

export default FriendRequests;
