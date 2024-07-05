import { IPlace } from "../app/types";
import { db } from "../firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

const FIREBASE_PLACES_TABLE_NAME = "Places";


const getPlaces = async () => {
  try {
    const querySnapshot = await getDocs(
      collection(db, FIREBASE_PLACES_TABLE_NAME)
    );
    const data: IPlace[] = querySnapshot.docs.map((doc) => ({
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

export { addPlace, getPlaces };
