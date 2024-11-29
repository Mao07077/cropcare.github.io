import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../../config/firebase';
import bbg from '../assets/lnd.png';
import loggo from '../assets/logo512.png';
import './ForgetPassword.css';

const ForgetPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSendOTP = async () => {
    try {
      await auth.sendPasswordResetEmail(email);
      console.log('OTP sent to:', email);
    } catch (error) {
      console.error('Error sending OTP:', error.message);
    }
  };

  const handleResetPassword = async () => {
    try {
      await auth.confirmPasswordReset(otp, password);
      console.log('Password reset successfully');
    } catch (error) {
      console.error('Error resetting password:', error.message);
    }
  };

  return (
    <div>
      <div className="bb">
        <div className="frame">
          <div className="ind">Reset Password</div>
          <div className="isignn">
            <div className="email-input">
              <input
                type="email"
                placeholder="Email:"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button className='sendotp' onClick={handleSendOTP}>Send OTP</button>
            </div>
            <input type="text" placeholder="OTP:" value={otp} onChange={(e) => setOtp(e.target.value)} />
            <input type="password" placeholder="Password:" value={password} onChange={(e) => setPassword(e.target.value)} />
            <input
              type="password"
              placeholder="Confirm Password:"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Link to={'/login'} className="Alaccount">
              <span>Back to log in?</span>
            </Link>
            <div className='reseet'>
              <button className='reset' onClick={handleResetPassword}>Reset</button>
            </div>
          </div>
        </div>
        <img className="logo" src={loggo} alt="logo" />
        <div className="slo">CropCare, <br/> a farmer’s flair.</div>
        <img className="bck" src={bbg} alt="background" />
      </div>
    </div>
  );
}

export { ForgetPassword };
