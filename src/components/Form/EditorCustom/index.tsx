import React from 'react';

import { Editor } from '@/components/blocks/editor-00/editor';
import { SerializedEditorState } from 'lexical';

export const initialValue = {
  root: {
    children: [
      {
        children: [],
        direction: 'ltr',
        format: '',
        indent: 0,
        type: 'paragraph',
        version: 1,
      },
    ],
    direction: 'ltr',
    format: '',
    indent: 0,
    type: 'root',
    version: 1,
  },
} as unknown as SerializedEditorState;

interface Props {
  onChangeValue: (value: SerializedEditorState) => void;
}

export const EditorCustom: React.FC<Props> = ({ onChangeValue }) => {
  const [editorState, setEditorState] =
    React.useState<SerializedEditorState>(initialValue);

  return (
    <Editor
      editorSerializedState={editorState}
      onSerializedChange={(value) => {
        setEditorState(value);
        onChangeValue(value);
      }}
    />
  );
};
