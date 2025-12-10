import { Wifi, RefreshCw, AlertCircle, Globe, Server } from 'lucide-react';
import { NetworkInfo } from '@/types/network';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface ConnectionStatusCardProps {
  networkInfo: NetworkInfo;
  onRefresh: () => void;
}

export function ConnectionStatusCard({ networkInfo, onRefresh }: ConnectionStatusCardProps) {
  const { ip, isp, city, country, loading, error } = networkInfo;

  return (
    <Card className="card-glass animate-slide-up overflow-hidden">
      <div className="h-1 bg-gradient-to-r from-primary via-status-good to-komdigi-yellow" />
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Wifi className="w-4 h-4 text-primary" />
            </div>
            <span className="font-semibold text-sm">Connection Status</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onRefresh}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 text-destructive text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-2.5 rounded-lg bg-accent/50">
              <Server className="w-4 h-4 text-primary flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Detected Provider</p>
                <p className="font-semibold text-sm truncate">{isp || 'Unknown'}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/50">
              <Globe className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Public IP</p>
                <p className="font-mono text-sm">{ip || 'N/A'}</p>
              </div>
            </div>

            {(city || country) && (
              <p className="text-xs text-muted-foreground text-center">
                📍 {[city, country].filter(Boolean).join(', ')}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
