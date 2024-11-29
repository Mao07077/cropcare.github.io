import { db } from '../../config/firebase';
import { collection, doc, getDoc } from 'firebase/firestore';

const fetchGroupDetails = async (groupId) => {
  try {
    const groupRef = doc(collection(db, 'Groups'), groupId);
    const groupDoc = await getDoc(groupRef);

    if (groupDoc.exists()) {
      return {
        id: groupDoc.id,
        ...groupDoc.data(),
      };
    } else {
      throw new Error('Group not found');
    }
  } catch (error) {
    throw error;
  }
};

export { fetchGroupDetails };