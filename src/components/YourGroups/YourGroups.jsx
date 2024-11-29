import React, { useState, useEffect } from 'react';
import { Header } from '../assets/header2.0';
import { Link } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import './yourgroup.css';

const Password = () => {
  const [userGroups, setUserGroups] = useState([]);

  useEffect(() => {
    const fetchUserGroups = async () => {
      try {
        if (auth.currentUser) {
          const userGroupsRef = collection(db, 'Groups');
          const userGroupsQuery = query(userGroupsRef, where('members', 'array-contains', auth.currentUser.email));
          const userGroupsSnapshot = await getDocs(userGroupsQuery);
          const userGroupsData = userGroupsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setUserGroups(userGroupsData);
        } else {
          console.error('User not authenticated.');
        }
      } catch (error) {
        console.error('Error fetching user groups:', error);
      }
    };

    fetchUserGroups();
  }, []);

  return (
    <div className='bg'>
      <Header />
      <div className='FRY'>
        <div className="GroupList">Your Group List:</div>
        <div className="center-table">
          <table>
            <thead>
              <tr>
                <th>Group Name</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {userGroups.map((group) => (
                <tr key={group.id}>
                  <td>{group.groupName}</td>
                  <td>
                    <Link to={`/groups/${group.id}`}>View Group</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export { Password };
