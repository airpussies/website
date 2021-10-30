import {updateEventDocument} from "../../lib/firebase_event";
import {removeKeyFromObj} from "../../utils/helpers";
import React, {useState} from "react";

const CommentMouseOver = (props) => {
  const {comment, visible} = props;
  const isLongComment = () => {
    return comment.length > 25;
  }
  return (<>{visible && isLongComment() &&
  <div className="notification is-success is-light">
    <b>Kommentar</b> <br/> {comment}
  </div>
  }</>);
};

/**
 * render a single pussie for tv
 * with all its fields in one line
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const Pussie = (props) => {
  const [name, setName] = useState(props.name || "");
  const [state, setState] = useState(props.pussie.state || "yep");
  const [sex, setSex] = useState(props.pussie.sex || "none");
  const [comment, setComment] = useState(props.pussie.comment || "");
  const [accommodation, setAccommodation] = useState(props.pussie.accommodation || "");
  const [travel, setTravel] = useState(props.pussie.travel || "");
  const [changed, setChanged] = useState(props.changed || false);
  const [commentsVisible, setCommentsVisible] = useState(false);

  const onChangeHandler = event => {
    const {name, value} = event.currentTarget;
    if (name === "state") {
      setState(value);
    } else if (name === "sex") {
      setSex(value);
    } else if (name === "name") {
      setName(value);
    } else if (name === "comment") {
      setComment(value);
    } else if (name === "accommodation") {
      setAccommodation(value);
    } else if (name === "travel") {
      setTravel(value);
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
    <>
      <div className="field is-horizontal">
        <input
          type="text"
          name="name"
          className="input is-small"
          value={name}
          placeholder="name"
          readOnly={!props.allowDisplayNameChange}
          disabled={!props.allowDisplayNameChange}
          onChange={event => onChangeHandler(event)}
        />
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
          onMouseEnter={() => {setCommentsVisible(true);}}
          onMouseLeave={() => {setCommentsVisible(false);}}
          onFocus={() => {setCommentsVisible(true);}}
          onBlur={() => {setCommentsVisible(false);}}
        />
        <button className="button is-small" style={!changed ? {display: 'none'} : {}} hidden={!changed}
                onClick={(event) => onSubmitHandler(event)}>
        <span className="icon is-small">
          <i className="fas fa-save"/>
        </span>
        </button>
        <button className="button is-small" onClick={(event) => {
          if (window.confirm(`Soll '${name}' wirklich gelöscht werden?`)) {
            props.delUser(event, name);
          }
        }}>
        <span className="icon is-small">
          <i className="fas fa-trash"/>
        </span>
        </button>
      </div>
      <CommentMouseOver
        visible={commentsVisible}
        comment={comment}
      />
    </>
  );
};

/**
 * render all pussies, sorted by state and name.
 * also render a helper to add the user to the tv, as well as a pickup with
 * a modifiable name.
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export const Pussies = (props) => {
  const {current_user, evnt, team, onEventChange} = props;
  const current_team = evnt.teams[team];
  const user_enlisted = new Set(Object.keys(current_team?.pussies || {})).has(current_user?.displayName);

  const upsertUser = async (event, data) => {
    const {name, entry} = data;
    try {
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
    } catch (error) {
      const {code, message} = error;
      props.setError(`Operation fehlgeschlagen. (${code})`);
      props.setDetail(message);
    }
  };

  const delUser = async (event, name) => {
    // console.log(`delUser(${name})`);
    try {
      const updated_event = await updateEventDocument(evnt.id, {
        [team]:
          {
            ...current_team,
            pussies: removeKeyFromObj(current_team.pussies, key => key !== name)
          }
      });
      onEventChange(updated_event);
    } catch (error) {
      const {code, message} = error;
      props.setError(`Operation fehlgeschlagen. (${code})`);
      props.setDetail(message);
    }
  };

  return (
    <div>
      <h4 className="is-4">Pussietagonisten</h4>
      {Object.entries(current_team.pussies || {})
        .sort(([n1, d1], [n2, d2]) => {
          const state_to_number = (s) => {
            switch (s) {
              case 'yep':
                return 1;
              case 'maybe':
                return 2;
              case 'perhaps':
                return 3;
              case 'nope':
                return 4;
            }
          };
          return state_to_number(d1.state) - state_to_number(d2.state) || n1.localeCompare(n2);
        })
        .map(([player_name, data], i) =>
          <Pussie
            key={player_name}
            allowDisplayNameChange={false}
            name={player_name}
            pussie={data}
            onClick={upsertUser}
            delUser={delUser}/>
        )}
      {!user_enlisted && (<><br/>du bist noch nicht dabei <br/>
        <Pussie pussie={{sex: current_user?.sex}}
                key={current_user?.displayName}
                allowDisplayNameChange={false}
                name={current_user?.displayName}
                changed={true}
                onClick={upsertUser}
                delUser={delUser}/></>)}
      <br/>Pickup hinzufügen <br/>
      <Pussie
        key="pickup"
        allowDisplayNameChange={true}
        pussie={{}}
        name=""
        onClick={upsertUser}
        delUser={delUser}
      />
    </div>
  );
};