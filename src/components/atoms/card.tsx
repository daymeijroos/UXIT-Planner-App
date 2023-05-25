export function Card(props: { className?: string; children?: React.ReactNode }) {
  return (
    <div className={`border-2 border-black py-4 px-4 text-black bg-white dark:bg-slate dark:text-white dark:border-steel ${props.className ?? ''}`}>
      {props.children}
    </div>
  );
}