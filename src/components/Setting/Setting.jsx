import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../assets/header2.0';
import './setting.css';
import log from '../assets/logout.png';

const Help = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className='bw'>
      <Header />
      <div className='FfRr'>
        <div className='conten'>
          <img className='log' src={log} alt='logout' />
          <p className='in'>Are you sure you want to log out from CropCare?</p>
          <button className='outkn' onClick={handleLogout}>
            Log out
          </button>
        </div>
      </div>
    </div>
  );
};

export { Help };
