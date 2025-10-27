# What You Need to Do

## 1. Clone the Project
```bash
git clone https://github.com/weliletenants-sys/welile-sms-sync.git
cd welile-sms-sync
```

## 2. Install Everything
```bash
npm install
```

## 3. Build the App
```bash
npm run build
```

## 4. Add Android
```bash
npx cap add android
npx cap sync
```

## 5. Create SMS Receiver File
Create this file: `android/app/src/main/java/app/lovable/welile/sms/SmsReceiver.kt`

Copy the Kotlin code from SETUP.md into it.

## 6. Edit Android Manifest
Open: `android/app/src/main/AndroidManifest.xml`

Add the SMS permissions and receiver registration from SETUP.md.

## 7. Open Android Studio
```bash
npx cap open android
```

## 8. Connect Your Phone
- Connect Android phone via USB
- Enable USB debugging in phone settings

## 9. Run the App
- Click green "Run" button in Android Studio
- Select your phone
- Grant SMS permissions when asked

## 10. Test
Send a Mobile Money SMS to your phone - it should automatically appear in the dashboard.

That's it!
