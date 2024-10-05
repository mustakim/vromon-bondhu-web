import { IPlace } from "../app/types";
import { auth, db, storage } from "../firebase";
import {
  getFirestore,
  collection,
  addDoc,
  updateDoc,
  doc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

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
      fullDescription: doc.data().fullDescription,
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

const uploadImageAndGetURL = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, `${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Optional: handle upload progress
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`);
      },
      (error) => {
        // Handle unsuccessful uploads
        console.error("Upload failed", error);
        reject(error);
      },
      () => {
        // Handle successful uploads on complete
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL);
        });
      }
    );
  });
};

export { addPlace, getPlaces, editPlace, deletePlace, uploadImageAndGetURL };
