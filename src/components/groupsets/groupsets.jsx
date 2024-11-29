import React from 'react'
import { Header } from '../assets/header'
import { Link } from 'react-router-dom';
import bbg from'../assets/bbg.png'
import uclo from '../assets/uslo.png'

const Groupsets = () => {
  return (
    <div className='bg'>
      <Header/>
      <div className="rectanglee">
        <img className='iclo' src={uclo}/>
        <div className='btonn'>  
        <Link to={'/Usercomponent'}>
        <button className="setting">Account</button>
          </Link>
          <Link to={'/Password'}>
        <button className="setting">Password</button>
          </Link>
          <Link to={'/groupsets'}>
        <button className="setting">Groups</button>
          </Link>
          <Link to={'/help'}>
        <button className="setting">Help</button>
          </Link>
    </div> 
        </div>
      <div className='FRr'>
      <div className="CreateNewGroup">Create New Group</div>
    <div className='conte'>
    <div className="textt">Create New Group</div>
      <div className='inputt'> 
          <input type='text'/>
      </div>           
      <div className="textt">Create New Group</div>
      <div className='inputt'>         
          <input type='text'/>       
        </div>
      </div>                      
        </div>             
    <img className="bck" src={bbg} />
    </div>
  )
}

export {Groupsets}
