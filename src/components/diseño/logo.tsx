import { ClipboardCheck } from 'lucide-react';

export default function Logo() {
  return (
    <div className="flex items-center gap-2 text-primary">
      <ClipboardCheck className="h-8 w-8" />
      <h1 className="text-2xl font-bold font-headline tracking-tight">
        UniTask
      </h1>
    </div>
  );
}
