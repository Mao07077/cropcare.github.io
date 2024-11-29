import React, { useState } from 'react';
import './signup.css';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';
import { db, auth } from '../../config/firebase';
import bbg from '../assets/lnd.png';
import logo from '../assets/logo512.png';

export const Signup = () => {
  const history = useNavigate();
  const signindata = collection(db, 'signupd');
  const userAccCollection = collection(db, 'UserAcc');

  const [newemail, setemail] = useState('');
  const [newpassword, setpassword] = useState('');
  const [newCpassword, setCpassword] = useState('');
  const [newFname, setFname] = useState('');
  const [newLname, setLname] = useState('');
  const [error, setError] = useState(null);

  const signup = async () => {
    if (newpassword !== newCpassword) {
      setError('Passwords do not match. Please try again.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, newemail, newpassword);
      const user = userCredential.user;

      await addDoc(signindata, {
        UserId: user.uid,
        Email: newemail,
        Fname: newFname,
        Lname: newLname,
        Password: newpassword
      });
      const userAccData = {
        UserId: user.uid,
        Email: newemail,
        Fname: newFname,
        Lname: newLname,
      };

      await addDoc(userAccCollection, userAccData);

      history('/login');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    
        <div className="bb">
      <div className="frame">
      <img className="logo" src={logo} alt="logo" />
        <div className="ind">Sign up</div>
        <div className="FnLs">
          <input
            type="text"
            placeholder="First Name:"
            onChange={(e) => setFname(e.target.value)}
          />
          <input
            type="text"
            placeholder="Last Name:"
            onChange={(e) => setLname(e.target.value)}
          />
        </div>
        <div className="isign">
          <input
            type="email"
            placeholder="Email:"
            onChange={(e) => setemail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password:"
            onChange={(e) => setpassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm Password:"
            onChange={(e) => setCpassword(e.target.value)}
          />
          <Link to={'/login'} className="Alaccount">
            <span>Already have an account?</span>
          </Link>
        </div>
        <div className="signnn">
          <button className='signn' onClick={signup}>Sign Up</button>
        </div>
        {error && <div className="error-message">{error}</div>}
      </div>
                  <img className="bck" src={bbg} alt="background" />
    </div>
  );
};

