import React, { useState, useEffect } from 'react';
import { doc, deleteDoc, collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useNotification } from '../assets/NotificationContext';

const ReportsTable = () => {
  const { addNotification } = useNotification();
  const [groupReport, setGroupReport] = useState([]);

  useEffect(() => {
    const fetchGroupReport = async () => {
      try {
        const groupReportCollection = collection(db, 'reports');
        const groupReportSnapshot = await getDocs(groupReportCollection);
        const groupReportData = [];

        groupReportSnapshot.forEach((doc) => {
          groupReportData.push({ id: doc.id, ...doc.data() });
        });

        setGroupReport(groupReportData);
      } catch (error) {
        console.error('Error fetching group reports:', error);
      }
    };

    fetchGroupReport();
  }, []);

  const handleDelete = async (postId, reportsId) => {
    try {
      await deleteDoc(doc(db, 'posts', postId));
      await deleteDoc(doc(db, 'reports', reportsId));
      addNotification({
        message: `The post with ID ${postId} and report in group ${reportsId} have been deleted!`,
        type: 'success',
      });
      const updatedGroupReport = groupReport.filter((report) => report.id !== reportsId);
      setGroupReport(updatedGroupReport);
    } catch (error) {
      console.error('Error deleting post and report:', error);
    }
  };

  return (
    <div>
      <h2>Reports</h2>
      {groupReport.length > 0 ? (
        <table className='ksksk'>
          <thead>
            <tr>
              <th>Report ID</th>
              <th>Post ID</th>
              <th>Group</th>
              <th>Content</th>
              <th>User Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {groupReport.map((report) => (
              <tr key={report.id}>
                <td>{report.id}</td>
                <td>{report.postId}</td>
                <td>{report.group}</td>
                <td>{report.content}</td>
                <td>{report.user}</td>
                <td>
                  <button onClick={() => handleDelete(report.postId, report.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No reports available.</p>
      )}
    </div>
  );
};

export default ReportsTable;
