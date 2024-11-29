import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Landingpage from './components/landingpage/Landingpage';
import Login from './components/Login/Login';
import { Signup } from './components/signup/signup';
import { Groupcreation } from './components/GroupCreation/Groupcreation';
import { UserComponent } from './components/UserComponent/UserComponent';
import { Groupsets } from './components/groupsets/groupsets';
import { Help } from './components/Setting/Setting';
import { Password } from './components/YourGroups/YourGroups';
import { UserPage } from './components/UserPage/UserPage';
import { ForgetPassword } from './components/ForgetPassword/ForgetPassword';
import { Grouppage } from './components/grouppage/grouppage';
import { UserProfile } from './components/UserProfile/UserProfile';
import { AdminLogin } from './components/loginAdmin/loginadmin';
import { AdminPage } from './components/AdimPage/AdminPage'; 
import { NotificationProvider } from './components/assets/NotificationContext';

function App() {
  return (
    <div>
      <BrowserRouter>
        <NotificationProvider>
          <Routes>
            <Route path='/' element={<Landingpage />} />
            <Route path="/login" element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/ForgetPassword' element={<ForgetPassword />} />
            <Route path='/Groupcreation' element={<Groupcreation />} />
            <Route path='/Usercomponent' element={<UserComponent />} />
            <Route path='/groupsets' element={<Groupsets />} />
            <Route path='/Setting' element={<Help />} />
            <Route path='/YourGroups' element={<Password />} />
            <Route path='/Userpage' element={<UserPage />} />
            <Route path="/groups/:groupId"element={<Grouppage />} />
            <Route path="/user/:email" element={<UserProfile />} />
            <Route path='adminloginpage' element={<AdminLogin />} />
            <Route path='AdminPage' element={<AdminPage />} />
          </Routes>
        </NotificationProvider>
        
      </BrowserRouter>
    </div>
  );
}

export default App;
