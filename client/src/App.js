import { useState } from 'react';
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import HomePage from 'scenes/homePage';
import LoginPage from 'scenes/profilePage';
import ProfilePage from 'scenes/profilePage';

function App() {
    const mode = useState();

    return <div className='App'>
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<LoginPage />} />
                <Route path='/home' element={<HomePage />} />
                <Route path='/profile/:userId' element={<ProfilePage />} />       
            </Routes>
        </BrowserRouter>
    </div>;
}

export default App;
