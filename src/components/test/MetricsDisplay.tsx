import { TestMetrics } from '@/types/network';
import { Card, CardContent } from '@/components/ui/card';
import { formatSpeed, formatPing, formatMos } from '@/lib/quality';
import { Gauge, Download, Upload, Globe, Youtube, TrendingUp } from 'lucide-react';

interface MetricsDisplayProps {
  metrics: TestMetrics | null;
  categoryColor?: 'blue' | 'green' | 'yellow' | 'red';
}

const colorClasses = {
  blue: 'text-status-excellent border-status-excellent/30 bg-status-excellent/5',
  green: 'text-status-good border-status-good/30 bg-status-good/5',
  yellow: 'text-status-fair border-status-fair/30 bg-status-fair/5',
  red: 'text-status-poor border-status-poor/30 bg-status-poor/5',
};

export function MetricsDisplay({ metrics, categoryColor = 'blue' }: MetricsDisplayProps) {
  if (!metrics) {
    return (
      <Card className="card-glass">
        <CardContent className="p-4">
          <div className="text-center text-muted-foreground py-8">
            <Gauge className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p className="text-sm">Waiting for test results...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const metricItems = [
    {
      icon: TrendingUp,
      label: 'Ping',
      value: formatPing(metrics.ping),
      subtext: metrics.ping < 20 ? 'Excellent' : metrics.ping < 50 ? 'Good' : metrics.ping < 100 ? 'Fair' : 'Poor',
    },
    {
      icon: Download,
      label: 'Download',
      value: formatSpeed(metrics.downloadSpeed),
      subtext: metrics.downloadSpeed > 5 ? 'Fast' : metrics.downloadSpeed > 2.5 ? 'Good' : 'Slow',
    },
    {
      icon: Upload,
      label: 'Upload',
      value: formatSpeed(metrics.uploadSpeed),
      subtext: metrics.uploadSpeed > 2 ? 'Fast' : metrics.uploadSpeed > 1 ? 'Good' : 'Slow',
    },
    {
      icon: Globe,
      label: 'Browse',
      value: `${metrics.browsingTime.toFixed(0)}ms`,
      subtext: metrics.browsingTime < 500 ? 'Fast' : metrics.browsingTime < 1000 ? 'Good' : 'Slow',
    },
    {
      icon: Youtube,
      label: 'Video MOS',
      value: formatMos(metrics.videoMos),
      subtext: metrics.videoMos > 4 ? 'HD Ready' : metrics.videoMos > 3 ? 'SD Ready' : 'Buffering',
    },
  ];

  return (
    <Card className={`border-2 transition-colors animate-scale-in ${colorClasses[categoryColor]}`}>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-3">
          {metricItems.slice(0, 4).map((item) => (
            <div
              key={item.label}
              className="p-3 rounded-lg bg-card/80 border border-border/50"
            >
              <div className="flex items-center gap-2 mb-1">
                <item.icon className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
                  {item.label}
                </span>
              </div>
              <p className="font-mono font-bold text-lg">{item.value}</p>
              <p className="text-[10px] text-muted-foreground">{item.subtext}</p>
            </div>
          ))}
        </div>
        
        {/* Video MOS - Full width */}
        <div className="mt-3 p-3 rounded-lg bg-card/80 border border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Youtube className="w-4 h-4 text-komdigi-red" />
              <span className="text-xs font-medium">Video Quality (MOS)</span>
            </div>
            <div className="text-right">
              <span className="font-mono font-bold text-xl">{formatMos(metrics.videoMos)}</span>
              <span className="text-xs text-muted-foreground ml-1">/ 5.0</span>
            </div>
          </div>
          <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-status-poor via-status-fair via-status-good to-status-excellent transition-all duration-500"
              style={{ width: `${(metrics.videoMos / 5) * 100}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
