import {doc, setDoc, getDoc, updateDoc} from "firebase/firestore";
import {db} from "./firebase";

export const updateEventDocument = async (id, team) => {
  if (!id || !team) return;

  const existingDoc = await getEventDocument(id);
  const newDoc = {...existingDoc, teams: {...existingDoc.teams, ...team}}
  // console.log(`Updating event doc (${id}, ${JSON.stringify(team)}). New value = ${JSON.stringify(newDoc)}`);

  await updateDoc(doc(db, `events/${id}`), newDoc);

  return getEventDocument(id);
};


export const generateEventDocument = async (id, additionalData) => {

  if (!id) return;

  console.log(`generateEventDocument(${id})`);

  const eventRef = doc(db, `events/${id}`);
  const snapshot = await getDoc(eventRef);

  if (!snapshot.exists()) {
    try {
      await setDoc(eventRef, {
        id,
        ...additionalData
      });
    } catch (error) {
      console.error("Error creating event document.", error);
    }
  }
  return getEventDocument(id);
};

export const getEventDocument = async (id) => {
  if (!id) return null;

  try {
    const eventDocument = await getDoc(doc(db, `events/${id}`));
    return {
      id: id,
      ...(eventDocument.data() || {})
    };
  } catch (error) {
    console.error("Error fetching event.", error);
  }
};