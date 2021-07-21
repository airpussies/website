import React, {useContext, useEffect, useState} from "react";
import {UserContext} from "../../context/UserProvider";
import firebase from "gatsby-plugin-firebase";
import {generateEventDocument, updateEventDocument} from "../../lib/firebase_event";
import {count, removeKeyFromObj} from "../../utils/helpers";

const Pussie = (props) => {
  const [name, setName] = useState(props.name || "");
  const [state, setState] = useState(props.pussie.state || "yep");
  const [sex, setSex] = useState(props.pussie.sex || null);
  const [comment, setComment] = useState(props.pussie.comment || "");
  const [accommodation, setAccommodation] = useState(props.pussie.accommodation || "");
  const [travel, setTravel] = useState(props.pussie.travel || "");
  const [changed, setChanged] = useState(false);

  const onChangeHandler = event => {
    const {name, value} = event.currentTarget;
    if (name === "state") {
      setState(value)
    } else if (name === "sex") {
      setSex(value)
    } else if (name === "name") {
      setName(value)
    } else if (name === "comment") {
      setComment(value)
    } else if (name === "accommodation") {
      setAccommodation(value)
    } else if (name === "travel") {
      setTravel(value)
    }
    console.log("onChangeHandler " + changed, event);
    setChanged(true);
  };

  const onSubmitHandler = (event) => {
    props.onClick(event, {
      name: name,
      entry: {
        state: state,
        sex: sex,
        travel: travel,
        accommodation: accommodation,
        comment: comment
      }
    });
    setChanged(false);
  };

  const state_to_color = (s) => {
    if (s === 'yep') return 'is-success';
    if (s === 'maybe') return 'is-warning';
    if (s === 'perhaps') return 'is-warning';
    return 'is-danger';
  };

  return (
    <div className="field is-horizontal">
      <div className={`select is-small ${state_to_color(state)}`}>
        <select name="state"
                id="state"
                value={state}
                onChange={event => onChangeHandler(event)}>
          <option disabled={true}>Status</option>
          <option value="yep">sicher</option>
          <option value="maybe">wahrscheinlich</option>
          <option value="perhaps">interessiert</option>
          <option value="nope">bin raus</option>
        </select>
      </div>
      <input
        type="text"
        name="name"
        className="input is-small"
        value={name}
        placeholder="name"
        onChange={event => onChangeHandler(event)}
      />
      <div className={`select is-small`}>
        <select name="sex"
                id="sex"
                value={sex}
                onChange={event => onChangeHandler(event)}>
          <option disabled={true}>Sex</option>
          <option value="none">?</option>
          <option value="female">♀</option>
          <option value="male">♂</option>
        </select>
      </div>
      <input
        name="travel"
        type="text"
        className="input is-small"
        value={travel}
        placeholder="An/Abreise"
        onChange={event => onChangeHandler(event)}
      />
      <input
        name="accommodation"
        type="text"
        className="input is-small"
        value={accommodation}
        placeholder="Übernachtung"
        onChange={event => onChangeHandler(event)}
      />
      <input
        name="comment"
        type="text"
        className="input is-small"
        value={comment}
        placeholder="Kommentar"
        onChange={event => onChangeHandler(event)}

      />
      <button className="button is-small" style={!changed ? {display: 'none'} : {}} hidden={!changed}
              onClick={(event) => onSubmitHandler(event)}>
        <span className="icon is-small">
          <i className="fas fa-save"/>
        </span>
      </button>
      <button className='button is-small' onClick={(event) => {
        if (window.confirm(`Soll '${name}' wirklich gelöscht werden?`)) {
          props.delUser(event, name)
        }
      }}>
        <span className="icon is-small">
          <i className="fas fa-trash"/>
        </span>
      </button>
    </div>
  );
}

