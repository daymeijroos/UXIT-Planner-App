import {ToggleState, useToggleState} from 'react-stately';
import {useCheckbox} from 'react-aria';
import React from "react";
import {CheckboxProps} from "@react-types/checkbox";

export function Checkbox(props: CheckboxProps) {
    const { children } = props;
    const state: ToggleState = useToggleState(props);
    const ref = React.useRef(null);
    const { inputProps } = useCheckbox(props, state, ref);

    return (
        <label style={{ display: 'block' }}>
    <input {...inputProps} ref={ref} />
    {children}
    </label>
);
}
