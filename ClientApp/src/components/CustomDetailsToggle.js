import React, {useContext} from 'react';
import AccordionContext from 'react-bootstrap/AccordionContext';
import { useAccordionToggle } from 'react-bootstrap/AccordionToggle';

function CustomDetailsToggle({eventKey, callback}) {
  const currentEventKey = useContext(AccordionContext); // <-- Will update every time the eventKey changes.
  const toggleOnClick = useAccordionToggle(eventKey, () => {
    callback(eventKey);
  });
  const isCurrentEventKey = currentEventKey === eventKey;

  return (
    <button
      type="button"
      className={`btn btn-sm btn-info`}
      onClick={toggleOnClick}
    >
      {isCurrentEventKey ? 'Collapse me' : 'Expand me'}
    </button>
  );
}
export default CustomDetailsToggle;