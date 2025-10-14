import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.welile.sms',
  appName: 'Welile SMS',
  webDir: 'dist',
  server: {
    url: 'https://34e86468-7426-473f-acb7-939d3f084b65.lovableproject.com?forceHideBadge=true',
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
