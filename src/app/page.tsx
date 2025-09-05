'use client'

import { Suspense } from 'react';
import HomePage from './home/page';

export default function App() {

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePage />
    </Suspense>
  )
}