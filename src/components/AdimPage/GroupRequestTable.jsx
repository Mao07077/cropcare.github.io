import React, { useState, useEffect } from 'react';
import { doc,getDocs, collection, deleteDoc, addDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';

const GroupRequestTable = () => {
  const [groupRequests, setGroupRequests] = useState([]);

  useEffect(() => {
    const fetchGroupRequests = async () => {
      try {
        const groupRequestCollection = collection(db, 'grouprequest');
        const groupRequestSnapshot = await getDocs(groupRequestCollection);
        const groupRequestData = [];

        groupRequestSnapshot.forEach((doc) => {
          groupRequestData.push({ id: doc.id, ...doc.data() });
        });

        setGroupRequests(groupRequestData);
      } catch (error) {
        console.error('Error fetching group requests:', error);
      }
    };

    fetchGroupRequests();
  }, []);

  const handleAccept = async (groupRequestId, groupName, groupDescription, privacySetting, creatorEmail) => {
    try {
      await deleteDoc(doc(db, 'grouprequest', groupRequestId));

      await addDoc(collection(db, 'Groups'), {
        groupName,
        groupDescription,
        privacySetting,
        creatorEmail,
      });

      const updatedGroupRequests = groupRequests.filter((groupRequest) => groupRequest.id !== groupRequestId);
      setGroupRequests(updatedGroupRequests);
    } catch (error) {
      console.error('Error accepting group request:', error);
    }
  };

  return (
    <div>
      <h2>Group Requests</h2>
      {groupRequests.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Group Name</th>
              <th>Group Description</th>
              <th>Privacy Setting</th>
              <th>Creator Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {groupRequests.map((groupRequest) => (
              <tr key={groupRequest.id}>
                <td>{groupRequest.groupName}</td>
                <td>{groupRequest.groupDescription}</td>
                <td>{groupRequest.privacySetting}</td>
                <td>{groupRequest.creator.email}</td>
                <td>
                  <button onClick={() => handleAccept(groupRequest.id, groupRequest.groupName, groupRequest.groupDescription, groupRequest.privacySetting, groupRequest.creator.email)}>
                    Accept
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No group requests available.</p>
      )}
    </div>
  );
};

export default GroupRequestTable;