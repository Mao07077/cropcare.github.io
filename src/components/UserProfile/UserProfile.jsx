import React, { useState, useEffect } from 'react';
import { Header } from '../assets/header2.0';
import './UserProfile.css';
import { db } from '../../config/firebase';
import {
  collection,
  where,
  query,
  getDocs,
} from 'firebase/firestore';

const UserProfile = ({ userId }) => {
  const [profilePic, setProfilePic] = useState('');
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState('');
  const [aboutMe, setAboutMe] = useState('');

  useEffect(() => {
    if (!userId) {
      console.error('UserId is undefined.');
      return;
    }

    const q = query(collection(db, 'signupd'), where('userId', '==', userId));

    getDocs(q)
      .then((querySnapshot) => {
        if (!querySnapshot.empty) {
          const userData = querySnapshot.docs[0].data();
          setPhone(userData.phone || '');
          setAddress(userData.address || '');
          setBirthday(userData.birthday || '');
          setGender(userData.gender || '');
          setAboutMe(userData.aboutMe || '');

          if (userData.profilePic) {
            setProfilePic(userData.profilePic);
          }

          if (userData.coverPhoto) {
            setCoverPhoto(userData.coverPhoto);
          }

          setUserEmail(userData.email || '');
        }
      })
      .catch((error) => {
        console.error('Error fetching user information: ', error);
      });
  }, [db, userId]);

  return (
    <div className='bg'>
      <Header />
      <div className='FRr'>
        <div className='CreateNewGroup'>User Profile</div>
        <div className='conte'>
          <div className='inputt'>
            <img
              className='difo'
              src={profilePic}
              alt='Profile'
            />
            <p className='email'>{userEmail}</p>
          </div>
          <div className='tabs'>
            <p className='tab active'>Profile</p>
          </div>
          <div className='timeline-content'>
            {coverPhoto ? (
              <img
                className='coverPhoto'
                src={coverPhoto}
                alt='Cover Photo'
              />
            ) : (
              <div className='no-coverPhoto'>
                No Cover Photo Available
              </div>
            )}
            <div className='informt'>
              <p>Phone: {phone}</p>
              <p>Address: {address}</p>
              <p>Birthday: {birthday}</p>
              <p>Gender: {gender}</p>
              <h3>About Me</h3>
              <h5>{aboutMe}</h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { UserProfile };
