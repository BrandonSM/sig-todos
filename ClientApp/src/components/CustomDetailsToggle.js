import React, {useContext} from 'react';
import AccordionContext from 'react-bootstrap/AccordionContext';

export default function CustomDetailsToggle({eventKey, isComplete, callback}) {
  
  // Get the current key from the Accordion being clicked
  const currentEventKey = useContext(AccordionContext);

  // Set the current event key to toggle the text on the button
  const isCurrentEventKey = currentEventKey === eventKey;

  return (
      <span className={`details-font ${isComplete && ("hide-details-toggle")}`}>{isCurrentEventKey ? '[collapse details]' : '[expand details]'}</span>
  );
};
