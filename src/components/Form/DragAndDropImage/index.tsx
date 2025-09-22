import React from 'react';

import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from '@/components/ui/shadcn-io/dropzone';
import { Heading } from '@/components/Typography/Heading';
import { Icon } from '@iconify/react';
import { Paragraph } from '@/components/Typography/Paragraph';

const ContentDragAndDrop = ({ file }: { file?: File }) => {
  return file ? (
    <div
      className="absolute top-0 right-0 bottom-0 left-0 w-full rounded-2xl bg-contain bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${URL.createObjectURL(file)})`,
      }}
    />
  ) : (
    <div className="flex flex-col items-center gap-2.5">
      <Icon
        icon="tabler:cloud-upload"
        className="min-h-10 min-w-10 text-primary-200"
      />
      <Heading type="H3" className="text-primary-100">
        Arraste a imagem aqui
      </Heading>

      <Paragraph type="P2" className="text-black-80">
        Formatos suportados: .png, .jpg
      </Paragraph>
    </div>
  );
};

export const DragAndDropImage = () => {
  const [files, setFiles] = React.useState<File[]>([]);
  const handleDrop = (files: File[]) => {
    console.log(files);
    setFiles(files);
  };

  return (
    <div className="flex w-full flex-col gap-[10px]">
      <Heading type="H2" className="place-self-center text-black-90">
        Capa do Curso
      </Heading>

      <Dropzone
        accept={{ 'image/*': ['.png', '.jpg', '.jpeg'] }}
        maxFiles={1}
        maxSize={1024 * 1024 * 10}
        minSize={1024}
        onDrop={handleDrop}
        onError={console.error}
        src={files}
        className="relative h-[191px] rounded-2xl border-dashed bg-alpha-primary-100"
      >
        <ContentDragAndDrop file={files?.length !== 0 ? files[0] : undefined} />
      </Dropzone>
    </div>
  );
};
