import firebase from "gatsby-plugin-firebase";

export const updateEventDocument = async (event, additionalData) => {
  if (!event) return;
  const doc = await getEventDocument(event.uid);
  const newDoc = {...doc, ...additionalData}
  console.log("Updating event doc. New value = " + JSON.stringify(newDoc));

  await firebase.firestore().doc(`events/${event.id}`).update(newDoc);

  return getEventDocument(event.id);
};


export const generateEventDocument = async (id, additionalData) => {

  if (!id) return;

  const eventRef = firebase.firestore().doc(`events/${id}`);
  const snapshot = await eventRef.get();

  if (!snapshot.exists) {
    const {foo} = id;

    try {
      await eventRef.set({
        foo,
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