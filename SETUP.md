# Welile SMS Companion - Setup Guide

## Quick Setup: Clone to Run

### 1. Clone the Repository
```bash
git clone https://github.com/weliletenants-sys/welile-sms-sync.git
cd welile-sms-sync
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Build the Web App
```bash
npm run build
```

### 4. Add Android Platform
```bash
npx cap add android
```

### 5. Sync the Project
```bash
npx cap sync
```

### 6. Create Native SMS Receiver

Create the file: `android/app/src/main/java/app/lovable/welile/sms/SmsReceiver.kt`

```kotlin
package app.lovable.welile.sms

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.provider.Telephony
import android.telephony.SmsMessage
import android.util.Log
import com.getcapacitor.Bridge

class SmsReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == Telephony.Sms.Intents.SMS_RECEIVED_ACTION) {
            val bundle = intent.extras
            if (bundle != null) {
                val pdus = bundle.get("pdus") as Array<*>
                for (pdu in pdus) {
                    val message = SmsMessage.createFromPdu(pdu as ByteArray)
                    val sender = message.displayOriginatingAddress
                    val messageBody = message.messageBody

                    Log.d("SmsReceiver", "SMS from: $sender, Message: $messageBody")

                    // Send to WebView via JavaScript
                    sendSmsToWebView(context, sender, messageBody)
                }
            }
        }
    }

    private fun sendSmsToWebView(context: Context, sender: String, message: String) {
        try {
            // Create JavaScript to dispatch custom event
            val js = """
                window.dispatchEvent(new CustomEvent('smsReceived', {
                    detail: {
                        sender: '$sender',
                        message: `$message`
                    }
                }));
            """.trimIndent()

            // Execute in WebView
            val bridge = Bridge.getInstance()
            bridge?.webView?.post {
                bridge.webView.evaluateJavascript(js, null)
            }
        } catch (e: Exception) {
            Log.e("SmsReceiver", "Error sending SMS to WebView", e)
        }
    }
}
```

### 7. Update Android Manifest

Edit `android/app/src/main/AndroidManifest.xml` and add these permissions and receiver:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    
    <!-- Add these permissions at the top -->
    <uses-permission android:name="android.permission.RECEIVE_SMS" />
    <uses-permission android:name="android.permission.READ_SMS" />
    <uses-permission android:name="android.permission.INTERNET" />

    <application>
        <!-- Your existing activity code here -->
        
        <!-- Add this receiver before closing </application> -->
        <receiver
            android:name=".SmsReceiver"
            android:exported="true"
            android:enabled="true">
            <intent-filter android:priority="999">
                <action android:name="android.provider.Telephony.SMS_RECEIVED" />
            </intent-filter>
        </receiver>
    </application>
</manifest>
```

### 8. Open in Android Studio
```bash
npx cap open android
```

### 9. Run on Device

1. Connect your Android device via USB (enable USB debugging)
2. In Android Studio, click the green "Run" button
3. Select your device
4. Grant SMS permissions when prompted

### 10. Test

Send a Mobile Money SMS to the device:
- The app will automatically intercept it
- Parse the transaction details
- Sync to the dashboard

Done! Your app is now running with automatic SMS reading.

## Troubleshooting

**App crashes on SMS?**
- Check Logcat in Android Studio for errors
- Verify SMS permissions are granted

**SMS not being received?**
- Check that permissions are granted in device settings
- Verify the SmsReceiver is registered in manifest

**WebView not getting SMS?**
- Check that Bridge.getInstance() is not null
- Verify JavaScript event listener is set up in React
