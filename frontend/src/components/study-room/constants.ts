import { BookOpen, TextQuote, Lightbulb, MessageSquare, Hash } from 'lucide-react';

export const aiActions = [
  { key: 'explain', label: 'Explain Simple', icon: BookOpen },
  { key: 'define', label: 'Define', icon: TextQuote },
  { key: 'example', label: 'Give Example', icon: Lightbulb },
  { key: 'analogy', label: 'Analogy', icon: MessageSquare },
  { key: 'acronym', label: 'Extend Acronym', icon: Hash },
] as const;

export type ActionKey = (typeof aiActions)[number]['key'];
