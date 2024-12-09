import React from 'react';
import ReactDOM from 'react-dom/client';
import './app/component/app.css';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import { RequireAuthRoute } from './app/core/RequireAuthRoute';
import { AuthProvider } from './app/core/AuthProvider';
import {ChatRoomProvider} from './app/core/ChatRoomProvider'
import { LoginComponent } from './app/page/Login/LoginComponent';
import {App} from './app/page/App/App';
import { SignupComponent } from './app/page/Signup/SignupComponent';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider >
      <BrowserRouter>
          <Routes>
            <Route path={'/login'} element={<LoginComponent />} />
            <Route 
              path='/'
              element={
                <RequireAuthRoute>
                  <App />
                </RequireAuthRoute>
              }
            />
            <Route path='/sign-up' element={<SignupComponent />}/>
          </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
