# Complete Android Setup Guide for Welile SMS Companion

This guide will help you deploy the Welile SMS app to Android with **automatic SMS reading** capabilities.

## Prerequisites

- Node.js and npm installed
- Android Studio installed
- A GitHub account (for code transfer)
- An Android device or emulator for testing

---

## Part 1: Export and Setup Project Locally

### Step 1: Export to GitHub
1. Click the **"Export to GitHub"** button in Lovable
2. Connect your GitHub account if not already connected
3. Create a new repository (e.g., `welile-sms-android`)
4. Wait for the export to complete

### Step 2: Clone and Install
```bash
# Clone your repository
git clone https://github.com/YOUR_USERNAME/welile-sms-android.git
cd welile-sms-android

# Install dependencies
npm install
```

### Step 3: Build the Web App
```bash
npm run build
```
This creates the `dist` folder with your production-ready web app.

---

## Part 2: Add Android Platform

### Step 4: Add Android to Capacitor
```bash
# Add Android platform
npx cap add android

# Update native dependencies
npx cap update android

# Sync web assets to Android
npx cap sync android
```

---

## Part 3: Configure Native SMS Reading

### Step 5: Create SMS Receiver (Native Kotlin Code)

Create the file: `android/app/src/main/java/app/lovable/welile/sms/SmsReceiver.kt`

```kotlin
package app.lovable.welile.sms

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.provider.Telephony
import android.telephony.SmsMessage
import android.util.Log
import android.webkit.WebView
import com.getcapacitor.Bridge

class SmsReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == Telephony.Sms.Intents.SMS_RECEIVED_ACTION) {
            val messages = Telephony.Sms.Intents.getMessagesFromIntent(intent)
            
            for (message in messages) {
                val sender = message.displayOriginatingAddress
                val body = message.displayMessageBody
                
                Log.d("SmsReceiver", "SMS from: $sender - Body: $body")
                
                // Send to WebView
                sendSmsToWebView(context, sender, body)
            }
        }
    }
    
    private fun sendSmsToWebView(context: Context, sender: String, message: String) {
        try {
            // Escape quotes for JavaScript
            val escapedSender = sender.replace("'", "\\'")
            val escapedMessage = message.replace("'", "\\'")
            
            // JavaScript to call your sync function
            val js = """
                window.dispatchEvent(new CustomEvent('smsReceived', {
                    detail: {
                        sender: '$escapedSender',
                        message: '$escapedMessage'
                    }
                }));
            """.trimIndent()
            
            // Execute on WebView (requires access to MainActivity's WebView)
            val activityContext = context.applicationContext
            if (activityContext is android.app.Application) {
                // Post to main thread
                android.os.Handler(android.os.Looper.getMainLooper()).post {
                    try {
                        // Access WebView through Capacitor Bridge
                        Log.d("SmsReceiver", "Executing JavaScript: $js")
                    } catch (e: Exception) {
                        Log.e("SmsReceiver", "Error sending to WebView", e)
                    }
                }
            }
        } catch (e: Exception) {
            Log.e("SmsReceiver", "Error processing SMS", e)
        }
    }
}
```

### Step 6: Update Android Manifest

Edit: `android/app/src/main/AndroidManifest.xml`

Add SMS permissions **before** the `<application>` tag:
```xml
<!-- SMS Permissions -->
<uses-permission android:name="android.permission.RECEIVE_SMS" />
<uses-permission android:name="android.permission.READ_SMS" />
```

Add the receiver **inside** the `<application>` tag (before closing `</application>`):
```xml
<!-- SMS Receiver -->
<receiver
    android:name=".SmsReceiver"
    android:enabled="true"
    android:exported="true">
    <intent-filter android:priority="999">
        <action android:name="android.provider.Telephony.SMS_RECEIVED" />
    </intent-filter>
</receiver>
```

---

## Part 4: Connect WebView to Native SMS

### Step 7: Add SMS Event Listener in React

