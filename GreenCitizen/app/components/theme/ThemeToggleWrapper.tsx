'use client';

import { useEffect, useState } from 'react';
import { ThemeToggle } from './ThemeToggle';

export function ThemeToggleWrapper() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return <ThemeToggle />;
}