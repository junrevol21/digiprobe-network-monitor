import { TestStatus } from '@/types/network';
import { Circle, Loader2, CheckCircle2, PauseCircle } from 'lucide-react';

interface StatusCapsuleProps {
  status: TestStatus;
  loopCount?: number;
  testMode?: 'static' | 'drive';
}

export function StatusCapsule({ status, loopCount = 0, testMode = 'static' }: StatusCapsuleProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'ready':
        return {
          label: 'Ready',
          className: 'status-ready',
          icon: <Circle className="w-3 h-3" />,
        };
      case 'recording':
        return {
          label: testMode === 'static' ? `Recording ${loopCount}/5` : `Recording #${loopCount}`,
          className: 'status-recording',
          icon: <Loader2 className="w-3 h-3 animate-spin" />,
        };
      case 'stopping':
        return {
          label: 'Stopping',
          className: 'status-stopping',
          icon: <PauseCircle className="w-3 h-3" />,
        };
      case 'saved':
        return {
          label: 'Saved',
          className: 'status-saved',
          icon: <CheckCircle2 className="w-3 h-3" />,
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className={`status-capsule ${config.className}`}>
      {config.icon}
      <span>{config.label}</span>
    </div>
  );
}
