import React, { useState, useEffect } from 'react';
import { Header } from '../assets/header2.0';
import lnd from '../assets/grouppic.png';
import { useParams } from 'react-router-dom';
import { fetchGroupDetails } from './groupService';
import { collection, addDoc, query, where, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import './grouppage.css';

const Grouppage = () => {
  const { groupId } = useParams();
  const [groupDetails, setGroupDetails] = useState(null);
  const [newPost, setNewPost] = useState('');
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [showComments, setShowComments] = useState({});
  const [joined, setJoined] = useState(() => {
    const storedJoinedState = localStorage.getItem(`joined_${groupId}`);
    return storedJoinedState ? JSON.parse(storedJoinedState) : false;
  });
  const [isMember, setIsMember] = useState(false);

  const handleReport = async (postId) => {
    const reportConfirmation = window.confirm("Are you sure you want to report this post?");
if (reportConfirmation) {
      try {
        const reportedPost = posts.find(post => post.id === postId);
        const reportsCollection = collection(db, 'reports');
        await addDoc(reportsCollection, {
          postId: reportedPost.id,
          content: reportedPost.content,
          user: auth.currentUser.email,
          group: groupId,
        });
        console.log(`Post with ID ${postId} reported.`)
      } catch (error) {
        console.error('Error reporting post:', error);
      }
    }
  };
  const getPosts = async () => {
    try {
      const postsRef = collection(db, 'posts');
      const q = query(postsRef, where('group', '==', groupId));
      const querySnapshot = await getDocs(q);
      const postsData = await Promise.all(querySnapshot.docs.map(async (doc) => {
        const postData = {
          id: doc.id,
          ...doc.data(),
        };

        const commentsRef = collection(db, 'comments');
        const commentsQ = query(commentsRef, where('post', '==', postData.id));
        const commentsSnapshot = await getDocs(commentsQ);
        postData.comments = commentsSnapshot.docs.map(commentDoc => commentDoc.data());

        return postData;
      }));
      setPosts(postsData);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const details = await fetchGroupDetails(groupId);
        setGroupDetails(details);
        const storedJoinedState = localStorage.getItem(`joined_${groupId}`);
        if (storedJoinedState) {
          setJoined(JSON.parse(storedJoinedState));
        }
        const groupDocRef = doc(db, 'Groups', groupId);
        const groupDoc = await getDoc(groupDocRef);
        if (groupDoc.exists()) {
          const currentMembers = groupDoc.data().members || [];
          setIsMember(currentMembers.includes(auth.currentUser.email));
        }
      } catch (error) {
        console.error('Error fetching group details:', error);
      }
    };

    getPosts();
    fetchData();
  }, [groupId]);

  const handlePostSubmit = async () => {
    try {
      if (newPost.trim() === '') {
        console.log('Post cannot be empty.');
        return;
      }

      const postCollection = collection(db, 'posts');
      const newPostRef = await addDoc(postCollection, {
        content: newPost,
        user: auth.currentUser.email,
        group: groupId,
      });

      setNewPost('');
      getPosts();

      return newPostRef.id;
    } catch (error) {
      console.error('Error submitting post:', error);
    }
  };

  const handleCommentSubmit = async (postId) => {
    try {
      if (!comments[postId] || comments[postId].trim() === '') {
        console.log('Comment cannot be empty.');
        return;
      }

      const commentCollection = collection(db, 'comments');
      await addDoc(commentCollection, {
        content: comments[postId],
        user: auth.currentUser.email,
        post: postId,
      });

      setComments((prevComments) => ({
        ...prevComments,
        [postId]: '',
      }));
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const handleJoin = async () => {
    try {
      setJoined((prevJoined) => !prevJoined);
      const updatedJoinedState = !joined;
      setJoined(updatedJoinedState);
      localStorage.setItem(`joined_${groupId}`, JSON.stringify(updatedJoinedState));

      const groupDocRef = doc(db, 'Groups', groupId);
      const groupDoc = await getDoc(groupDocRef);

      if (groupDoc.exists()) {
        const currentMembers = groupDoc.data().members || [];
        const updatedMembers = updatedJoinedState
          ? [...currentMembers, auth.currentUser.email]
          : currentMembers.filter((member) => member !== auth.currentUser.email);

        await updateDoc(groupDocRef, { members: updatedMembers });

        setIsMember(updatedMembers.includes(auth.currentUser.email));
      }
    } catch (error) {
      console.error('Error updating group members:', error);
    }
  };

  return (
    <div>
      <Header />
      <div className='inin'>
        <img className="grouppic" src={lnd} alt="Landscape" />
        <div className='title'>
          {groupDetails && <h1>{groupDetails.groupName}</h1>}
        </div>
        <button className={joined ? 'joined' : 'join'} onClick={handleJoin}>
          {joined ? 'Joined' : 'Join'}
        </button>
        <div className="post-section">
          <textarea
            placeholder="Write your post here..."
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            rows={9}
            cols={72.9}
          />
        </div>
        <button className='btbb' onClick={handlePostSubmit}>
          Post
        </button>
        <div className='FRYy'>
        {isMember ? (
          posts.map((post) => (
            <div key={post.id} className='post-container'>
              <div className='post'>
                <button className="report-button" onClick={() => handleReport(post.id)}>
                  Report
                </button>
                  <p>{post.content}</p>
                  <h4>Posted by: {post.user}</h4>
                </div>

                <div className='comment-section'>
                  <textarea
                    placeholder='Write your comment here...'
                    value={comments[post.id] || ''}
                    onChange={(e) => setComments((prevComments) => ({
                      ...prevComments,
                      [post.id]: e.target.value,
                    }))}
                    rows={1}
                    cols={50}
                  />
                  <button className='commentpost' onClick={() => handleCommentSubmit(post.id)}>
                    Comment
                  </button>
                </div>

                <button
                  className='see-comments-button'
                  onClick={() => setShowComments((prevShowComments) => ({
                    ...prevShowComments,
                    [post.id]: !prevShowComments[post.id],
                  }))}
                >
                  See Comments
                </button>

                {showComments[post.id] && (
                  <div className='comments'>
                    {post.comments && post.comments.map((comment, index) => (
                      <div key={index} className='comment'>
                        <p><strong>{comment.user}:</strong> {comment.content}</p>
                      </div>
                    ))}
                  </div>
                  
                )}
                
              </div>
            ))
          ) : (
            <p>Join the group to see posts.</p>
          )}
        </div>
        <div className='discrif'>
        <h3>accessibility: </h3>
        {groupDetails && (
            <p>{groupDetails.isPrivate ? 'Private Group' : 'Public Group'}</p>
          )}
          <h3>Group Description:</h3>
          {groupDetails && <p>{groupDetails.groupDescription}</p>}
        </div>
      </div>
    </div>
  );
};

export { Grouppage };
