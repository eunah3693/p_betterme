'use client';

import { useDebugValue } from 'react';

type DebugValue = Record<string, unknown>;

function formatDebugValue(label: string, value: DebugValue) {
  const entries = Object.entries(value)
    .map(([key, item]) => `${key}: ${String(item)}`)
    .join(', ');

  return `${label}(${entries})`;
}

export function useDebugInfo(label: string, value: DebugValue) {
  useDebugValue(value, (debugValue) => formatDebugValue(label, debugValue));
}
