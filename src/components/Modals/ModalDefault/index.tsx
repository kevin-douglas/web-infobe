import React from 'react';

import { Heading } from '@/components/Typography/Heading';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Icon } from '@iconify/react';
import { DialogTitle } from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';

interface Props {
  visible: boolean;
  onClose: () => void;

  title: string;
  children: React.ReactNode;
  className?: React.ComponentProps<'div'>['className'];
}

export const ModalDefault: React.FC<Props> = ({
  visible,
  onClose,
  title,
  children,
  className,
}) => {
  return (
    <Dialog open={visible}>
      <DialogContent
        className={cn('gap-8 px-6 sm:max-w-[425px]', className)}
        showCloseButton={false}
      >
        <div className="relative flex w-full items-center justify-center">
          <DialogTitle asChild>
            <Heading type="H2" className="flex w-full justify-center">
              {title}
            </Heading>
          </DialogTitle>

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
