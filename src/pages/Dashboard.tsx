import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useNetworkInfo } from '@/hooks/useNetworkInfo';
import { useSpeedTest } from '@/hooks/useSpeedTest';
import { TestFormData, TestMetrics, MapMarker } from '@/types/network';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

import { AppHeader } from '@/components/layout/AppHeader';
import { AppFooter } from '@/components/layout/AppFooter';
import { ConnectionStatusCard } from '@/components/test/ConnectionStatusCard';
import { StatusCapsule } from '@/components/test/StatusCapsule';
import { TestForm } from '@/components/test/TestForm';
import { MetricsDisplay } from '@/components/test/MetricsDisplay';
import { TestControls } from '@/components/test/TestControls';
import { TestMap } from '@/components/map/TestMap';
import { TrendChart } from '@/components/charts/TrendChart';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { LogOut, Map, BarChart3, List, Loader2 } from 'lucide-react';
import { TestResult } from '@/types/network';

type CategoryColor = 'blue' | 'green' | 'yellow' | 'red';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const { networkInfo, refetch: refetchNetworkInfo } = useNetworkInfo();
  
  const [formData, setFormData] = useState<TestFormData | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [markers, setMarkers] = useState<MapMarker[]>([]);
  const [results, setResults] = useState<TestResult[]>([]);
  const [mapCenter, setMapCenter] = useState<[number, number] | undefined>();
  const [currentCategory, setCurrentCategory] = useState<CategoryColor>('blue');

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  const handleResultComplete = useCallback(async (
    metrics: TestMetrics,
    categoryColor: CategoryColor,
    position?: GeolocationPosition
  ) => {
    if (!sessionId || !user) return;

    const lat = position?.coords.latitude || null;
    const lng = position?.coords.longitude || null;

    try {
      const { data, error } = await supabase
        .from('test_results')
        .insert({
          session_id: sessionId,
          lat,
          lng,
          ping: metrics.ping,
          download_speed: metrics.downloadSpeed,
          upload_speed: metrics.uploadSpeed,
          browsing_time: metrics.browsingTime,
          video_mos: metrics.videoMos,
          category_color: categoryColor,
        })
        .select()
        .single();

      if (error) throw error;

      setCurrentCategory(categoryColor);
      setResults(prev => [...prev, data as TestResult]);

      if (lat && lng && formData) {
        const newMarker: MapMarker = {
          id: data.id,
          lat,
          lng,
          operatorLabel: formData.operatorLabel,
          categoryColor,
          metrics,
          timestamp: data.created_at,
        };
        setMarkers(prev => [...prev, newMarker]);
        setMapCenter([lat, lng]);
      }
    } catch (error) {
      console.error('Error saving result:', error);
      toast.error('Failed to save test result');
    }
  }, [sessionId, user, formData]);

  const handleTestComplete = useCallback(async () => {
    if (!sessionId) return;

    try {
      await supabase
        .from('test_sessions')
        .update({ is_active: false })
        .eq('id', sessionId);

      toast.success('Test completed and saved!');
    } catch (error) {
      console.error('Error completing session:', error);
    }
  }, [sessionId]);

  const {
    status,
    currentLoop,
    currentMetrics,
    isRunning,
    startTest,
    stopTest,
    resetTest,
  } = useSpeedTest({
    testMode: formData?.testMode || 'static',
    onResultComplete: handleResultComplete,
    onTestComplete: handleTestComplete,
  });

  const handleFormSubmit = async (data: TestFormData) => {
    if (!user) return;

    try {
      const { data: session, error } = await supabase
        .from('test_sessions')
        .insert({
          user_id: user.id,
          isp_name: networkInfo.isp,
          public_ip: networkInfo.ip,
          operator_label: data.operatorLabel,
          test_mode: data.testMode,
          activity: data.activity || null,
          remark: data.remark || null,
          poi_name: data.poiName || null,
        })
        .select()
        .single();

      if (error) throw error;

      setFormData(data);
      setSessionId(session.id);
      setMarkers([]);
      setResults([]);
      
      // Auto start the test
      setTimeout(() => startTest(), 500);
    } catch (error) {
      console.error('Error creating session:', error);
      toast.error('Failed to create test session');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const handleNewTest = () => {
    setFormData(null);
    setSessionId(null);
    setMarkers([]);
    setResults([]);
    resetTest();
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader />

      <main className="flex-1 container max-w-lg mx-auto px-4 py-4 space-y-4">
        {/* User Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StatusCapsule 
              status={status} 
              loopCount={currentLoop} 
              testMode={formData?.testMode || 'static'} 
            />
          </div>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-1" />
            Logout
          </Button>
        </div>

        {/* Connection Status */}
        <ConnectionStatusCard 
          networkInfo={networkInfo} 
          onRefresh={refetchNetworkInfo} 
        />

        {/* Main Content */}
        {!formData ? (
          <TestForm
            defaultOperator={networkInfo.isp || ''}
            onSubmit={handleFormSubmit}
            disabled={networkInfo.loading}
          />
        ) : (
          <div className="space-y-4">
            {/* Test Info */}
            <div className="p-3 rounded-lg bg-accent/50 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-medium">{formData.operatorLabel}</span>
                <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                  {formData.testMode === 'static' ? 'Static Test' : 'Drive Test'}
                </span>
              </div>
              {formData.poiName && (
                <p className="text-xs text-muted-foreground mt-1">📍 {formData.poiName}</p>
              )}
            </div>

            {/* Metrics Display */}
            <MetricsDisplay metrics={currentMetrics} categoryColor={currentCategory} />

            {/* Test Controls */}
            <TestControls
              status={status}
              testMode={formData.testMode}
              onStart={startTest}
              onStop={stopTest}
              onReset={handleNewTest}
            />

            {/* Results Tabs */}
            {results.length > 0 && (
              <Tabs defaultValue="map" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="map" className="gap-1.5">
                    <Map className="w-3 h-3" />
                    Map
                  </TabsTrigger>
                  <TabsTrigger value="chart" className="gap-1.5">
                    <BarChart3 className="w-3 h-3" />
                    Chart
                  </TabsTrigger>
                  <TabsTrigger value="list" className="gap-1.5">
                    <List className="w-3 h-3" />
                    List
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="map" className="mt-3">
                  <TestMap
                    markers={markers}
                    showPolyline={formData.testMode === 'drive'}
                    center={mapCenter}
                  />
                </TabsContent>

                <TabsContent value="chart" className="mt-3">
                  <TrendChart results={results} />
                </TabsContent>

                <TabsContent value="list" className="mt-3">
                  <div className="space-y-2 max-h-[300px] overflow-auto">
                    {results.map((result, index) => (
                      <div
                        key={result.id}
                        className="p-3 rounded-lg bg-card border text-sm flex items-center justify-between"
                      >
                        <div>
                          <span className="font-medium">#{index + 1}</span>
                          <span className="text-xs text-muted-foreground ml-2">
                            {new Date(result.created_at).toLocaleTimeString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs">
                          <span>↓ {result.download_speed?.toFixed(1)} Mbps</span>
                          <span>↑ {result.upload_speed?.toFixed(1)} Mbps</span>
                          <div
                            className={`w-3 h-3 rounded-full ${
                              result.category_color === 'blue' ? 'bg-status-excellent' :
                              result.category_color === 'green' ? 'bg-status-good' :
                              result.category_color === 'yellow' ? 'bg-status-fair' :
                              'bg-status-poor'
                            }`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </div>
        )}
      </main>

      <AppFooter />
    </div>
  );
}
