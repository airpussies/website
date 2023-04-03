import React, {useContext, useEffect, useState} from "react";
import firebase from "gatsby-plugin-firebase";
import {UserContext} from "../../context/UserProvider";
import {updateUserDocument} from "../../lib/firebase_user";

const Team = (props) => {
  return (
    <label className="checkbox" htmlFor={props.name} style={{paddingRight: 15 + 'px'}}>
      <input
        type="checkbox"
        id={props.name}
        name={props.displayName}
        checked={props.checked}
        onChange={props.onChange}
      />&nbsp;{props.displayName}
    </label>
  )
}

const ProfileForm = () => {
    const {user, isLoading} = useContext(UserContext);

    const [displayName, setDisplayName] = useState('');

    const [teams, setTeams] = useState([]);
    const [sex, setSex] = useState("none");
    const [secret, setSecret] = useState("");
    const [myTeams, setMyTeams] = useState(new Set(["air pussies"]));

    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [detail, setDetail] = useState(null);

    useEffect(() => {
      (async () => {
        const querySnapshot = await firebase.firestore().collection("teams").get()

        const teams = querySnapshot.docs.map((doc) => {
          return {id: doc.id, data: doc.data()}
        });
        setTeams(teams)
      })();
      setDisplayName(user?.displayName);
      setSex(user?.sex || "none");
      setSecret(user?.secret || "");
      setMyTeams(new Set(user?.teams));
    }, [user])

    const updateProfile = async (event) => {
      event.preventDefault();
      setError(null);
      setDetail(null)
      try {
        // console.log("calling updateUserDocument(" + displayName + ")")
        await updateUserDocument(user, {displayName, secret, sex, teams: [...myTeams]})
        // console.log("done updateUserDocument." + JSON.stringify(newDoc));
        setMessage("Erfolgreich gespeichert.");
        window.setTimeout(() => {
          setMessage("")
        }, 5000);
      } catch (error) {
        const {code, message} = error;
        setError(`Operation fehlgeschlagen. (${code})`);
        setDetail(message);
      }
    };

    const onChangeHandler = event => {
      const {name, value} = event.currentTarget;
      if (name === "displayName") {
        setDisplayName(value)
      } else if (name === "secret") {
        setSecret(value)
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
      <label className="label">Wähle deine Teams</label>
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
        {error !== null && (
          <article className="message is-danger">
            <div className="message-header">
              <p>{error}</p>
              <button className="delete" aria-label="delete"
                      onClick={() => {
                        setError(null);
                        setDetail(null);
                      }}/>
            </div>
            <div className="message-body">{detail}</div>
          </article>
        )}
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
              <label htmlFor="secret" className="label">"Pussiegeheimnis"</label>
              <p className="control is-expanded has-icons-left">
                <input type="text"
                       className="input"
                       name="secret"
                       value={secret}
                       placeholder="pussie seal of authenticity"
                       id="secret"
                       onChange={event => onChangeHandler(event)}
                />
                <span className="icon is-small is-left"><i className="fas fa-user-secret"/></span>
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