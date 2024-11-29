import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { db } from '../../config/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import bg from '../assets/bg.jpg';

const AdminLogin = () => {
  const history = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const auth = getAuth();

  const login = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userData = userCredential.user;

      const adminQuery = query(collection(db, 'AdminAcc'), where('Email', '==', userData.email));
      const adminSnapshot = await getDocs(adminQuery);

      if (adminSnapshot.size > 0) {
        const loggedAdminsCollection = collection(db, 'loggedAdmins');
        await addDoc(loggedAdminsCollection, {
          email: userData.email,
          adminId: userData.uid,
          timestamp: serverTimestamp(),
        });

        history('/AdminPage');
      } else {
        setError('Access denied. You are not an admin.');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className='bb'>
      <div className="Frame">
        <div className='inputs'>
          <div className='input'>
            <input type='email' placeholder='Email' onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className='input'>
            <input type='password' placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
          </div>
        </div>
        <div className='click'>
        </div>
        {error && <div className="error-message">{error}</div>}
        <div className='logcon'>
          <button className="LogIn" onClick={login}>Log in</button>
        </div>
        <img className="imgg" src={bg} alt="background" />
      </div>
      <img className="bgg" src={bg} alt="background" />
    </div>
  );
};

export { AdminLogin };
