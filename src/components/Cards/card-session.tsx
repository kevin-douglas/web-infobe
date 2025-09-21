'use client';

import * as React from 'react';
import { Heading } from '@/components/Typography/Heading';
import {
  LessonCard,
  type LessonCardProps,
} from '@/components/Cards/lesson-card';

interface CardSessionProps {
  title?: string;
  items: LessonCardProps[];
  more?: boolean;
  loadAll?: boolean;
}

const DEFAULT_ITEMS = 3;

export const CardSession = ({
  title,
  items,
  more,
  loadAll = false,
}: CardSessionProps) => {
  // começa mostrando tudo se loadAll=true
  const [showAll, setShowAll] = React.useState<boolean>(loadAll);

  // se o prop mudar depois, mantém em sincronia
  React.useEffect(() => {
    setShowAll(loadAll);
  }, [loadAll]);

  const displayedItems = React.useMemo(
    () => (loadAll || showAll ? items : items.slice(0, DEFAULT_ITEMS)),
    [loadAll, showAll, items],
  );

  const canShowMore = Boolean(
    more && !loadAll && !showAll && items.length > DEFAULT_ITEMS,
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Heading type="H2">{title}</Heading>

        {canShowMore && (
          <Heading
            type="H2"
            onClick={() => setShowAll(true)}
            className="cursor-pointer text-primary-200 hover:underline"
          >
            Ver todos
          </Heading>
        )}
      </div>

      <div className="flex flex-wrap gap-6">
        {displayedItems.map((item, index) => (
          <LessonCard
            key={index}
            imageUrl={item.imageUrl}
            imageAlt={item.imageAlt}
            title={item.title}
            courseName={item.courseName}
            onClick={item.onClick}
            buttonText={item.buttonText}
          />
        ))}
      </div>
    </div>
  );
};
