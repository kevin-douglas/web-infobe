import { Heading } from '@/components/Typography/Heading';
import React from 'react';
import Image from 'next/image';

interface NoContentProps {
  message: string;
}

export const NoContent = ({ message }: NoContentProps) => {
  return (
    <div className="flex h-[363px] w-full flex-col items-center justify-center gap-6 rounded-2xl border border-dashed border-primary-20 bg-alpha-primary-100">
      <Image
        src="/images/no-content.png"
        alt="No content"
        width={128}
        height={125}
      />
      <Heading type="H2" className="text-primary-100">
        {message}
      </Heading>
    </div>
  );
};
