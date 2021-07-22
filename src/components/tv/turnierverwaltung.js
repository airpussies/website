import React, {useContext, useEffect, useState} from "react";
import {UserContext} from "../../context/UserProvider";
import {Link} from "gatsby";
import {generateEventDocument} from "../../lib/firebase_event";
import {CreateEvent, Event} from "./event";

const Turnierverwaltung = (props) => {

  // const [error, setError] = useState(null);
  const {user, isLoading} = useContext(UserContext);
  const [evnt, setEvnt] = useState(null)

  useEffect(() => {

    (async () => {
      if (!isLoading && user !== undefined) {
        const evnt = await generateEventDocument(props.event_id)
        setEvnt(evnt);
      }
    })();
  }, [user, isLoading])

  const onEventChange = (evnt) => {
    console.log('onEventChange', evnt);
    setEvnt(evnt);
  }

  return (<>
      {
        isLoading || user === undefined ?
          <article className="message is-info">
            <div className="message-body">
              Die Turnierverwaltung steht nur registrierten Nutzern zur Verfügung.
              Zur <Link to="/signup">Registrierung</Link>
            </div>
          </article> :
          <div>
            {evnt !== null && evnt?.id === 'non_existent' ?
              <CreateEvent event_id={props.event_id} onEventChange={onEventChange}/> : <></>}
            {evnt !== null && evnt?.id === props.event_id ?
              <Event onEventChange={onEventChange} evnt={evnt}/> : <></>}
          </div>
      }</>
  )
}

export default Turnierverwaltung;