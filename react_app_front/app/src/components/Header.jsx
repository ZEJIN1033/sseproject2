import { useNavigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';

export default function Header({onNewChat}) {
    const navigate = useNavigate();
    const toHome = () => {
        navigate('/home');
    };

    return (
        <div className="flex flex-row p-4 bg-slate-500 rounded-xl my-4">
            <p className="text-3xl text-slate-200 font-semibold grow">Machine Learning Mentor</p>
            <button
                className="bg-slate-400 hover:bg-pink-400 text-white font-bold py-2 px-4 rounded mr-2"
                onClick={toHome}
            >Back</button>

            <button
                className="bg-slate-400 hover:bg-pink-400 text-white font-bold py-2 px-4 rounded"
                onClick={onNewChat}
            >New chat</button>
        </div>
    )
}