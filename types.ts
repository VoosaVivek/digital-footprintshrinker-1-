
export enum Category {
  BROWSER = 'Browser Artifacts',
  THUMBNAILS = 'System Thumbnails',
  TEMP = 'Temporary Files',
  RECENT = 'Recent Documents',
  APP_CACHE = 'Application Cache',
  EXIF = 'Image Metadata'
}

export enum OS {
  WINDOWS = 'Windows',
  LINUX = 'Linux',
  MACOS = 'macOS'
}

export interface PrivacyItem {
  id: string;
  path: string;
  category: Category;
  size: number;
  risk: 'High' | 'Medium' | 'Low';
  lastModified: string;
  os: OS;
  selected: boolean;
  cleaned: boolean;
  hash?: string;
}

export interface ScanResult {
  items: PrivacyItem[];
  score: number;
  scanTime: string;
  totalSize: number;
}

export interface ReportData {
  initialScore: number;
  finalScore: number;
  cleanedItems: PrivacyItem[];
  totalBytesSaved: number;
  timestamp: string;
}
