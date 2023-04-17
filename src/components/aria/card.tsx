import { Button, ButtonProps } from "./button";

interface CardProps {
  className?: string
  button?: boolean
  buttonText?: string
  buttonColor?: "primary" | "success" | "error"
  buttonProps?: ButtonProps
  children?: React.ReactNode
}

export function Card(props: CardProps) {

  return (
    <div className={`flex flex-col items-center justify-center ${props.className}`}>
      <div className="flex flex-col items-center justify-center bg-white rounded-lg shadow-lg p-4">
        <div className="flex flex-col items-center justify-center">
          {props.children}
        </div>
        {props.button && <Button color={props.buttonColor} children={props.buttonText} {...props.buttonProps}/>}
      </div>
    </div>
  );
}