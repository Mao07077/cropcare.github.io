import React, { useState, useEffect } from 'react';
import { Header } from '../assets/header';
import './AdminPage.css';
import { auth } from '../../config/firebase';
import GroupRequestTable from './GroupRequestTable'; 
import UsersAccountTable from './UsersAccountTable';
import GroupTable from './GroupTable';
import ReportTable from './ReportTable';



const AdminPage = () => {
  const [content, setContent] = useState(<UsersAccountTable />);
  const [profilePic, setProfilePic] = useState(null);
  const handleButtonClick = async (buttonNumber) => {
    switch (buttonNumber) {
      case 1:
        setContent(<UsersAccountTable />);
        break;
      case 2:
        setContent(<ReportTable/>);
        break;
      case 3:
        setContent(<GroupRequestTable />);
        break;
      case 4:
        setContent(<GroupTable />);
        break;
    }
  };

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    const storedProfilePic = localStorage.getItem(`profilePic_${userId}`);
    if (storedProfilePic) {
      setProfilePic(storedProfilePic);
    }

    return () => {
    };
  }, [auth.currentUser?.uid]);


  return (
    <div className='bg'>
      <Header />
      <div className='greeninfo'>
        {profilePic ? (
          <img className='profiley' src={profilePic} alt='Profile' />
        ) : (
          <img className='defaultProfilePic' src='default-profile-pic.jpg' alt='Default Profile' />
        )}
        <div className='buttons'>
          <button className='pindot' onClick={() => handleButtonClick(1)}>Users Account</button>
          <button className='pindot' onClick={() => handleButtonClick(2)}>Reports</button>
          <button className='pindot' onClick={() => handleButtonClick(3)}>Group Requests</button>
          <button className='pindot' onClick={() => handleButtonClick(4)}>Groups</button>
        </div>
      </div>
      <div className='contents'>
        {content}
      </div>
    </div>
  );
};

export { AdminPage };