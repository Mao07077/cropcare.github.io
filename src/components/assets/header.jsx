import React from 'react';
import logo from '../assets/logo512.png'
import './headers.css'
const Header = () => {
  return (
            <div className='cont'>
                <img className='logoos' src={logo} /> 
             </div>
  );
}

export { Header };