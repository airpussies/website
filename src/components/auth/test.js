import React, {useContext, useEffect, useState} from "react";
import {UserContext} from "../../context/UserProvider";
import firebase from "gatsby-plugin-firebase";
import {generateEventDocument, getEventDocument, updateEventDocument} from "../../lib/firebase_event";

const Team = (props) => {
  return (
    <option
      value={props.name}
      onChange={props.onChange}
    >{props.displayName}
    </option>
  )
}

const CreateTeam = (props) => {

  const teamsPicker = <>
    <label htmlFor="team_picker">Wähle dein Team</label>
    <select id="team_picker">
      {props.missingTeams.map((team, i) =>
        <Team
          key={i}
          name={team}
          displayName={team}
          // onChange={event => onChangeHandler(event)}
        />)}
    </select>
  </>;

  return (
    <>
      {props.missingTeams.length > 0 ? <>
        <h3>Eines deiner Teams ist nicht dabei?</h3>
        {teamsPicker}
        <button>Team anlegen</button>
      </> : <></>
      }
    </>
  )
}

const CreateEvent = (props) =>
{

  const handleOnClick = (e) => {
    e.preventDefault();
    const event = generateEventDocument(props.event_id, {foo: 'bar'})
    props.onEventCreate(event)
  }

  return (
    <>
      <h2>CreateEvent</h2>
      <button onClick={handleOnClick}>CreateEvent</button>
    </>
  )
}

const Event = (props) =>
{

  const {user, isLoading} = useContext(UserContext);
  const [myTeams, setMyTeams] = useState(new Set([]))
  const [teams, setTeams] = useState(new Set([]));

  useEffect(() => {
    (async () => {
      const querySnapshot = await firebase.firestore().collection("teams").get()
      const teams = querySnapshot.docs.map((doc) => {
        return {id: doc.id, data: doc.data()}
      });
      setTeams(new Set(teams.map(t => t.data.name)))
    })();
    setMyTeams(new Set(user?.teams));
  }, [user]);


  const missingTeams = [...teams].filter(t => !myTeams.has(t));

  const eventHasTeam = (team_name) => {
    return props.evnt.teams.find(element => element.team_name === team_name);
  }

  const addTeam = async (team_name) => {
    const old_event = props.evnt;
    const old_teams = old_event.teams
    if (!eventHasTeam(team_name)) {
      const event = await updateEventDocument({...old_event, teams: [...old_teams].concat({team_name: team_name})});
      props.onEventChange(event);
    }
  };

  return (
    <>
      <h2>Event {props.evnt.id}</h2>
      {props.evnt.foo}
      <CreateTeam missingTeams={missingTeams}/>
    </>
  )

}

const Foo = (props) =>
{

  const [error, setError] = useState(null);

  const [event, setEvent] = useState(null)

  useEffect(() => {

    (async () => {
      const event = await getEventDocument(props.event_id)
      setEvent(event);
    })();
  }, [])

  const onEventChange = (event) => {
    setEvent(event);
  }

  return (
    <div>
      <h1 className="is-1 title">Turnierverwaltung for {props.event_id}</h1>
      {event !== null && event.id === 'non_existent' ?
        <CreateEvent event_id={props.event_id} onEventChange={onEventChange}/> : <></>}
      {event !== null && event.id === props.event_id ? <Event evnt={event}/> : <></>}
    </div>
  )
}

export default Foo;