export interface NetworkInfo {
  ip: string;
  isp: string;
  country?: string;
  region?: string;
  city?: string;
  loading: boolean;
  error?: string;
}

export interface TestSession {
  id: string;
  user_id: string;
  isp_name: string | null;
  public_ip: string | null;
  operator_label: string;
  test_mode: 'static' | 'drive';
  activity: string | null;
  remark: string | null;
  poi_name: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TestResult {
  id: string;
  session_id: string;
  lat: number | null;
  lng: number | null;
  ping: number | null;
  download_speed: number | null;
  upload_speed: number | null;
  browsing_time: number | null;
  video_mos: number | null;
  category_color: 'blue' | 'green' | 'yellow' | 'red' | null;
  created_at: string;
}

export interface TestMetrics {
  ping: number;
  downloadSpeed: number;
  uploadSpeed: number;
  browsingTime: number;
  videoMos: number;
}

export type TestStatus = 'ready' | 'recording' | 'stopping' | 'saved';

export type QualityCategory = 'excellent' | 'good' | 'fair' | 'poor';

export interface TestFormData {
  operatorLabel: string;
  testMode: 'static' | 'drive';
  activity: string;
  remark: string;
  poiName: string;
}

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  operatorLabel: string;
  categoryColor: 'blue' | 'green' | 'yellow' | 'red';
  metrics: TestMetrics;
  timestamp: string;
}
