'use client';

import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
} 