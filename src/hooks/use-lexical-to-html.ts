'use client';

import { useEffect, useMemo, useState } from 'react';
import { $generateHtmlFromNodes } from '@lexical/html';
import { createEditor, type SerializedEditorState } from 'lexical';
import { nodes } from '@/components/blocks/editor-00/nodes';
export function useLexicalToHtml(lexicalJson: any) {
  const [htmlContent, setHtmlContent] = useState('');

  const editor = useMemo(
    () =>
      createEditor({
        namespace: 'LexicalToHTML',
        nodes: nodes,
        onError: (e) => console.error('Lexical to HTML error:', e),
      }),
    [],
  );

  useEffect(() => {
    if (!lexicalJson) {
      setHtmlContent('');
      return;
    }

    try {
      const serialized: SerializedEditorState =
        typeof lexicalJson === 'string'
          ? (JSON.parse(lexicalJson) as SerializedEditorState)
          : lexicalJson;

      const state = editor.parseEditorState(serialized);
      editor.setEditorState(state);

      editor.update(() => {
        const html = $generateHtmlFromNodes(editor, null);
        setHtmlContent(html);
      });
    } catch (err) {
      console.error('Error to convert JSON Lexical to HTML:', err);
      setHtmlContent('');
    }
  }, [editor, lexicalJson]);

  return htmlContent;
}
