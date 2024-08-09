import { useNavigate } from "react-router-dom";
import JoinGroup from "../components/JoinGroup";

interface LandingProps {
    // code: string | undefined;
    setCode: React.Dispatch<React.SetStateAction<string | undefined>>;
    // roomCode: string | undefined;
    setRoomCode: React.Dispatch<React.SetStateAction<string | undefined>>;
  }

const Landing: React.FC<LandingProps> = ({ setCode, setRoomCode })=>{
    const navigate = useNavigate();
    return (
        <div className="landing-page flex justify-center items-center gap-4">
            <JoinGroup setRoomCode={setRoomCode} setCode={setCode} />
            <button onClick={()=>navigate('/login')} className="flex-shrink-0 z-10 inline-flex items-center py-2.5 px-4 text-sm font-medium text-center text-white bg-blue-700 dark:bg-blue-600 border hover:bg-blue-800 dark:hover:bg-blue-700 rounded-s-lg border-blue-700 dark:border-blue-600 hover:border-blue-700 dark:hover:border-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
                Login
            </button>
            
        </div>
    )
}
export default Landing;