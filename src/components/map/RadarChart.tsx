import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { TestMetrics } from '@/types/network';

interface RadarChartComponentProps {
  metrics: TestMetrics;
  size?: number;
}

export function RadarChartComponent({ metrics, size = 200 }: RadarChartComponentProps) {
  // Normalize metrics to 0-100 scale
  const data = [
    {
      subject: 'Ping',
      value: Math.max(0, 100 - metrics.ping), // Lower is better
      fullMark: 100,
    },
    {
      subject: 'Download',
      value: Math.min(100, (metrics.downloadSpeed / 10) * 100), // 10 Mbps = 100%
      fullMark: 100,
    },
    {
      subject: 'Upload',
      value: Math.min(100, (metrics.uploadSpeed / 5) * 100), // 5 Mbps = 100%
      fullMark: 100,
    },
    {
      subject: 'Browse',
      value: Math.max(0, 100 - (metrics.browsingTime / 20)), // Lower is better
      fullMark: 100,
    },
    {
      subject: 'Video',
      value: (metrics.videoMos / 5) * 100, // MOS 5 = 100%
      fullMark: 100,
    },
  ];

  return (
    <div style={{ width: size, height: size }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="hsl(var(--border))" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} 
          />
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, 100]} 
            tick={{ fontSize: 8 }}
            axisLine={false}
          />
          <Radar
            name="Performance"
            dataKey="value"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={0.3}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
