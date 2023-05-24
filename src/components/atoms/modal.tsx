import React from 'react';
import {Overlay, useModalOverlay} from 'react-aria';
import type { AriaModalOverlayProps } from 'react-aria';
import type { OverlayTriggerState } from 'react-stately';

interface ModalProps extends AriaModalOverlayProps {
  state: OverlayTriggerState;
  children: React.ReactNode;
}

export function Modal({ state, children, ...props }: ModalProps) {
  const ref = React.useRef(null);
  const { modalProps, underlayProps } = useModalOverlay(props, state, ref);

  return (
    <Overlay>
      <div className='dark:bg-[#2B303C] dark:text-white dark:border-[#4E8B88] fixed z-100 top-0 left-0 bottom-0 right-0 bg-black bg-opacity-50 flex items-center justify-center'
        {...underlayProps}
      >
        <div className='bg-white rounded-lg shadow-lg p-4'
          {...modalProps}
          ref={ref}
        >
          {children}
        </div>
      </div>
    </Overlay>
  );
}