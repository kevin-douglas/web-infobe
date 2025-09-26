import React from 'react';

import { Dropzone } from '@/components/ui/shadcn-io/dropzone';
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

interface DragAndDropImageProps {
  file?: File;
  setFile: (file?: File) => void;
}

export const DragAndDropImage: React.FC<DragAndDropImageProps> = ({
  file,
  setFile,
}) => {
  const handleDrop = (files: File[]) => {
    if (files.length !== 0) setFile(files[0]);
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
        src={file ? [file] : []}
        className="relative h-[191px] rounded-2xl border-dashed bg-alpha-primary-100"
      >
        <ContentDragAndDrop file={file ? file : undefined} />
      </Dropzone>
    </div>
  );
};
