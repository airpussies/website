import firebase from "gatsby-plugin-firebase";

export const updateEventDocument = async (id, team) => {
  if (!id || !team) return;

  const doc = await getEventDocument(id);
  const newDoc = {...doc, teams: {...doc.teams, ...team}}
  // console.log(`Updating event doc (${id}, ${JSON.stringify(team)}). New value = ${JSON.stringify(newDoc)}`);

  await firebase.firestore().doc(`events/${id}`).update(newDoc);

  return getEventDocument(id);
};


export const generateEventDocument = async (id, additionalData) => {

  if (!id) return;

  console.log(`generateEventDocument(${id})`);

  const eventRef = firebase.firestore().doc(`events/${id}`);
  const snapshot = await eventRef.get();

  if (!snapshot.exists) {
    try {
      await eventRef.set({
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
    const eventDocument = await firebase.firestore().doc(`events/${id}`).get();
    return {
      id: id,
      ...eventDocument.data()
    };
  } catch (error) {
    console.error("Error fetching event.", error);
  }
};