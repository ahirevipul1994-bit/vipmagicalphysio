import { cloneElement, isValidElement, type ReactNode } from 'react';
import { translate } from './translations.ts';

/** Translates authored React text without mutating the DOM or machine identifiers. */
export function translateNode(node: ReactNode, language: 'en'|'hi'|'mr'): ReactNode {
  if (typeof node === 'string') return translate(node, language);
  if (Array.isArray(node)) return node.map((child,index) => {
    const translated=translateNode(child,language);
    // Recreated static JSX child arrays also need keys; retain authored list keys.
    return isValidElement(translated) && translated.key === null
      ? cloneElement(translated,{key:`::localized:${index}`})
      : translated;
  });
  if (!isValidElement<Record<string, unknown>>(node)) return node;
  const props: Record<string, unknown> = {};
  for (const key of ['title','intro','kicker','placeholder','aria-label','alt','text']) {
    if (typeof node.props[key] === 'string') props[key] = translate(node.props[key] as string, language);
  }
  if (Array.isArray(node.props.fallback)) props.fallback = node.props.fallback.map(v => typeof v === 'string' ? translate(v,language) : v);
  if (node.type === 'option' && node.props.value === undefined && typeof node.props.children === 'string') {
    props.value = node.props.children;
  }
  if ('children' in node.props) props.children = translateNode(node.props.children as ReactNode, language);
  return cloneElement(node, props);
}
