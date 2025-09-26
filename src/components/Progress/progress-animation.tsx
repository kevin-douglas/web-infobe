'use client';

import { Progress as ProgressPrimitive } from 'radix-ui';
import * as React from 'react';

interface ProgressProps {
  value: number;
}

export default function ProgressAnimation({ value }: ProgressProps) {
  return (
    <div className="w-full">
      <style>
        {`@keyframes progress {
            to {
              left: calc(100% - 2rem);
            }
          }
          .progress {
            transform-origin: center;
            animation: progress 1.25s ease-in-out infinite;
          }
          `}
      </style>
      <ProgressPrimitive.Root className="relative h-2 w-full overflow-hidden rounded-full bg-primary/10">
        <ProgressPrimitive.Indicator
          className="relative h-full w-full flex-1 bg-primary-200 transition-all"
          style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
        >
          <div className="progress absolute inset-y-0 left-0 h-full w-6 bg-primary-foreground blur-[10px]" />
        </ProgressPrimitive.Indicator>
      </ProgressPrimitive.Root>
    </div>
  );
}
