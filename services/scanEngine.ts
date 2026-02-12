
import { Category, OS, PrivacyItem } from '../types';
import { SYSTEM_PATHS } from '../constants';

const generateMockFiles = (os: OS): PrivacyItem[] => {
  const items: PrivacyItem[] = [];
  const categories = Object.values(Category);
  
  categories.forEach(cat => {
    const basePaths = SYSTEM_PATHS[os][cat];
    const count = Math.floor(Math.random() * 8) + 2;
    
    for (let i = 0; i < count; i++) {
      const size = Math.floor(Math.random() * 5000000) + 1024;
      const risk = (cat === Category.BROWSER || cat === Category.RECENT) ? 'High' : 
                   (cat === Category.EXIF || cat === Category.APP_CACHE) ? 'Medium' : 'Low';
      
      const fileName = i === 0 ? basePaths[0].split('/').pop() || 'data.log' : `trace_${i}.tmp`;
      const fullPath = basePaths[0].replace('*', '') + fileName;

      items.push({
        id: Math.random().toString(36).substr(2, 9),
        path: fullPath,
        category: cat,
        size,
        risk,
        lastModified: new Date(Date.now() - Math.random() * 1000000000).toISOString(),
        os,
        selected: true,
        cleaned: false,
        hash: Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')
      });
    }
  });

  return items;
};

export const runScan = async (os: OS): Promise<PrivacyItem[]> => {
  // Simulate system latency
  await new Promise(resolve => setTimeout(resolve, 1500));
  return generateMockFiles(os);
};

export const calculatePrivacyScore = (items: PrivacyItem[]): number => {
  if (items.length === 0) return 100;
  
  const totalPotentialRisk = items.length * 10;
  const currentRisk = items.reduce((acc, item) => {
    let weight = 1;
    if (item.risk === 'High') weight = 10;
    if (item.risk === 'Medium') weight = 5;
    return acc + weight;
  }, 0);

  // Score starts at 100 and drops as risks increase
  const rawScore = 100 - (currentRisk / 5);
  return Math.max(0, Math.min(100, Math.round(rawScore)));
};
