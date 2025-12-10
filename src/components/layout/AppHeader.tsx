import { Activity } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="hero-gradient text-primary-foreground px-4 py-3 sticky top-0 z-50 shadow-lg">
      <div className="container max-w-lg mx-auto flex items-center gap-3">
        <div className="p-2 bg-primary-foreground/10 rounded-xl backdrop-blur-sm">
          <Activity className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h1 className="text-lg font-bold tracking-tight">DigiProbe</h1>
          <p className="text-xs text-primary-foreground/80">Network Quality Monitoring</p>
        </div>
      </div>
    </header>
  );
}
