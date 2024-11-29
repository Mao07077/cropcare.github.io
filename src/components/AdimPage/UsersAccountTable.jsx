import React, { useState, useEffect } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../../config/firebase';

const UsersAccountTable = () => {
    const [emails, setemails] = useState([]);
    useEffect(() => {
        const fetchemails = async () => {
          try {
            const emailsCollection = collection(db, 'signupd');
            const emailsRequestSnapshot = await getDocs(emailsCollection);
            const emailsData = [];
    
            emailsRequestSnapshot.forEach((doc) => {
              emailsData.push({ id: doc.id, ...doc.data() });
            });
    
            setemails(emailsData);
          } catch (error) {
            console.error('Error fetching emails:', error);
          }
        };
    
        fetchemails();
      }, []);
  return (
    <div>
    <h2>Users</h2>
    {emails.length > 0 ? (
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>First Name</th>
            <th>Last Name</th>
          </tr>
        </thead>
        <tbody>
          {emails.map((signupd) => (
            <tr key={signupd.id}>
              <td>{signupd.Email}</td>
              <td>{signupd.Fname}</td>
              <td>{signupd.Lname}</td>
            </tr>
          ))}
        </tbody>
        </table>
    ) : (
      <p>No Users available.</p>
    )}
  </div>
);
};

export default UsersAccountTable
