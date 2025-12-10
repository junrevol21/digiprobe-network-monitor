import { TestMetrics, QualityCategory } from '@/types/network';

export function getQualityCategory(metrics: TestMetrics): QualityCategory {
  const { ping, downloadSpeed, videoMos } = metrics;
  
  // Excellent: DL > 5Mbps, Ping < 20ms, MOS > 4
  if (downloadSpeed > 5 && ping < 20 && videoMos > 4) {
    return 'excellent';
  }
  
  // Good: DL 2.5-5Mbps, Ping 20-50ms, MOS 3-4
  if (downloadSpeed >= 2.5 && downloadSpeed <= 5 && ping >= 20 && ping <= 50 && videoMos >= 3 && videoMos <= 4) {
    return 'good';
  }
  
  // Fair: DL 1-2.5Mbps, Ping 50-100ms, MOS 2-3
  if (downloadSpeed >= 1 && downloadSpeed < 2.5 && ping >= 50 && ping <= 100 && videoMos >= 2 && videoMos < 3) {
    return 'fair';
  }
  
  // Poor: DL < 1Mbps, Ping > 100ms, MOS < 2
  return 'poor';
}

export function getCategoryColor(category: QualityCategory): 'blue' | 'green' | 'yellow' | 'red' {
  switch (category) {
    case 'excellent':
      return 'blue';
    case 'good':
      return 'green';
    case 'fair':
      return 'yellow';
    case 'poor':
      return 'red';
  }
}

export function getOperatorLetter(operatorLabel: string): { letter: string; color: string } {
  const label = operatorLabel.toLowerCase();
  
  if (label.includes('telkomsel') || label.includes('telekomunikasi selular')) {
    return { letter: 'T', color: '#ef4444' }; // Red
  }
  if (label.includes('indosat') || label.includes('ooredoo') || label.includes('hutchison')) {
    return { letter: 'H', color: '#eab308' }; // Yellow
  }
  if (label.includes('xl') || label.includes('smartfren') || label.includes('axiata')) {
    return { letter: 'X', color: '#a855f7' }; // Purple
  }
  
  // Non-cellular/WiFi - first letter or 'W'
  const firstLetter = operatorLabel.charAt(0).toUpperCase();
  return { letter: firstLetter || 'W', color: '#0EA5E9' }; // Blue
}

export function getCategoryBorderColor(color: 'blue' | 'green' | 'yellow' | 'red'): string {
  switch (color) {
    case 'blue':
      return '#0EA5E9';
    case 'green':
      return '#22c55e';
    case 'yellow':
      return '#eab308';
    case 'red':
      return '#ef4444';
  }
}

export function formatSpeed(speedMbps: number): string {
  if (speedMbps >= 1) {
    return `${speedMbps.toFixed(2)} Mbps`;
  }
  return `${(speedMbps * 1000).toFixed(0)} Kbps`;
}

export function formatPing(pingMs: number): string {
  return `${pingMs.toFixed(0)} ms`;
}

export function formatMos(mos: number): string {
  return mos.toFixed(1);
}
