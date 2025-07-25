import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainPage from './components/MainPage/MainPage';
import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';
import DetailsPage from './components/DetailsPage/DetailsPage';  // <-- Existing import
import SearchPage from './components/SearchPage/SearchPage';      // <-- Added import
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Navbar from './components/Navbar/Navbar';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* the final code will not pass the products to every page, but each page will call the server API */}
        <Route path="/" element={<MainPage />} />
        <Route path="/app" element={<MainPage />} />
        <Route path="/app/login" element={<LoginPage />} />
        <Route path="/app/register" element={<RegisterPage />} />
        <Route path="/app/product/:productId" element={<DetailsPage />} />  {/* <-- Existing route */}
        <Route path="/app/search" element={<SearchPage />} />               {/* <-- Added route */}
      </Routes>
    </>
  );
}

export default App;
