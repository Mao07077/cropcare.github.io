import React, { useState, useRef, useEffect } from 'react';
import { Header } from '../assets/header2.0';
import './Usercomponent.css';
import pro from '../assets/prodif.png';
import edit from '../assets/editicon.png';
import { st } from '../../config/firebase';
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from 'firebase/storage';
import {
  getAuth,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
} from 'firebase/firestore';

const UserComponent = () => {
  const [profilePic, setProfilePic] = useState(pro);
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [birthday, setBirthday] = useState('');
  const [gender, setGender] = useState('');
  const [aboutMe, setAboutMe] = useState('');
  const [selectedTab, setSelectedTab] = useState('timeline');
  const [isEditMode, setIsEditMode] = useState(false);

  const fileInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userId = user.uid;
        const userDocRef = doc(db, 'users', userId);

        getDoc(userDocRef)
          .then((docSnapshot) => {
            if (docSnapshot.exists()) {
              const userData = docSnapshot.data();
              setPhone(userData.phone || '');
              setAddress(userData.address || '');
              setBirthday(userData.birthday || '');
              setGender(userData.gender || '');
              setAboutMe(userData.aboutMe || '');
            }
          })
          .catch((error) => {
            console.error('Error fetching user information: ', error);
          });

        const storedProfilePic = localStorage.getItem(
          `profilePic_${userId}`
        );
        const storedCoverPhoto = localStorage.getItem(
          `coverPhoto_${userId}`
        );

        if (storedProfilePic) {
          setProfilePic(storedProfilePic);
        }

        if (storedCoverPhoto) {
          setCoverPhoto(storedCoverPhoto);
        }

        setEmail(user.email || '');
      }
    });

    return () => unsubscribe();
  }, [auth, db]);

  const handleImageChange = (e) => {
    const file = fileInputRef.current.files[0];

    if (file) {
      const storageRef = ref(
        st,
        `profilePictures/${auth.currentUser.uid}/${email}`
      );

      uploadBytes(storageRef, file)
        .then(() => {
          getDownloadURL(storageRef).then((downloadURL) => {
            setProfilePic(downloadURL);
            localStorage.setItem(
              `profilePic_${auth.currentUser.uid}`,
              downloadURL
            );
          });
        })
        .catch((error) => {
          console.error('Error uploading image: ', error);
        });
    }
  };

  const handleCoverPhotoChange = (e) => {
    const file = coverInputRef.current.files[0];

    if (file) {
      const storageRef = ref(
        st,
        `coverPhotos/${auth.currentUser.uid}/${file.name}`
      );

      uploadBytes(storageRef, file)
        .then(() => {
          getDownloadURL(storageRef).then((downloadURL) => {
            setCoverPhoto(downloadURL);
            localStorage.setItem(
              `coverPhoto_${auth.currentUser.uid}`,
              downloadURL
            );
          });
        })
        .catch((error) => {
          console.error('Error uploading cover photo: ', error);
        });
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleCoverPhotoClick = () => {
    coverInputRef.current.click();
  };

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleSaveClick = async () => {
    try {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);

      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        await setDoc(
          userDocRef,
          {
            phone,
            address,
            birthday,
            gender,
            aboutMe,
          },
          { merge: true }
        );
      } else {
        await setDoc(userDocRef, {
          phone,
          address,
          birthday,
          gender,
          aboutMe,
        });
      }

      setIsEditMode(false);
    } catch (error) {
      console.error('Error saving user information: ', error);
    }
  };

  return (
    <div className='bg'>
      <Header />
      <div className='FRr'>
        <div className='CreateNewGroup'>Account</div>
        <div className='conte'>
          <div className='inputt'>
            <img
              className='difo'
              src={profilePic}
              alt='Profile'
              onClick={handleImageClick}
            />
            <input
              type='file'
              accept='image/*'
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />
            <input
              type='file'
              accept='image/*'
              ref={coverInputRef}
              style={{ display: 'none' }}
              onChange={handleCoverPhotoChange}
            />
            <p className='email'>{email}</p>
          </div>
          <div className='tabs'>
            <p
              className={`tab ${selectedTab === 'timeline' ? 'active' : ''}`}
              onClick={() => handleTabClick('timeline')}
            >
              Timeline
            </p>
            <p
              className={`tab ${selectedTab === 'about' ? 'active' : ''}`}
              onClick={() => handleTabClick('about')}
            >
              About
            </p>
          </div>
          {selectedTab === 'timeline' && (
            <div className='timeline-content'>
              {coverPhoto ? (
                <img
                  className='coverPhoto'
                  src={coverPhoto}
                  alt='Cover Photo'
                  onClick={handleCoverPhotoClick}
                />
              ) : (
                <div
                  className='no-coverPhoto'
                  onClick={handleCoverPhotoClick}
                >
                  Add Cover Photo
                </div>
              )}
              <div className='informt'>
                <div className='edit-btn-container'>
                  <img
                    className='edit'
                    src={edit}
                    onClick={handleEditClick}
                  />
                  {isEditMode && (
                    <button onClick={handleSaveClick}>Save</button>
                  )}
                </div>
                {isEditMode ? (
                  <>
                    <input
                      type='text'
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder='Phone'
                    />
                    <input
                      type='text'
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder='Address'
                    />
                    <input
                      type='text'
                      value={birthday}
                      onChange={(e) => setBirthday(e.target.value)}
                      placeholder='Birthday'
                    />
                    <input
                      type='text'
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      placeholder='Gender'
                    />
                  </>
                ) : (
                  <>
                    <p>Phone: {phone}</p>
                    <p>Address: {address}</p>
                    <p>Birthday: {birthday}</p>
                    <p>Gender: {gender}</p>
                  </>
                )}
              </div>
            </div>
          )}
          {selectedTab === 'about' && (
  <div className='about-content'>
    <div className='edit-btn-container'>
      <img
        className='edit'
        src={edit}
        onClick={handleEditClick}
      />
      {isEditMode && (
        <button onClick={handleSaveClick}>Save</button>
      )}
    </div>
    {isEditMode ? (
      <>
        <textarea className='inforto'
          value={aboutMe}
          onChange={(e) => setAboutMe(e.target.value)}
          placeholder='About Me'

        />
      </>
    ) : (
      <>
        <h3>about Me</h3>
        <h5>{aboutMe}</h5>
      </>
    )}
  </div>
)}
        </div>
      </div>
    </div>
  );
};

export { UserComponent };
