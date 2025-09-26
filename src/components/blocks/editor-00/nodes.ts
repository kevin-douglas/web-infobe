import { ImageNode } from '@/components/editor/nodes/image-node';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import {
  Klass,
  LexicalNode,
  LexicalNodeReplacement,
  ParagraphNode,
  TextNode,
} from 'lexical';

export const nodes: ReadonlyArray<Klass<LexicalNode> | LexicalNodeReplacement> =
  [HeadingNode, ParagraphNode, TextNode, QuoteNode, ImageNode];