const Pussies = (props) => {
  const {current_user, evnt, team, onEventChange} = props;
  const current_team = evnt.teams[team];
  const user_enlisted = new Set(Object.keys(current_team.pussies || {})).has(current_user.displayName);
  console.log("current_team", current_team);

  const addUser = async (event, data) => {
    console.log(`addUser(${JSON.stringify(data)})`);
    console.log('evnt.teams[teams]', current_team);
    const {name, entry} = data;

    const updated_event = await updateEventDocument(evnt.id, {
      [team]:
        {
          ...current_team,
          pussies:
            {
              ...current_team.pussies,
              [name]: entry
            }
        }
    });
    onEventChange(updated_event);
  }

  const delUser = async (event, name) => {
    console.log(`delUser(${name})`);
    const updated_event = await updateEventDocument(evnt.id, {
      [team]:
        {
          ...current_team,
          pussies: removeKeyFromObj(current_team.pussies, key => key !== name)
        }
    });
    props.onEventChange(updated_event);
  }

  return (
    <div>
      <h5>Pussietagonisten</h5>
      {Object.entries(current_team.pussies || {}).map(([player_name, data], i) =>
        <Pussie name={player_name} pussie={data} key={player_name} onClick={addUser} delUser={delUser}/>
      )}
      {!user_enlisted ? <><br/>du bist noch nicht dabei <br/> <Pussie pussie={{sex: current_user?.sex}}
                                                                      key={current_user.displayName}
                                                                      name={current_user.displayName}
                                                                      onClick={addUser}
                                                                      delUser={delUser}/></> : <></>}
      <br/>Pickup hinzufügen <br/> <Pussie pussie={{}} name='' onClick={addUser} delUser={delUser} key="pickup"/>
    </div>
  );
}


const Team = (props) => {
    return (
      <option
        value={props.name}
        onChange={props.onChange}
      >{props.displayName}
      </option>
    )
  }
;

const CreateTeam = (props) => {

  const [team, setTeam] = useState(null);

  const onChangeHandler = event => {
    const {name, value} = event.currentTarget;
    if (name === "team_picker") {
      setTeam(value)
    }
  };

  const teamsPicker = <>
    <label className="label" htmlFor="team_picker">Wähle dein Team</label>
    <div className="select is-small">
      <select id="team_picker" onChange={onChangeHandler} name="team_picker" defaultValue="placeholder">
        <option hidden={true} disabled={true} value="placeholder">Team wählen</option>
        {props.missingTeams.map((team, i) =>
          <Team
            key={i}
            name={team}
            displayName={team}
          />)}
      </select>
    </div>
  </>;

  return (props.missingTeams.length > 0 ? <>
      <h3>Eines deiner Teams ist nicht dabei?</h3>
      <div className="field">
        <p className="control is-horizontal">
          {teamsPicker}
          <button className="button is-success is-small" onClick={() => props.addTeam(team)}>
                    <span className="icon is-small is-left">
          <i className="fas fa-plus"/>
        </span>
            <span>Team hinzufügen</span>
          </button>
        </p>
      </div>
    </> : <></>
  );
}

const CreateEvent = (props) => {

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
  );
};

const PlayersRequired = (props) => {
  const {count, required, label} = props;

  const required_players_to_color = () => {
    if (count / required > 0.9) return "is-success";
    if (count / required > 0.65) return "is-warning";
    return "is-danger";

  };

  return (
    <div className="control">
      <div className="tags has-addons">
        <span className="tag is-dark">{label}</span>
        <span className={`tag ${required_players_to_color()}`}>
          {count}/{required}&nbsp;
          <button
            style={{fontSize: 0.45 + 'rem'}}
            className="button is-small"
            onClick={props.incr}>+</button>
          &nbsp;
          <button
            style={{fontSize: 0.45 + 'rem'}}
            className="button is-small"
            onClick={props.decr}
          >-</button>
        </span>
      </div>
    </div>
  );
};

