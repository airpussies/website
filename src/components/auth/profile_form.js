import React, {useContext, useEffect, useState} from "react";
import firebase from "gatsby-plugin-firebase";
import {UserContext} from "../../context/UserProvider";
import {updateUserDocument} from "../../lib/firebase_user";
import {navigate} from "gatsby";

const Team = (props) => {
  return (
    <div>
      <input
        type="checkbox"
        id={props.name}
        name={props.name}
        checked={props.checked}
        onChange={props.onChange}
      />
      <label htmlFor={props.name}>{props.displayName}</label>
    </div>
  )
}

const ProfileForm = () => {
  const {user, isLoading} = useContext(UserContext);

  const [displayName, setDisplayName] = useState('');

  const [error, setError] = useState(null);
  const [teams, setTeams] = useState([])

  useEffect(() => {
    (async () => {
      const querySnapshot = await firebase.firestore().collection("teams").get()

      const teams = querySnapshot.docs.map((doc) => {
        return {id: doc.id, data: doc.data()}
      });
      // console.log(teams);
      setTeams(teams)
    })();
    setDisplayName(user?.displayName);
  }, [user])

  const updateProfile = async (event, displayName) => {
    event.preventDefault();
    setError('');
    try {
      console.log("calling updateUserDocument(" + displayName + ")")
      const newDoc = await updateUserDocument(user, {displayName})
      console.log("done updateUserDocument." + JSON.stringify(newDoc));
      navigate('/');

    } catch (error) {
      console.log("Error updating user.", error);
      setError("Error updating user.");
    }
    setDisplayName("");
  };

  const onChangeHandler = event => {
    const {name, value} = event.currentTarget;
    if (name === "displayName") {
      setDisplayName(value)
    } else if (event.target.type === 'checkbox') {
      console.log(`name = ${name} • value = ${event.target.checked}`);
    }
  };

  const teamsPicker =
    <>
      Wähle deine Teams
      {teams.map((team, i) =>
        <Team
          key={i}
          name={team.id}
          displayName={team.data.name}
          onChange={event => onChangeHandler(event)}
        />)}
    </>


  return (
    <>
      <h1 className="is-1 title">Profile</h1>
      {error !== null && <div className="error">{error}</div>}
      {!isLoading ? <>

        <form className="">
          <label htmlFor="newDisplayName">Display Name:</label>
          <input type="text"
                 name="displayName"
                 value={displayName}
                 placeholder="pickup"
                 id="displayName"
                 onChange={event => onChangeHandler(event)}
          />
          <button
            onClick={event => {
              updateProfile(event, displayName)
            }}>
            Update
          </button>
        </form>

        {teamsPicker}

        <button
          className=""
          onClick={() => firebase.auth().signOut()}
        >
          Sign out
        </button>
      </> : <> Loading profile ... </>
      }
    </>
  );
};

export default ProfileForm;