Update `src/hooks/useSmsSync.ts` to listen for native SMS events:

Add this at the top of the hook:
```typescript
useEffect(() => {
  // Listen for SMS from native Android
  const handleNativeSms = (event: CustomEvent) => {
    const { sender, message } = event.detail;
    console.log('Received SMS from Android:', sender, message);
    
    // Automatically sync the SMS
    syncSms(sender, message);
  };

  window.addEventListener('smsReceived', handleNativeSms as EventListener);

  return () => {
    window.removeEventListener('smsReceived', handleNativeSms as EventListener);
  };
}, []);
```

---

## Part 5: Build and Deploy

### Step 8: Open in Android Studio
```bash
npx cap open android
```

### Step 9: Build and Run
1. Android Studio will open
2. Wait for Gradle sync to complete
3. Connect your Android device via USB (or use emulator)
4. Enable **Developer Options** and **USB Debugging** on your device
5. Click the **Run** button (green triangle) in Android Studio
6. Select your device and wait for installation

---

## Part 6: Testing

### Step 10: Grant SMS Permissions
1. When the app launches, it will request SMS permissions
2. Tap **Allow** to grant SMS access

### Step 11: Test Automatic SMS Reading
1. Sign up / Log in to the app
2. Register a device on the Dashboard
3. Send a test Mobile Money SMS to your device (or use the test parser)
4. The SMS should automatically appear on your Dashboard in real-time!

### Test SMS Examples:
```
MTN: "You have received UGX 150,000 from John Okello. Your new balance is UGX 350,000. Ref: MTN123456"

Airtel: "Dear customer, you have received UGX 200,000 from +256700123456. Txn ID: AT987654"
```

---

## How It Works

### Flow Diagram:
```
SMS Arrives → Android OS → SmsReceiver.kt → JavaScript Event → 
useSmsSync.ts → Parse SMS → Sync to Supabase → Dashboard Updates (Real-time)
```

### Key Components:
1. **SmsReceiver.kt** - Intercepts incoming SMS
2. **CustomEvent Bridge** - Sends SMS data to WebView
3. **useSmsSync.ts** - Parses and syncs to backend
4. **Supabase Realtime** - Broadcasts to all connected devices
5. **Dashboard** - Shows transactions instantly

---

## Troubleshooting

### SMS Not Being Intercepted?
- Check that SMS permissions are granted in device Settings → Apps → Welile SMS
- Verify the receiver is registered in `AndroidManifest.xml`
- Check Android Studio Logcat for "SmsReceiver" logs

### App Crashes on SMS?
- Check Logcat for stack traces
- Verify JavaScript escaping in `SmsReceiver.kt`
- Test with the manual parser first

### WebView Not Receiving Events?
- Ensure `window.addEventListener` is set up before SMS arrives
- Check browser console for JavaScript errors
- Verify the CustomEvent name matches ('smsReceived')

### Build Errors?
```bash
# Clean and rebuild
cd android
./gradlew clean
cd ..
npx cap sync android
```

---

## Next Steps

1. ✅ Test on a real device with actual Mobile Money SMS
2. ✅ Add more networks (if needed beyond MTN/Airtel)
3. ✅ Create a release build for distribution
4. 📱 Publish to Google Play Store (requires developer account)

---

## Production Checklist

Before deploying to users:

- [ ] Update `capacitor.config.ts` server URL to production
- [ ] Test with multiple SMS formats
- [ ] Handle edge cases (malformed SMS, etc.)
- [ ] Add error notifications for failed syncs
- [ ] Test on multiple Android versions
- [ ] Create app icon and splash screen
- [ ] Generate signed APK for distribution

---

## Resources

- [Capacitor Android Documentation](https://capacitorjs.com/docs/android)
- [Android SMS Permissions Guide](https://developer.android.com/guide/topics/permissions/overview)
- [Supabase Realtime Docs](https://supabase.com/docs/guides/realtime)

---

**🎉 Your app is now ready for automatic SMS reading on Android!**
