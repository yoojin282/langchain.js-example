'use client';

import { useInitStore } from '@/store/init-store';
import { useEffect } from 'react';
import { Loader } from 'lucide-react';
import clsx from 'clsx';

export default function InitButton() {
  const { initialized, isSubmitting, init, check } = useInitStore();
  useEffect(() => {
    check();
  }, [check]);

  const handleLoad = () => {
    if (!confirm('데이터를 로드하시겠습니까?')) return;
    init();
  };
  return (
    <button
      onClick={handleLoad}
      disabled={initialized || isSubmitting}
      className={clsx(
        'flex items-center justify-center gap-2 rounded px-4 py-2 text-white',
        initialized || isSubmitting ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700',
      )}>
      {isSubmitting && <Loader className="h-4 w-4 animate-spin" />}
      {initialized ? '초기화 완료' : isSubmitting ? '로딩중...' : '데이터 로드'}
    </button>
  );
}
