import React, {useState} from "react";

const Team = (props) => {
  return (
    <option
      value={props.name}
      onChange={props.onChange}
    >{props.displayName}
    </option>
  )
}

/**
 * missing teams can be created and added to the event with this
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
export const CreateTeam = (props) => {

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

  return (props.missingTeams.length > 0 ? <div className={"pt-5"}>
      <div className={"box is-full"}>
        <h4 className={"is-4"}>Eines deiner Teams ist nicht dabei?</h4>
        <div className="field">
          <div className="control is-horizontal">
            {teamsPicker}
            <button className="button is-success is-small" onClick={() => props.addTeam(team)}>
                    <span className="icon is-small is-left">
          <i className="fas fa-plus" />
        </span>
              <span>Team hinzufügen</span>
            </button>
          </div>
        </div>
      </div>
    </div> : <></>
  );
}