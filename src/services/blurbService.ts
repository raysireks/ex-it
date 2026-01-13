import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  increment,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Blurb } from '../types';

class BlurbService {
  private blurbsCollection = collection(db, 'blurbs');

  async getTopBlurbs(limitCount: number = 10): Promise<Blurb[]> {
    const q = query(
      this.blurbsCollection,
      orderBy('votes', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        text: data.text,
        votes: data.votes,
        userId: data.userId,
        username: data.username,
        createdAt: (data.createdAt as Timestamp)?.toDate() || new Date(),
      } as Blurb;
    });
  }

  async voteBlurb(blurbId: string): Promise<void> {
    const blurbRef = doc(db, 'blurbs', blurbId);
    await updateDoc(blurbRef, {
      votes: increment(1)
    });
  }

  async submitBlurb(text: string, userId: string, username: string): Promise<Blurb> {
    const newBlurbData = {
      text,
      votes: 0,
      userId,
      username,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(this.blurbsCollection, newBlurbData);

    return {
      id: docRef.id,
      ...newBlurbData,
      createdAt: new Date(), // Local approximation until refresh
    } as Blurb;
  }
}

export const blurbService = new BlurbService();
