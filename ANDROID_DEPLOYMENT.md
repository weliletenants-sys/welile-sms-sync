# 📱 Android Deployment Guide - Welile SMS Companion

## ✅ What's Already Set Up

Your Welile SMS Companion app now has:
- ✅ **Capacitor** configured for native Android/iOS
- ✅ **Supabase Integration** with authentication
- ✅ **SMS Parser** for MTN & Airtel messages
- ✅ **Device Registration** system
- ✅ **Real-time transaction syncing** API

## 🚀 Deploy to Android Device/Emulator

### Step 1: Export to GitHub

1. Click the **GitHub button** (top right in Lovable)
2. Connect your GitHub account if not already connected
3. Choose "Export to GitHub" to create a new repository
4. Clone your repository locally:

```bash
git clone <YOUR_GITHUB_REPO_URL>
cd <YOUR_PROJECT_FOLDER>
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Build the Web App

```bash
npm run build
```

### Step 4: Add Android Platform

```bash
npx cap add android
```

This creates an `android/` folder with native Android project files.

### Step 5: Sync Capacitor

```bash
npx cap sync android
```

This copies your web app files to the Android project.

### Step 6: Open in Android Studio

```bash
npx cap open android
```

This launches Android Studio with your project.

### Step 7: Run on Device/Emulator

In Android Studio:
1. Wait for Gradle sync to complete
2. Select your device or create an emulator
3. Click the **Run** button (green play icon)

---

## 📲 SMS Access Setup (Native Android Code)

### Background SMS Receiver

The web app is ready to receive SMS data. To add native SMS reading, you need to create a Capacitor plugin or add Android code directly.

#### Option A: Quick Test (Manual SMS Input)

The app already includes a **Test SMS Parser** feature:
1. Sign in to the app
2. Click "Register Device"
3. Click "Test SMS Parser"
4. Paste an MTN/Airtel SMS message
5. Click "Sync Test SMS"

Example SMS to test:
```
You have received UGX 150,000 from John Okello. Ref: MTN123456
```

#### Option B: Native SMS Reader (Requires Android Code)

To automatically read SMS in the background, add this to your Android project:

**1. Add Permissions** (`android/app/src/main/AndroidManifest.xml`):
```xml
<uses-permission android:name="android.permission.RECEIVE_SMS" />
<uses-permission android:name="android.permission.READ_SMS" />
```

**2. Create SMS Receiver** (`android/app/src/main/java/.../SmsReceiver.kt`):

```kotlin
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.telephony.SmsMessage
import android.webkit.JavascriptInterface

class SmsReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == "android.provider.Telephony.SMS_RECEIVED") {
            val bundle = intent.extras ?: return
            val pdus = bundle.get("pdus") as Array<*>
            
            for (pdu in pdus) {
                val message = SmsMessage.createFromPdu(pdu as ByteArray)
                val sender = message.displayOriginatingAddress
                val body = message.messageBody
                
                // Send to WebView JavaScript
                // This requires a WebView bridge setup
                notifyWebView(sender, body)
            }
        }
    }
    
    private fun notifyWebView(sender: String, message: String) {
        // Trigger JavaScript function in WebView
        // Example: window.handleIncomingSms(sender, message)
    }
}
```

**3. Register Receiver** in `AndroidManifest.xml`:
```xml
<receiver android:name=".SmsReceiver"
    android:exported="true">
    <intent-filter android:priority="999">
        <action android:name="android.provider.Telephony.SMS_RECEIVED" />
    </intent-filter>
</receiver>
```

---

## 🔧 Configuration

### Update Server URL (for production)

Edit `capacitor.config.ts`:

```typescript
server: {
  url: 'https://your-deployed-app.lovable.app', // Change to production URL
  cleartext: true
}
```

For production builds, remove the `server` section entirely to use the built app instead of hot-reload.

### Supabase Credentials

The app is pre-configured with your Supabase credentials:
- **URL**: `https://dtcoxihxkcsvwaovgwvd.supabase.co`
- **Anon Key**: Already embedded in `src/lib/supabase.ts`

---

## 🧪 Testing

### Test SMS Parser

The app includes built-in SMS testing:

1. **Register Device**
   - Opens dashboard → Click "Register Device"
   - Device gets unique ID stored locally

2. **Test SMS Sync**
   - Click "Test SMS Parser"
   - Paste example SMS messages:

**MTN Example:**
```
You have received UGX 150,000 from John Okello. Your new balance is UGX 350,000. Ref: MTN123456
```

**Airtel Example:**
```
Dear customer, you have received UGX 200,000 from +256700123456. Txn ID: AT987654
```

3. **View Results**
   - Parsed transaction appears in dashboard
   - Check console for detailed parsing logs

### Test Authentication

1. **Sign Up**
   - Email: `test@example.com`
   - Password: `password123`

2. **Sign In**
   - Use same credentials
   - Redirects to dashboard

---

## 📊 API Endpoints (Already Integrated)

The app connects to these Supabase functions:

### 1. Device Registration
```typescript
POST /functions/v1/device-register
Body: { device_name: "Samsung Galaxy" }
Returns: { device_id, api_token }
```

### 2. SMS Sync
```typescript
POST /functions/v1/sms-sync
Body: {
  device_id: "WELILE-xxx",
  sender: "MTN Mobile Money",
  message: "...",
  amount: 150000,
  type: "Cash In",
  timestamp: "2025-10-13T14:05:00Z",
  reference: "MTN123456",
  network: "MTN"
}
```

---

## 🐛 Troubleshooting

### Build Fails
```bash
# Clean and rebuild
npm run build
npx cap sync android
```

### App Crashes on Launch
- Check Android Studio Logcat for errors
- Ensure minimum SDK version is 22 or higher

### SMS Not Syncing
1. Check device registration status
2. Verify Supabase credentials
3. Test with manual SMS input first
4. Check network connection

### "Not authenticated" Error
- Sign out and sign in again
- Clear app data in Android settings
- Check Supabase authentication settings

---

## 🎯 Next Steps

1. **Test on Real Device**
   - Enable USB debugging
   - Connect phone to computer
   - Run from Android Studio

2. **Add Native SMS Reading**
   - Implement SmsReceiver (see Option B above)
   - Request SMS permissions at runtime
   - Bridge SMS data to WebView

3. **Deploy to Production**
   - Remove `server` config from capacitor.config.ts
   - Build release APK
   - Sign with keystore

4. **Publish to Play Store**
   - Create Play Console account
   - Generate signed APK/AAB
   - Upload and publish

---

## 📝 Important Notes

- **Hot Reload**: Currently configured for development (loads from Lovable preview URL)
- **Production**: Remove server URL config for production builds
- **Permissions**: SMS permissions must be requested at runtime on Android 6+
- **Battery**: Background SMS receivers may be restricted on some devices
- **Testing**: Use the built-in SMS parser tester before implementing native code

---

## 🆘 Support

If you encounter issues:
1. Check Android Studio Logcat for errors
2. Review Supabase function logs
3. Test SMS parser with manual input first
4. Verify authentication is working

---

**🎉 Your app is ready for native Android deployment!**

The core functionality (auth, SMS parsing, syncing) is fully implemented and working in the web version. Native SMS reading requires additional Android-specific code as outlined above.
