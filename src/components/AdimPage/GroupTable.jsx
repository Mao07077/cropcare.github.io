import React, { useState, useEffect } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../../config/firebase';

const GroupTable = () => {

 const [Groups, setGroups] = useState([]);
    useEffect(() => {
        const fetchGroups = async () => {
          try {
            const GroupsCollection = collection(db, 'Groups');
            const GroupsSnapshot = await getDocs(GroupsCollection);
            const GroupsData = [];
    
            GroupsSnapshot.forEach((doc) => {
                GroupsData.push({ id: doc.id, ...doc.data() });
            });
    
            setGroups(GroupsData);
          } catch (error) {
            console.error('Error fetching Groups:', error);
          }
        };
    
        fetchGroups();
      }, []);
  return (
    <div>
    <h2>Groups</h2>
    {Groups.length > 0 ? (
      <table>
        <thead>
          <tr>
            
          <th>Group Name</th>
              <th>Group Description</th>
              <th>Privacy Setting</th>
              <th>Creator Email</th>
          </tr>
        </thead>
        <tbody>
          {Groups.map((Groups) => (
            <tr key={Groups.id}>
                <td>{Groups.groupName}</td>
                <td>{Groups.groupDescription}</td>
                <td>{Groups.privacySetting}</td>
                <td>{Groups.creatorEmail}</td>
            </tr>
          ))}
        </tbody>
        </table>
    ) : (
      <p>No Groups available.</p>
    )}
  </div>
);
};


export default GroupTable
