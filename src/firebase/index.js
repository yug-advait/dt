// src/firebase/database.js
// import { ref, set, push, onValue, off } from 'firebase/database';
import { db } from "./configration";
import { collection, getDocs,onSnapshot ,doc, updateDoc,addDoc} from "firebase/firestore";

import {
  getDatabase,
  ref,
  query,
  limitToLast,
  orderByChild,
  onValue,
} from "firebase/database";



export async function permissionListsfetchData() {
  const dataCollection = collection(db, "permissionLists");

  // return new Promise((resolve, reject) => {
  //   const unsubscribe = onSnapshot(
  //     dataCollection, 
  //     (snapshot) => {
  //       const data = snapshot.docs.map(doc => ({
  //         id: doc.id,
  //         ...doc.data(),
  //       }));
  //       resolve(data);
  //       // Optional: Unsubscribe after first snapshot to prevent multiple calls
  //       unsubscribe();
  //     },
  //     (error) => {
  //       console.error("Error fetching permission lists:", error);
  //       reject(error);
  //     }
  //   );
  // });
}

 
export async function updateData(data) {
  try {
    if (!data || data === "undefined" || data.length === 0) {
      throw new Error("Invalid or empty data");
    }

    const id = data[0]?.id;
    const users = data[0]?.users;
    

    if (!id) {
      throw new Error("No document ID provided");
    }

    const docRef = doc(db, "permissionLists", id);
    
    await updateDoc(docRef, {
      status: "completed",
      updatedAt: new Date(),
      users
    });

  } catch (error) {
    console.error("Error updating document:", error.message);
    // Optionally, you can rethrow the error or handle it as needed
    // throw error;
  }
}


export async function addData(data) {
  try {
    const docRef = await addDoc(collection(db, 'permissionLists'), {
      ...data,
      createdAt: new Date()
    });
    // Reset form after successful submission
    setFormData({ name: '', email: '', age: '' });
  } catch (error) {
    console.error('Error adding document: ', error);
  }
}
