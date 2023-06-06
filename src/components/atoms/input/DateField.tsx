import { useRef } from 'react';
import { useDateField, useDateSegment, useLocale } from 'react-aria';
import { useDateFieldState } from 'react-stately';

interface DateFieldProps {
  label: string;
  defaultValue: Date;
}

export function DateField(props: DateFieldProps) {
  const { locale } = useLocale();
  const state = useDateFieldState({
    ...props,
    locale,
  });

  const ref = useRef(null);
  const { labelProps, fieldProps } = useDateField(props, state, ref);

  // Set the initial value using the defaultValue prop
  React.useEffect(() => {
    state.setDate(props.defaultValue);
  }, [props.defaultValue, state]);

  return (
    <div className="wrapper">
      <span {...labelProps}>{props.label}</span>
      <div {...fieldProps} ref={ref} className="field">
        {state.segments.map((segment: any, i: number) => (
          <DateSegment key={i} segment={segment} state={state} />
        ))}
        {state.validationState === 'invalid' && (
          <span aria-hidden="true">🚫</span>
        )}
      </div>
    </div>
  );
}

interface DateSegmentProps {
  segment: any;
  state: any;
}

function DateSegment({ segment, state }: DateSegmentProps) {
  const ref = useRef(null);
  const { segmentProps } = useDateSegment(segment, state, ref);

  return (
    <div
      {...segmentProps}
      ref={ref}
      className={`segment ${segment.isPlaceholder ? 'placeholder' : ''}`}
    >
      {segment.text}
    </div>
  );
}
