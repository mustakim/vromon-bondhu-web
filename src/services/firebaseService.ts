import { IPlace } from "../app/types";
import { auth, db } from "../firebase";
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

const FIREBASE_PLACES_TABLE_NAME = "Places";

// Function to log in user with email and password
export const login = async (email: string, password: string): Promise<void> => {
  await signInWithEmailAndPassword(auth, email, password);
};

// Function to log out user
export const logout = async (): Promise<void> => {
  await signOut(auth);
};

const getPlaces = async () => {
  try {
    const querySnapshot = await getDocs(
      collection(db, FIREBASE_PLACES_TABLE_NAME)
    );
    const data: IPlace[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      name: doc.data().name,
      description: doc.data().description,
      image: doc.data().image || [],
      latitude: doc.data().latitude,
      longitude: doc.data().longitude,
      popular: doc.data().popular,
      rating: doc.data().rating,
    }));
    return data;
  } catch (e) {
    console.error("Error getting documents: ", e);
    return [];
  }
};

const addPlace = async (formData: IPlace) => {
  try {
    const docRef = await addDoc(
      collection(db, FIREBASE_PLACES_TABLE_NAME),
      formData
    );
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

const editPlace = async (
  id: string,
  formData: Partial<IPlace>
): Promise<void> => {
  try {
    const formDocRef = doc(db, FIREBASE_PLACES_TABLE_NAME, id);
    await updateDoc(formDocRef, formData);
  } catch (error) {
    console.error("Error updating document: ", error);
  }
};

const deletePlace = async (id: string): Promise<void> => {
  const formDoc = doc(db, FIREBASE_PLACES_TABLE_NAME, id);
  await deleteDoc(formDoc);
};

export { addPlace, getPlaces, editPlace, deletePlace };
