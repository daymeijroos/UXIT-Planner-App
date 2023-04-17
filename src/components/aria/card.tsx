import { Button, ButtonProps } from "./button";

interface CardProps {
  className?: string
  button?: boolean
  buttonText?: string
  buttonColor?: "primary" | "success" | "error"
  buttonProps?: ButtonProps
  children?: React.ReactNode
}

const cardStyle = `border-2 border-black py-4 px-4 m-4 text-black bg-white`;

export function Card(props: CardProps) {
  let buttonProps = props.buttonProps || {};
  buttonProps.className = `${buttonProps.className} m-0 mt-4`;

  return (
    <div className={`${cardStyle} ${props.className}`}>
      {props.children}
      {props.button && <Button color={props.buttonColor} children={props.buttonText} {...buttonProps}/>}
    </div>
  );
}