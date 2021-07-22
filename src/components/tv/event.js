import React, {useContext, useEffect, useState} from "react";
import {UserContext} from "../../context/UserProvider";
import {generateEventDocument, updateEventDocument} from "../../lib/firebase_event";
import {count} from "../../utils/helpers";
import {Pussies} from "./pussie";
import {CreateTeam} from "./teams";

/**
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export const CreateEvent = (props) => {

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

/**
 * render the players required for an event
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
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

/**
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export const Event = (props) => {
    const {evnt, onEventChange} = props;
    const {user, isLoading} = useContext(UserContext);
    const [myTeams, setMyTeams] = useState(new Set([]))

    const [error, setError] = useState(null);
    const [detail, setDetail] = useState(null);

    useEffect(() => {
      setMyTeams(new Set(user?.teams));
    }, [user]);


    const missingTeams = (myTeams, teamsOfEvent) => {
      return [...myTeams].filter(t => !new Set(teamsOfEvent).has(t));
    };

    const eventHasTeam = (teams, team_name) => {
      return new Set(Object.keys(teams))
        .has(element => element === team_name);
    }

    const addTeamToEvent = async (team_name) => {
      const old_teams = evnt.teams === undefined ? [] : evnt.teams || []
      if (!eventHasTeam(old_teams, team_name)) {
        try {
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
        } catch (error) {
          const {code, message} = error;
          setError(`Event konnte nicht gespeichert werden. (${code})`);
          setDetail(message);
        }
      } else {
        console.log(`tried to add team ${team_name} but already existed: ${old_teams}`)
      }
    };

    const toggle = async (updated_team) => {
      console.log("updated_team", updated_team);
      try {
        const updated_event = await updateEventDocument(evnt.id, updated_team)
        onEventChange(updated_event);
      } catch (error) {
        const {code, message} = error;
        setError(`Event konnte nicht gespeichert werden. (${code})`);
        setDetail(message);
      }
    };

    const renderTeams = <div>
      {error !== null && (
        <article className="message is-danger">
          <div className="message-header">
            <p style={{margin: 0}}>{error}</p>
            <button className="delete" aria-label="delete"
                    onClick={() => {
                      setError(null);
                      setDetail(null);
                    }}/>
          </div>
          <div className="message-body">{detail}</div>
        </article>
      )}
      {Object.entries(evnt.teams || {})
        .sort(([t1, v1],[t2, v2])=> t1.localeCompare(t2))
        .map(([team, value], i) =>
        <div key={team}>
          <h4 className="is-4">{team}</h4>
          <div className="field is-grouped is-grouped-multiline">
            <div className="control">
              <div className="tags has-addons">
                <span className="tag is-dark">kontaktiert?</span>
                <span
                  className={"tag " + (value.contacted ? "is-primary" : "is-danger")}>{value.contacted ? 'yep' : 'nope'}&nbsp;
                  <input type="checkbox" defaultChecked={value.contacted}
                         onClick={() => toggle({[team]: {...value, contacted: !value.contacted}})}/></span>
              </div>
            </div>
            <div className="control">
              <div className="tags has-addons">
                <span className="tag is-dark">Spot sicher?</span>
                <span
                  className={"tag " + (value.spot_confirmed ? "is-primary" : "is-danger")}>{value.spot_confirmed ? 'yep' : 'nope'}&nbsp;
                  <input type="checkbox" defaultChecked={value.spot_confirmed}
                         onClick={() => toggle({[team]: {...value, spot_confirmed: !value.spot_confirmed}})}/></span>
              </div>
            </div>
            <div className="control">
              <div className="tags has-addons">
                <span className="tag is-dark">Team fee Bezahlt?</span>
                <span
                  className={"tag " + (value.fee_payed ? "is-primary" : "is-danger")}>{value.fee_payed ? 'yep' : 'nope'}&nbsp;
                  <input type="checkbox" defaultChecked={value.fee_payed}
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
            <Pussies
              evnt={evnt}
              team={team}
              current_user={user}
              onEventChange={onEventChange}
              setError={setError}
              setDetail={setDetail}
            /> : <>Loading</>}
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