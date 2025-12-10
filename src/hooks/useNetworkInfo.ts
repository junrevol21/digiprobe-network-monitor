import { useState, useEffect, useCallback } from 'react';
import { NetworkInfo } from '@/types/network';

export function useNetworkInfo() {
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo>({
    ip: '',
    isp: '',
    loading: true,
  });

  const fetchNetworkInfo = useCallback(async () => {
    setNetworkInfo(prev => ({ ...prev, loading: true, error: undefined }));
    
    try {
      // Try ipwho.is first (more reliable for ISP detection)
      const response = await fetch('https://ipwho.is/');
      const data = await response.json();
      
      if (data.success !== false) {
        setNetworkInfo({
          ip: data.ip || '',
          isp: data.connection?.isp || data.connection?.org || 'Unknown ISP',
          country: data.country || '',
          region: data.region || '',
          city: data.city || '',
          loading: false,
        });
        return;
      }
      
      throw new Error('ipwho.is failed');
    } catch (error) {
      // Fallback to ipapi.co
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        setNetworkInfo({
          ip: data.ip || '',
          isp: data.org || 'Unknown ISP',
          country: data.country_name || '',
          region: data.region || '',
          city: data.city || '',
          loading: false,
        });
      } catch (fallbackError) {
        setNetworkInfo({
          ip: '',
          isp: '',
          loading: false,
          error: 'Failed to detect network information',
        });
      }
    }
  }, []);

  useEffect(() => {
    fetchNetworkInfo();
  }, [fetchNetworkInfo]);

  return { networkInfo, refetch: fetchNetworkInfo };
}
