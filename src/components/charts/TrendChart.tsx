import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { TestResult } from '@/types/network';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';

interface TrendChartProps {
  results: TestResult[];
  title?: string;
}

export function TrendChart({ results, title = 'Performance Trend' }: TrendChartProps) {
  const data = results.map((result, index) => ({
    name: `#${index + 1}`,
    ping: result.ping || 0,
    download: result.download_speed || 0,
    upload: result.upload_speed || 0,
    mos: (result.video_mos || 0) * 20, // Scale to match other metrics
  }));

  return (
    <Card className="card-glass">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <TrendingUp className="w-4 h-4 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 10 }} 
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis 
                tick={{ fontSize: 10 }} 
                stroke="hsl(var(--muted-foreground))"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '10px' }} />
              <Line
                type="monotone"
                dataKey="download"
                name="Download (Mbps)"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--primary))' }}
              />
              <Line
                type="monotone"
                dataKey="upload"
                name="Upload (Mbps)"
                stroke="hsl(var(--status-good))"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--status-good))' }}
              />
              <Line
                type="monotone"
                dataKey="ping"
                name="Ping (ms)"
                stroke="hsl(var(--status-fair))"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--status-fair))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
