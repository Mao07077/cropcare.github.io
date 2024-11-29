import React, { useState } from 'react';
import './login.css';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { db } from '../../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import bg from '../assets/lnd.png';
import logoses from '../assets/logo512.png';

const Login = () => {
  const history = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const auth = getAuth();

  const login = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userData = userCredential.user;
      const loggedUsersCollection = collection(db, 'loggedUsers');

      await addDoc(loggedUsersCollection, {
        email: userData.email,
        userId: userData.uid,
        timestamp: serverTimestamp(),
      });

      history('/Userpage');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className='bb'>
      <div className="Frame">
      <img className="logoses" src={logoses} alt="logo" />
        <div className='inputs'>
          <div className='input'>
            <input type='email' placeholder='Email' onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className='input'>
            <input type='password' placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
          </div>
        </div>
        <div className='click'>
          <Link to={'/signup'} className="SignUp">
            <span>Sign up</span>
          </Link>
          <Link to={'/ForgetPassword'} className="ForgotPassword">
            <span>Forgot Password ?</span>
          </Link>
        </div>
        {error && <div className="error-message">{error}</div>}
        <div className='logcon'>
          <button className="LogIn" onClick={login}>Log in</button>
        </div>
      </div>
      <img className="bgg" src={bg} alt="background" />
    </div>
    
  );
};

export default Login;
