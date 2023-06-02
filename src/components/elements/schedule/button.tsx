import { useRef } from "react";
import styled from "styled-components";
import { useButton } from "@react-aria/button";
import { useFocusRing } from "@react-aria/focus";
import { mergeProps } from "@react-aria/utils";
import type { ButtonProps } from "@react-types/button";
import type { AriaButtonProps } from 'react-aria'

const StyledButton = styled.button`
  appearance: none;
  border: none;
  background: none;
  color: black;
  height: 40px;
  width: 40px;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
  box-shadow: ${(props: { isFocusVisible: boolean }) =>
          props.isFocusVisible ? "0 0 0 2px seagreen" : ""};

  &:hover {
    background: rgba(46, 139, 87, 0.2);
  }

  &:active {
    background: rgba(46, 139, 87, 0.5);
  }
`;

export function Button(props: ButtonProps & AriaButtonProps) {
  const ref = useRef<HTMLButtonElement>(document.createElement("button"));
  const { buttonProps } = useButton(props, ref);
  const { focusProps, isFocusVisible } = useFocusRing();
  return (
    <StyledButton
      {...mergeProps(buttonProps, focusProps)}
      isFocusVisible={ isFocusVisible }
      ref={ref}
    >
      {props.children}
    </StyledButton>
  );
}