const Event = (props) => {
    const {evnt, onEventChange} = props;
    const {user, isLoading} = useContext(UserContext);
    const [myTeams, setMyTeams] = useState(new Set([]))
    const [allTeams, setAllTeams] = useState(new Set([]));

    useEffect(() => {
      (async () => {
        const querySnapshot = await firebase.firestore().collection("teams").get()
        const teams = querySnapshot.docs.map((doc) => {
          return {id: doc.id, data: doc.data()}
        });
        setAllTeams(new Set(teams.map(t => t.data.name)))
      })();
      setMyTeams(new Set(user?.teams));
    }, [user]);


    const missingTeams = (myTeams, teamsOfEvent) => {
      console.log("myTeams", myTeams);
      console.log("teamsOfEvent", teamsOfEvent);
      console.log("diff", [...myTeams].filter(t => !new Set(teamsOfEvent).has(t)));
      return [...myTeams].filter(t => !new Set(teamsOfEvent).has(t));
    };

    const eventHasTeam = (teams, team_name) => {
      return new Set(Object.keys(teams))
        .has(element => element === team_name);
    }

    const addTeamToEvent = async (team_name) => {
      console.log("old event", evnt);
      console.log(`addTeam(${team_name})`);
      const old_teams = evnt.teams === undefined ? [] : evnt.teams || []
      console.log("old teams", old_teams);
      if (!eventHasTeam(old_teams, team_name)) {
        console.log(`${team_name} did not exist prior to this in ${old_teams} ${typeof old_teams}`);

        const updated_event = await updateEventDocument(evnt.id, {
          [team_name]: {
            contacted: false,
            spot_confirmed: false,
            fee_payed: false,
            required_female: 5,
            required_male: 5,
            pussies: {}
          }
        });
        onEventChange(updated_event);
      } else {
        console.log(`tried to add team ${team_name} but already existed: ${old_teams}`)
      }
    };

    const toggle = async (updated_team) => {
      console.log("updated_team", updated_team);
      const updated_event = await updateEventDocument(evnt.id, updated_team)
      onEventChange(updated_event);
    };

    const renderTeams = <div>
      <h3>Teams</h3>
      {Object.entries(evnt.teams || {}).map(([team, value], i) =>
        <div key={team}>
          <h4>{team}</h4>
          <div className="field is-grouped is-grouped-multiline">
            <div className="control">
              <div className="tags has-addons">
                <span className="tag is-dark">kontaktiert?</span>
                <span
                  className={"tag " + (value.contacted ? "is-primary" : "is-danger")}>{value.contacted ? 'yep' : 'nope'}&nbsp;
                  <input type="checkbox" checked={value.contacted}
                         onClick={() => toggle({[team]: {...value, contacted: !value.contacted}})}/></span>
              </div>
            </div>
            <div className="control">
              <div className="tags has-addons">
                <span className="tag is-dark">Spot sicher?</span>
                <span
                  className={"tag " + (value.spot_confirmed ? "is-primary" : "is-danger")}>{value.spot_confirmed ? 'yep' : 'nope'}&nbsp;
                  <input type="checkbox" checked={value.spot_confirmed}
                         onClick={() => toggle({[team]: {...value, spot_confirmed: !value.spot_confirmed}})}/></span>
              </div>
            </div>
            <div className="control">
              <div className="tags has-addons">
                <span className="tag is-dark">Team fee Bezahlt?</span>
                <span
                  className={"tag " + (value.fee_payed ? "is-primary" : "is-danger")}>{value.fee_payed ? 'yep' : 'nope'}&nbsp;
                  <input type="checkbox" checked={value.fee_payed}
                         onClick={() => toggle({[team]: {...value, fee_payed: !value.fee_payed}})}/></span>
              </div>
            </div>
            <PlayersRequired
              count={count(Object.values(value.pussies).filter(x => x.state === 'yep').map((x) => x.sex), 'female')}
              required={value.required_female} label="♀"
              incr={() => toggle({[team]: {...value, required_female: value.required_female + 1}})}
              decr={() => toggle({
                [team]: {
                  ...value,
                  required_female: value.required_female > 1 ? value.required_female - 1 : 0
                }
              })}
            />
            <PlayersRequired
              count={count(Object.values(value.pussies).filter(x => x.state === 'yep').map((x) => x.sex), 'male')}
              required={value.required_male} label="♂"
              incr={() => toggle({[team]: {...value, required_male: value.required_male + 1}})}
              decr={() => toggle({
                [team]: {
                  ...value,
                  required_male: value.required_male > 1 ? value.required_male - 1 : 0
                }
              })}
            />
          </div>
          {!isLoading && evnt !== undefined ?
            <Pussies evnt={evnt} team={team} current_user={user}
                     onEventChange={onEventChange}/> : <>Loading</>}
        </div>
      )}
    </div>

    return (<> {isLoading ? <>Loading</> : <>
        {renderTeams}
        <CreateTeam missingTeams={missingTeams(myTeams, Object.keys(evnt.teams || {}))} addTeam={addTeamToEvent}/>
      </>}
      </>
    )
  }
;

const Foo = (props) => {

  // const [error, setError] = useState(null);
  const {user, isLoading} = useContext(UserContext);
  const [evnt, setEvnt] = useState(null)

  useEffect(() => {

    (async () => {
      const evnt = await generateEventDocument(props.event_id)
      setEvnt(evnt);
    })();
  }, [])

  const onEventChange = (evnt) => {
    console.log('onEventChange', evnt);
    setEvnt(evnt);
  }

  return (<>
      {
        isLoading ? <>Loading</> :
          <div>
            {evnt !== null && evnt.id === 'non_existent' ?
              <CreateEvent event_id={props.event_id} onEventChange={onEventChange}/> : <></>}
            {evnt !== null && evnt.id === props.event_id ?
              <Event onEventChange={onEventChange} evnt={evnt}/> : <></>}
          </div>
      }</>
  )
}

export default Foo;