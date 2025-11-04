'use client';
export const dynamic = 'force-dynamic';
import ScanClient from "./ScanClient";

import { Suspense } from 'react';

// app/scan/page.tsx (server component)
export default function ScanPage() {
  return (<Suspense fallback={<p>Loading...</p>}>
    <ScanClient />
  </Suspense>
  );
}