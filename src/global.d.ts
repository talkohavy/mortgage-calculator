/// <reference types="vite/client" />

// parseDate is exported at runtime by @ark-ui/react/date-picker but missing from its type declarations.
// It accepts a Date object or ISO string and returns a DateValue (CalendarDate).
declare module '@ark-ui/react/date-picker' {
  import type { DateValue } from '@ark-ui/react/date-picker';
  export function parseDate(value: Date | string): DateValue;
}

declare module '*.svg' {
  // 1. When config is set to: exportType: 'default':
  // const content: React.FC<React.SVGProps<SVGElement>>;
  // export default content;

  // 2. When config is set to: exportType: 'named':
  import type React from 'react';
  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  // biome-ignore lint: ambient module type declaration
  export { ReactComponent };
  export default ReactComponent;
}
