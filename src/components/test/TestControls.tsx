import { Play, Square, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TestStatus } from '@/types/network';

interface TestControlsProps {
  status: TestStatus;
  testMode: 'static' | 'drive';
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
}

export function TestControls({ status, testMode, onStart, onStop, onReset }: TestControlsProps) {
  return (
    <div className="flex gap-3">
      {status === 'ready' && (
        <Button
          onClick={onStart}
          className="flex-1 btn-gradient h-14 text-base gap-2"
        >
          <Play className="w-5 h-5" />
          Start {testMode === 'static' ? 'Static' : 'Drive'} Test
        </Button>
      )}

      {status === 'recording' && (
        <Button
          onClick={onStop}
          variant="destructive"
          className="flex-1 h-14 text-base gap-2"
        >
          <Square className="w-5 h-5" />
          {testMode === 'static' ? 'Testing...' : 'Stop Test'}
        </Button>
      )}

      {(status === 'stopping' || status === 'saved') && (
        <Button
          onClick={onReset}
          variant="outline"
          className="flex-1 h-14 text-base gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          New Test
        </Button>
      )}
    </div>
  );
}
