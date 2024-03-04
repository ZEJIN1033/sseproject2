import React from 'react';
import { useRoutes } from 'react-router-dom';
import { AuthProvider } from './services/AuthContext';
import routes from './router/index';
function App() {
    const element = useRoutes(routes)
    return (
        <AuthProvider>
            {element}
        </AuthProvider>
    )
}

export default App;
