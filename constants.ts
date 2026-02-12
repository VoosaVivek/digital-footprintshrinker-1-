
import { Category, OS } from './types';

export const SYSTEM_PATHS: Record<OS, Record<Category, string[]>> = {
  [OS.WINDOWS]: {
    [Category.BROWSER]: [
      '%LOCALAPPDATA%/Google/Chrome/User Data/Default/History',
      '%APPDATA%/Mozilla/Firefox/Profiles/*.default-release/places.sqlite'
    ],
    [Category.THUMBNAILS]: [
      '%LOCALAPPDATA%/Microsoft/Windows/Explorer/thumbcache_*.db'
    ],
    [Category.TEMP]: [
      '%TEMP%/*',
      'C:/Windows/Temp/*'
    ],
    [Category.RECENT]: [
      '%APPDATA%/Microsoft/Windows/Recent/*'
    ],
    [Category.APP_CACHE]: [
      '%LOCALAPPDATA%/Packages/*/AC/INetCache/*'
    ],
    [Category.EXIF]: [
      'C:/Users/%USERNAME%/Pictures/**/*'
    ]
  },
  [OS.LINUX]: {
    [Category.BROWSER]: [
      '~/.config/google-chrome/Default/History',
      '~/.mozilla/firefox/*.default-release/places.sqlite'
    ],
    [Category.THUMBNAILS]: [
      '~/.cache/thumbnails/**/*'
    ],
    [Category.TEMP]: [
      '/tmp/*',
      '/var/tmp/*'
    ],
    [Category.RECENT]: [
      '~/.local/share/recently-used.xbel'
    ],
    [Category.APP_CACHE]: [
      '~/.cache/*'
    ],
    [Category.EXIF]: [
      '~/Pictures/**/*'
    ]
  },
  [OS.MACOS]: {
    [Category.BROWSER]: [
      '~/Library/Application Support/Google/Chrome/Default/History',
      '~/Library/Application Support/Firefox/Profiles/*.default/places.sqlite'
    ],
    [Category.THUMBNAILS]: [
      '~/Library/Caches/com.apple.QuickLook.thumbnailcache/*'
    ],
    [Category.TEMP]: [
      '/tmp/*',
      '~/Library/Caches/TemporaryItems/*'
    ],
    [Category.RECENT]: [
      '~/Library/RecentItems/*'
    ],
    [Category.APP_CACHE]: [
      '~/Library/Caches/*'
    ],
    [Category.EXIF]: [
      '~/Pictures/**/*'
    ]
  }
};

export const RISK_WEIGHTS = {
  [Category.BROWSER]: 40,
  [Category.RECENT]: 25,
  [Category.EXIF]: 20,
  [Category.APP_CACHE]: 10,
  [Category.THUMBNAILS]: 3,
  [Category.TEMP]: 2
};
