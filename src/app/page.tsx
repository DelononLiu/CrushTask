'use client';

import { TaskProvider } from '@/context/TaskContext';
import TaskPage from '@/components/TaskPage';

export default function Home() {
  return (
    <TaskProvider>
      <div className="h-screen flex bg-[#0a0a0a]">
        <TaskPage />
      </div>
    </TaskProvider>
  );
}