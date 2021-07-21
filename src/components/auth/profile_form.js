import React, {useContext, useEffect, useState} from "react";
import firebase from "gatsby-plugin-firebase";
import {UserContext} from "../../context/UserProvider";
import {updateUserDocument} from "../../lib/firebase_user";

const Team = (props) => {
  return (
    <div>
      <label className="checkbox" htmlFor={props.name}>
        <input
          type="checkbox"
          id={props.name}
          name={props.displayName}
          checked={props.checked}
          onChange={props.onChange}
        />&nbsp;{props.displayName}
      </label>
    </div>
  )
}

const ProfileForm = () => {
    const {user, isLoading} = useContext(UserContext);

    const [displayName, setDisplayName] = useState('');

    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [teams, setTeams] = useState([]);
    const [sex, setSex] = useState(null);
    const [myTeams, setMyTeams] = useState(new Set([]));

    useEffect(() => {
      (async () => {
        const querySnapshot = await firebase.firestore().collection("teams").get()

        const teams = querySnapshot.docs.map((doc) => {
          return {id: doc.id, data: doc.data()}
        });
        setTeams(teams)
      })();
      setDisplayName(user?.displayName);
      setSex(user?.sex);
      setMyTeams(new Set(user?.teams));
    }, [user])

    const updateProfile = async (event) => {
      event.preventDefault();
      setError('');
      try {
        console.log("calling updateUserDocument(" + displayName + ")")
        const newDoc = await updateUserDocument(user, {displayName, sex, teams: [...myTeams]})
        console.log("done updateUserDocument." + JSON.stringify(newDoc));
        setMessage("Erfolgreich gespeichert.");
        window.setTimeout(() => {
          setMessage("")
        }, 5000);
      } catch (error) {
        console.log("Error updating user.", error);
        setError("Error updating user.");
      }
    };

    const onChangeHandler = event => {
      const {name, value} = event.currentTarget;
      if (name === "displayName") {
        setDisplayName(value)
      } else if (name === "sex") {
        setSex(value)
      } else if (event.target.type === 'checkbox') {
        console.log(`name = ${name} • value = ${event.target.checked}`);
        if (!event.target.checked) {
          setMyTeams(new Set([...myTeams].filter(s => s !== name)));
        } else {
          setMyTeams(new Set([...myTeams, name]));
        }
        console.log("myTeams", myTeams);
      }
    };

    const teamsPicker = isLoading || user === undefined ? <>Loading</> : <>
      Wähle deine Teams
      {teams.map((team, i) =>
        <Team
          key={i}
          name={team.id}
          checked={myTeams.has(team.data.name)}
          displayName={team.data.name}
          onChange={event => onChangeHandler(event)}
        />)}
    </>

    return (
      <>
        <h1 className="is-1 title">Profil</h1>
        {error !== null && <div className="help is-error">{error}</div>}
        {message !== null && <p className="help is-success">{message}</p>}

        {!isLoading ? <>

          <form className="">
            <div className="field">
              <label htmlFor="displayName" className="label">Pussiename</label>
              <p className="control is-expanded has-icons-left">
                <input type="text"
                       className="input"
                       name="displayName"
                       value={displayName}
                       placeholder="pickup"
                       id="displayName"
                       onChange={event => onChangeHandler(event)}
                />
                <span className="icon is-small is-left"><i className="fas fa-user"/></span>
              </p>
              <label htmlFor="sex" className="label">Division</label>
              <p className="control select">
                <select name="sex" id="sex" value={sex} onChange={event => onChangeHandler(event)}>
                  <option value="" disabled={true}>Wähle</option>
                  <option value="none">none</option>
                  <option value="female">♀ women</option>
                  <option value="male">♂ open</option>
                  <option value="other">other</option>
                </select>
              </p>
            </div>
            <div className="field">
              <p className="control">
                {teamsPicker}
              </p>
            </div>
            <div className="field">
              <p className="control">
                <button
                  className="button is-primary"
                  onClick={event => updateProfile(event)}
                >
                  Update
                </button>
              </p>
            </div>
          </form>

        </> : <> Loading profile ... </>
        }
      </>
    );
  }
;

export default ProfileForm;