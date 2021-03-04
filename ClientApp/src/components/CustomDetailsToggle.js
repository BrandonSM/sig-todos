import React, {useContext} from 'react';
import AccordionContext from 'react-bootstrap/AccordionContext';
import {useAccordionToggle} from 'react-bootstrap/AccordionToggle';

export default function CustomDetailsToggle({eventKey, callback}) {
  
  // Get the current key from the Accordion being clicked
  const currentEventKey = useContext(AccordionContext);

  // Set the current event key to toggle the text on the button
  const isCurrentEventKey = currentEventKey === eventKey;

  return (
        <span className={`details-font`}>{isCurrentEventKey ? '[collapse details]' : '[expand details]'}</span>
  );
};
