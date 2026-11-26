import { type ReactNode } from 'react';
import { useI18n } from '@/lib/i18n';
import { translateNode } from '@/lib/translate-node';

/** Translate authored React text, never DOM nodes, input values, URLs or record IDs.
 * Ordinary translated copy can be shared across existing screens without changing
 * event handlers, reconciliation keys, form values or the stored enum contract.
 */
export function Localized({children}: {children: ReactNode}) {
  const {lang} = useI18n();
  return <>{translateNode(children,lang)}</>;
}
