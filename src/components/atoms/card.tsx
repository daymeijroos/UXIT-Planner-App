const cardStyle = `border-2 border-black py-4 px-4 text-black bg-white`;

export function Card(props: { className?: string; children?: React.ReactNode }) {
  return (
    <div className={`${cardStyle ?? ''} ${props.className ?? ''}`}>
      {props.children}
    </div>
  );
}