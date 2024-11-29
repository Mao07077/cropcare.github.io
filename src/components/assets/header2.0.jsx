import React, { useState, useEffect } from 'react';
import logo from '../assets/logo512.png';
import notif from '../assets/notif.png';
import home from '../assets/home.png';
import './headers2.0.css';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { auth, db } from '../../config/firebase';
import { useNotification } from './NotificationContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';

const Header = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const { notifications } = useNotification();
  const [showNotification, setShowNotification] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    const storedProfilePic = localStorage.getItem(`profilePic_${userId}`);

    if (storedProfilePic) {
      setProfilePic(storedProfilePic);
    }

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserEmail(user.email || '');
      } else {
        setUserEmail('');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
    setShowNotification(false);
  };

  const handleNotifClick = () => {
    setShowNotification(!showNotification);
  };

  const handleHomeClick = () => {
    console.log('Home button clicked!');
  };

  const handleGroupClick = () => {
    setSearchResults([]);
  };

  const handleSearchChange = async (event) => {
    const input = event.target.value;
    setSearchInput(input);

    try {
      const groupsRef = collection(db, 'Groups');
      const q = query(groupsRef, where('groupName', '>=', input));
      const snapshot = await getDocs(q);

      const groups = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setSearchResults(groups);
    } catch (error) {
      console.error('Error searching groups:', error);
    }
  };

  return (
    <div className={`contt ${isMenuOpen ? 'menu-open' : ''}`}>
      <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="menu"
        className={`hamburger-button ${isMenuOpen ? 'open' : ''}`}
        onClick={handleMenuClick}
      >
        <MenuIcon />
      </IconButton>

      <img className='logooss' src={logo} alt="Company Logo" />

      <div className='search-container'>
        <input
          type='text'
          placeholder='Search groups...'
          className='search-bar'
          value={searchInput}
          onChange={handleSearchChange}
        />
        {searchResults.length > 0 && (
          <ul className="search-results">
            {searchResults.map((group) => (
              <li key={group.id}>
                <Link to={`/groups/${group.id}`} onClick={handleGroupClick}>
                  {group.groupName}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Link to="/UserPage" className="home-link" onClick={handleHomeClick}>
        <img className='home' src={home} alt='home' />
      </Link>

      <a onClick={handleNotifClick}>
        <img className='notif' src={notif} alt='notif' />
      </a>

      {isMenuOpen && (
        <div className="responsive-menu">
          {profilePic && <img className='profile-pic' src={profilePic} alt='Profile' />}
          <p className='eml'>{userEmail}</p>

          <div className='btonn'>
            <Link to={'/Usercomponent'}>
              <button className="setting">Account</button>
            </Link>
            <Link to={'/Groupcreation'}>
              <button className="setting">Create Groups</button>
            </Link>
            <Link to={'/YourGroups'}>
              <button className="setting">Your Groups</button>
            </Link>
            <Link to={'/Setting'}>
              <button className="setting">Log Out</button>
            </Link>
          </div>
        </div>
      )}

{showNotification && (
  <div className="notification-container">
    <p>Your notification content goes here.</p>
    {notifications.map((notification, index) => (
      <div key={index}>{notification.message}</div>
    ))}
  </div>
)}
    </div>
  );
};

export { Header };