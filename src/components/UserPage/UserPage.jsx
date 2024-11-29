import React, { useState, useEffect } from 'react';
import { Header } from '../assets/header2.0';
import { Weather } from '../assets/Weather';
import { Link } from 'react-router-dom';
import { collection,addDoc, query, where, getDocs,} from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { auth, db } from '../../config/firebase';
import './UserPage.css';

const UserPage = () => {
  const { groupId } = useParams();
  const [posts, setPosts] = useState([]);
  const [userGroups, setUserGroups] = useState([]);
  const [userPosts, setUserPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [showComments, setShowComments] = useState({});

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

    const fetchUserPosts = async () => {
      try {
        const postsData = await Promise.all(
          userGroups.map(async (group) => {
            const postsRef = collection(db, 'posts');
            const postsQuery = query(postsRef, where('group', '==', group.id));
            const postsSnapshot = await getDocs(postsQuery);
            const groupPostsData = await Promise.all(postsSnapshot.docs.map(async (postDoc) => {
              const postData = { id: postDoc.id, ...postDoc.data(), groupName: group.groupName };
              const commentsRef = collection(db, 'comments');
              const commentsQuery = query(commentsRef, where('post', '==', postData.id));
              const commentsSnapshot = await getDocs(commentsQuery);
              postData.comments = commentsSnapshot.docs.map(commentDoc => commentDoc.data());

              return postData;
            }));
            return groupPostsData;
          })
        );

        setUserPosts(postsData.flat());
      } catch (error) {
        console.error('Error fetching user posts:', error);
      }
    };

    fetchUserGroups();
    fetchUserPosts();
  }, [userGroups]);
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

        console.log(`Post with ID ${postId} reported.`);

      } catch (error) {
        console.error('Error reporting post:', error);
      }
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

  return (
    <div className='bg'>
      <Header />
      <Weather/>
      <div className='FRRRR'>
        
        {userPosts.map((post) => (
          <div key={post.id} className='user-post-container'>
            <div className='post-container'>
                <button className="report-button" onClick={() => handleReport(post.id)}>
                  Report
                </button>
              <p>{post.content}</p>
              <h4>Posted by: {post.user}</h4>
              <Link to={`/groups/${post.group}`}><h5>Group:</h5>{post.groupName}</Link>
            
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
          </div>
        ))}
      </div>
    </div>
  );
};

export { UserPage };