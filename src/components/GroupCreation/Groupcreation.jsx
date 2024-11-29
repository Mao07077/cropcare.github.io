import React, { useState, useRef, useEffect } from 'react';
import { Header } from '../assets/header2.0';
import { useNavigate, Link } from 'react-router-dom';
import { db, auth } from '../../config/firebase';
import { addDoc, collection } from 'firebase/firestore';
import './groupcreation.css';

const Groupcreation = () => {
  const navigate = useNavigate();

  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [selectedOptions, setSelectedOptions] = useState('');
  const [isAgreed, setIsAgreed] = useState(false);
  const [error, setError] = useState('');

  const handleSelectChanges = (event) => {
    setSelectedOptions(event.target.value);
  };

  const handleAgreeChange = () => {
    setIsAgreed(!isAgreed);
  };

  const isCreateDisabled = !isAgreed || !groupName || !groupDescription || !selectedOptions;

  const handleCreate = async () => {
    try {
      if (!isAgreed || !groupName || !groupDescription || !selectedOptions) {
        setError('Please fill up all the required fields.');
        return;
      }

      const currentUser = auth.currentUser;

      if (!currentUser) {
        setError('User not authenticated. Please log in and try again.');
        return;
      }

      const docRef = await addDoc(collection(db, 'grouprequest'), {
        groupName,
        groupDescription,
        privacySetting: selectedOptions,
        agreed: isAgreed,
        creator: {
          uid: currentUser.uid,
          email: currentUser.email,
        },
      });

      setError('');

    
      if (window.confirm('Congratulations! You have created a group. Please wait for admin confirmation. Click OK to go to the homepage.')) {
        navigate('/UserPage');
      }
    } catch (error) {
      console.error('Error adding document: ', error);

      if (error.code === 'permission-denied') {
        setError('Permission denied. You may not have the necessary permissions to create a group.');
      } else {
        setError('Error creating the group. Please try again later.');
      }
    }
  };

  return (
    <div className='bg'>
      <Header />
      <div className='FR'>
        <div className="CreateNewGroup">Create New Group</div>
        <div className='frp'>
        <h4>CropCare Group Creation Terms and Conditions</h4>

Effective Date: [Insert Date]

Introduction:
1.1 These Terms and Conditions ("Terms") govern the creation and management of groups within CropCare, an agricultural community platform.

Group Creation Eligibility:
2.1 To create a group on CropCare, you must be a registered user of the platform.
2.2 You agree to provide accurate and up-to-date information during the group creation process.
2.3 CropCare reserves the right to reject or remove any group that violates these Terms or the platform's guidelines.

Group Purpose:
3.1 Groups created on CropCare must align with the platform's focus on agriculture, farming, and related topics.
3.2 The group purpose should be clearly defined, and the content shared within the group should be relevant to the specified purpose.

Group Administration:
4.1 As the creator of the group, you are the initial administrator and have the responsibility to manage and moderate the group content.
4.2 CropCare is not responsible for the actions or content shared within the groups, but reserves the right to intervene if the group violates platform policies.

Content Guidelines:
5.1 All content shared within the group must adhere to CropCare's Community Guidelines.
5.2 Prohibited content includes but is not limited to: hate speech, harassment, illegal activities, and any content that may harm the reputation of CropCare or its users.

Group Privacy:
6.1 Groups on CropCare may be public, private, or hidden. Group creators can choose the level of privacy during the creation process.
6.2 Public groups are accessible to all registered CropCare users, while private and hidden groups may have specific access criteria set by the group creator.

Membership:
7.1 Group membership may be open, closed, or by invitation only.
7.2 Group creators have the right to approve or reject membership requests based on their criteria.

Group Maintenance:
8.1 Group creators and administrators are responsible for maintaining the group's relevance and adherence to these Terms.
8.2 CropCare reserves the right to remove or disable groups that violate these Terms without prior notice.

Termination:
9.1 CropCare reserves the right to terminate or suspend group creation privileges for users who repeatedly violate these Terms or the platform's guidelines.

Updates to Terms:
10.1 CropCare may update these Terms from time to time. Users will be notified of any changes, and continued use of the platform and group creation services constitutes acceptance of the updated Terms.

By creating a group on CropCare, you agree to abide by these Terms and the platform's guidelines. CropCare reserves the right to take appropriate action, including the removal of groups, to ensure a positive and safe community experience.
        </div>
        <div className='conte'>
          <div className="textt">Name of the Group</div>
          <div className='inputt'>
            <input type='text' value={groupName} onChange={(e) => setGroupName(e.target.value)} />
          </div>
          <div className="textt">Description</div>
          <div className='inputt'>
            <input type='text' value={groupDescription} onChange={(e) => setGroupDescription(e.target.value)} />
          </div>
          <div className="textt">Privacy settings</div>
          <div className='inputt'>
            <select value={selectedOptions} onChange={handleSelectChanges}>
              <option value="none"></option>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
            <div className='bton'>
              <Link to={'/Userpage'}>
                <button className="Cancel">Cancel</button>
              </Link>
              <button className="Create" disabled={isCreateDisabled} onClick={handleCreate}>
                Create
              </button>
              {error && <div className='error-message'>{error}</div>}
            </div>
            <div className='check'>
              <div className='agree' onClick={handleAgreeChange}>
                AGREE
              </div>
              <input className='sell' type='checkbox' checked={isAgreed} onChange={handleAgreeChange} 
              minLength={3} required/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { Groupcreation };

