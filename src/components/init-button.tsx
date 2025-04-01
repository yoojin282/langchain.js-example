'use client';

import { useInitStore } from '@/store/init-store';
import { useEffect } from 'react';

export default function InitButton() {
  const { initialized, isSubmitting, init, check } = useInitStore();
  useEffect(() => {
    check();
  }, [check]);

  if (initialized) return null;

  const handleLoad = () => {
    if (!confirm('데이터를 로드하시겠습니까?')) return;
    init();
  };
  return (
    <button
      onClick={handleLoad}
      disabled={isSubmitting}
      className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
      PDF 로드
    </button>
  );
}
