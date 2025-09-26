'use client';
import { cn } from '@/lib/utils';
import { BookOpen } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useMemo } from 'react';
import { Heading } from '@/components/Typography/Heading';
import { Icon } from '@iconify/react';
import { Paragraph } from '@/components/Typography/Paragraph';
import Button from '@/components/Button';

export type Lesson = {
  id: string;
  title: string;
  status: 'not_started' | 'view' | 'finished';
};

export interface ModuleAccordionProps {
  moduleId?: string;
  title: string;
  statusLabel?: string;
  lessons: Lesson[];
  defaultOpen?: boolean;
  onLessonClick?: (lesson: Lesson) => void;
  lessonSelectedId?: string;
  mode: 'view' | 'edit';
  onEditClick?: (lesson: Lesson) => void;
  onDeleteClick?: (lesson: Lesson) => void;
  onAddLessonClick?: () => void;
}

export default function ModuleAccordion({
  title,
  statusLabel,
  lessons,
  defaultOpen,
  onLessonClick,
  lessonSelectedId,
  mode,
  onEditClick,
  onDeleteClick,
  onAddLessonClick,
}: ModuleAccordionProps) {
  const value = useMemo(
    () => title.toLowerCase().replace(/\s+/g, '-'),
    [title],
  );

  return (
    <div className="w-full">
      <Accordion
        type="single"
        collapsible
        defaultValue={defaultOpen ? value : undefined}
        className="w-full"
      >
        <AccordionItem
          value={value}
          className={cn(
            'overflow-hidden',
            // 'data-[state=open]:border data-[state=open]:border-dashed',
            'rounded-sm',
          )}
        >
          <AccordionTrigger
            className={cn(
              'cursor-pointer gap-3 border-[1px] border-primary-100 bg-primary-10 px-4 py-4 no-underline md:px-6',
              'hover:no-underline',
              '[&>svg]:text-primary-200 [&[data-state=open]>svg]:text-primary-200',
            )}
          >
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center gap-3">
                <BookOpen className="h-6 w-6 text-primary-200" />

                <Heading type="H3">{title}</Heading>
              </div>

              {statusLabel ? (
                <Heading type="H3" className="text-primary-100">
                  {statusLabel}
                </Heading>
              ) : null}
            </div>
          </AccordionTrigger>

          <AccordionContent className="border border-t-0 border-dashed px-2 pb-3 md:px-4 md:pb-4">
            <ul className="flex flex-col divide-y divide-border">
              {lessons.map((lesson) => (
                <li key={lesson.id}>
                  <button
                    type="button"
                    onClick={() => onLessonClick?.(lesson)}
                    className={cn(
                      'w-full cursor-pointer text-left',
                      'flex items-center justify-between gap-3 px-4 py-4 md:px-6',
                      'transition-colors hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
                    )}
                    aria-label={`Abrir ${lesson.title}`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        icon="tabler:note"
                        className="h-6 w-6 text-primary-100"
                      />

                      {lesson.id === lessonSelectedId ? (
                        <Heading type="H3" className="text-primary-200">
                          {lesson.title}
                        </Heading>
                      ) : (
                        <Paragraph type="P1" className="text-black-80">
                          {lesson.title}
                        </Paragraph>
                      )}
                    </div>

                    {mode === 'view' ? (
                      <>
                        {lesson.status === 'finished' && (
                          <Icon
                            icon="tabler:check"
                            className="h-4 w-4 text-system-success"
                          />
                        )}
                        {lesson.status === 'view' && (
                          <Icon
                            icon="tabler:eye"
                            className="h-4 w-4 text-primary-200"
                          />
                        )}
                      </>
                    ) : (
                      <div className="flex gap-3">
                        <Icon
                          icon="tabler:pencil"
                          className="h-4 w-4 text-primary-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditClick?.(lesson);
                          }}
                        />
                        <Icon
                          icon="tabler:x"
                          className="h-4 w-4 text-system-error"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteClick?.(lesson);
                          }}
                        />
                      </div>
                    )}
                  </button>
                </li>
              ))}
            </ul>
            {mode === 'edit' && (
              <div className="mt-4 flex justify-end">
                <Button
                  withIcon
                  type="button"
                  leftIcon="tabler:plus"
                  className="tablet:w-[220px] w-[190px]"
                  onClick={onAddLessonClick}
                >
                  Nova aula
                </Button>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
