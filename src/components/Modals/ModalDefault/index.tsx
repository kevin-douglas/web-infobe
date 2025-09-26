import React from 'react';

import { Heading } from '@/components/Typography/Heading';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Icon } from '@iconify/react';

interface Props {
  visible: boolean;
  onClose: () => void;

  title: string;
  children: React.ReactNode;
}

export const ModalDefault: React.FC<Props> = ({
  visible,
  onClose,
  title,
  children,
}) => {
  return (
    <Dialog open={visible}>
      <DialogContent
        className="gap-8 px-6 sm:max-w-[425px]"
        showCloseButton={false}
      >
        <div className="relative flex w-full items-center justify-center">
          <Heading type="H2" className="flex w-full justify-center">
            {title}
          </Heading>

          <Icon
            icon="basil:cross-outline"
            className="absolute right-0 h-8 min-h-8 w-8 min-w-8 cursor-pointer"
            onClick={onClose}
          />
        </div>

        <div className="flex h-full w-full flex-col">{children}</div>
      </DialogContent>
    </Dialog>
  );
};
