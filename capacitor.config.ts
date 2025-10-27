import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.welile.sms',
  appName: 'Welile SMS',
  webDir: 'dist',
  server: {
    url: 'https://welilereceipts.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#9333ea',
      showSpinner: false
    }
  }
};

export default config;
