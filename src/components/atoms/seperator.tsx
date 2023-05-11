import {type SeparatorProps, useSeparator} from 'react-aria';

function Separator(props: SeparatorProps) {
  const { separatorProps } = useSeparator(props);

  return (
    <div
      {...separatorProps}
      style={{
        background: 'gray',
        width: props.orientation === 'vertical' ? '1px' : '100%',
        height: props.orientation === 'vertical' ? '100%' : '1px',
        margin: props.orientation === 'vertical' ? '0 5px' : '5px 0'
      }}
    />
  );
}

<>
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    Content above
    <Separator />
    Content below
  </div>
  <div
    style={{
      display: 'flex',
      flexDirection: 'row',
      marginTop: 20,
      height: 40,
      alignItems: 'center'
    }}
  >
    Content left
    <Separator orientation="vertical" />
    Content right
  </div>
</>

export default Separator