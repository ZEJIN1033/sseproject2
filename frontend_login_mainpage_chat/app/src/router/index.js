import { lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom';

const Home = lazy(() => import('../views/home/index'))
const Login = lazy(() => import('../views/login/index'))
const Register = lazy(() => import('../views/register/index'))
const Chat = lazy(() =>import('../views/chat/index'))
const AsyncComponent = (Component) => {
    return (
     <Suspense fallback={"loading"}>
        <Component/>
    </Suspense>
    )
}
const router = [
    {
        path: '/',
        element: <Navigate to="/home"/>,
    },
    {
        path: '/home',
        element:AsyncComponent(Home),
        title:'Home page'
    },
    {
        path: '/login',
        element:AsyncComponent(Login),
        title:'Login'
    },
    {
        path: '/register',
        element:AsyncComponent(Register),
        title:'Register'
    },
    {
        path: '/chat',
        element: AsyncComponent(Chat),
        title:'Tutor'
    }
]
export default router