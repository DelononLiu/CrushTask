import { TaskProvider } from '@/context/TaskContext';
import TreeMenu from '@/components/TreeMenu';
import TaskDetail from '@/components/TaskDetail';

export default function Home() {
  return (
    <TaskProvider>
      <main className="h-screen flex bg-neutral-900">
        <aside className="w-64 border-r border-neutral-800 bg-neutral-900">
          <TreeMenu />
        </aside>
        <section className="flex-1 bg-neutral-950">
          <TaskDetail />
        </section>
      </main>
    </TaskProvider>
  );
}