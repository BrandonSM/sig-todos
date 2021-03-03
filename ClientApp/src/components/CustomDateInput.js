import * as React from 'react';
import { Button } from 'react-bootstrap';

const CustomDateInput = React.forwardRef((props, ref) =>  (
    <Button 
        className="example-custom-input" 
        onClick={props.onClick}
        variant={"outline-secondary"}
        ref={ref}>
        {props.value}
    </Button>
));

export default CustomDateInput;
