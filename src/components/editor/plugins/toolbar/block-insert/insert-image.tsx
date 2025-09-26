'use client';

import { ImageIcon } from 'lucide-react';

import { useToolbarContext } from '@/components/editor/context/toolbar-context';
import { INSERT_IMAGE_COMMAND } from '@/components/editor/plugins/images-plugin';
import { Label } from '@/components/ui/label';
import { api } from '@/service/index.service';

export function InsertImage() {
  const { activeEditor } = useToolbarContext();

  const loadImage = async (files: FileList | null) => {
    try {
      if (files?.length !== 0) {
        const formData = new FormData();

        if (files) formData.append('file', files[0]);

        formData.append('type', 'COVER');

        const { data } = await api.post('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (data) {
          activeEditor.dispatchCommand(INSERT_IMAGE_COMMAND, {
            altText: '',
            src: process.env.NEXT_PUBLIC_API_URL + '/upload/' + data.key,
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Label>
      <ImageIcon className="size-4" />
      <span>Image</span>
      <input
        id="image-upload"
        type="file"
        onChange={(e) => loadImage(e.target.files)}
        accept="image/*"
        className="hidden"
      />
    </Label>
  );
}
