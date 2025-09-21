'use client';

import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from '@/components/ui/card';
import Button from '@/components/Button';
import { Heading } from '@/components/Typography/Heading';
import { Paragraph } from '@/components/Typography/Paragraph';

export type LessonCardProps = {
  imageUrl: string;
  imageAlt?: string;
  title: string;
  courseName: string;
  onClick?: () => void;
  buttonText?: string;
  className?: string;
};

export function LessonCard({
  imageUrl,
  imageAlt = '',
  title,
  courseName,
  onClick,
  buttonText = 'Acessar aula',
  className,
}: LessonCardProps) {
  return (
    <Card
      className={cn(
        'max-w-[404px] min-w-[312px] overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm transition-shadow hover:shadow-md',
        'p-0',
        className,
      )}
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-t-2xl">
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 404px) 100vw, 404px"
        />
      </div>

      <CardContent className="space-y-1.5">
        <CardTitle>
          <Heading type="H2">{title}</Heading>
        </CardTitle>
        <CardDescription>
          <Paragraph type="P1">{courseName}</Paragraph>
        </CardDescription>
      </CardContent>

      <CardFooter className="pb-6">
        <Button
          withIcon
          leftIcon="tabler:external-link"
          width="fill"
          onClick={onClick}
        >
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
}
