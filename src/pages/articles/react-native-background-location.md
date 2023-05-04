---
layout: '@/templates/BasePost.astro'
title: React-Native Background Location
description: This post will cover a topic that has been key in many applications and will focus on a solution working fully on the background and the most interesting part of all, working from Android 4.4 to Android Oreo.
pubDate: 2019-09-03T00:00:00Z
imgSrc: '/assets/images/article-rn-bg.jpeg?nf_resize=fit&w=1080&h=720'
imgAlt: 'Article image'
---

This post will cover a topic that has been key in many applications and will focus on a solution working fully on the background and the most interesting part of all: working from Android 4.4 (SDK 19) to the most recent version at the time of writing which is Android Oreo (SDK 27).

The purpose of the solution is not for real-time tracking, it’s to track a user location in small intervals (e.g. 5 or 10 minutes), but it could be taken to an extreme where you could try to get location updates on a much smaller interval (e.g. 1 minute).

---

## Android 8 and its particularities

With Oreo, Google wanted to bring a few changes to the table, mainly regarding background services and background location.

The changes can be read with more detail in these two pages:

- [Background Execution Limits](https://developer.android.com/about/versions/oreo/background.html#broadcasts)
- [Background Location Limits](https://developer.android.com/about/versions/oreo/background-location-limits)

But I will give you a summary of what they are.

What motivated Google to do these changes was power and resource consumption by third party apps, or in other words, they want to better control their operating system environment by giving developers a more controlled freedom to develop. Which means we are not able to run background tasks as freely as we were running them in previous versions of Android.

This change makes sense in order to deliver a better user experience to their target market. After all, we don’t want to have an app stealing all our smartphone resources because it’s running too many background tasks or simply isn’t handling code well which in turn may destroy not only processing resources but memory as well 🙂.

With new background service limitations, what Google suggests in their “Background Execution Limits” page is:

> In most cases, apps can work around these limitations by using JobScheduler jobs. This approach lets an app arrange to perform work when the app isn't actively running, but still gives the system the leeway to schedule these jobs in a way that doesn't affect the user experience.

This seems a very good suggestion, but there are a few gotchas.

### Gotcha #1

JobScheduler was added in SDK 21 aka Android 5, so it’s not really an option if we’re targeting Android 4.4.

### Gotcha #2

Even if we were targeting Android 5 and above, there would be a slight problem. Jobs that are scheduled to run by JobScheduler can only run at a minimum interval of 15 minutes, which brings us to our article title “React-Native Background Location” and we want to design a solution to get location updates on our users. 15 minutes is a big interval if we are talking about location, so we need to figure out a different way to get the results we want.

---

## Purpose of the solution

So what we are going to build is just a small part of a big project that is designed for truck drivers to use while they are performing their shipment deliveries. The purpose is for the company that employs the truck driver and for the client to be able to know where the driver and consequently their shipment is. This feature has a few requirements:

- Tracking can have an interval of 5–10 minutes
- Tracking must be active with the app in the background
- Power consumption should be kept to the minimum
- Memory leaks and memory usage should be non-existent / low respectively

Given these guidelines we definitely need to look for background services APIs in Android.

The first logical choice to look at is WorkManager API.

### WorkManager API

At first sight this API seems to be perfect for our case since it even supports devices with Android 4.0 and can create background tasks even when the phone restarts. It’s pretty flexible since it does a ton of work for you but it has a huge gotcha which is: it’s a dependency in AndroidX.

So for those of you who don’t know, AndroidX is a new support library supplied by the Android ecosystem in order to unify and provide newer APIs and packages for developers to use in their apps. The trick here is: you either use dependencies under AndroidX or prior to AndroidX. You can’t mix them both up since there will be naming collision when you are importing dependencies that are present in both support library providers. Many API’s fall under this problem.

Another thing that I would like to point out is that the original project from which this solution derived is an enterprise level application done in react-native with 2 years of development on top of it and with many dependencies already installed.

So migrating all the dependencies to AndroidX is pretty much impossible, since you would have to change every direct dependency under the app and every react-native project dependency in the project also.

In summary, this API needs to be excluded, since in our particular case it couldn’t do the work it’s designed to do.

### What about the AlarmManager API?

With AlarmManager API we are able to schedule background services to run on a specific interval defined by us with a minimal interval time of 1 minute, which is great!

The main gotcha with this API is that it is not able to launch background services if the app itself is in the background, at least in Android 8 and above. This is a blocker if we want to make sure that our app is still tracking our user if the messaging or any other app is open and in the foreground.

Although it doesn’t solve our problem entirely, it’s still a very useful API since it launches a new thread to run our services for us and we are able to cancel the alarms we schedule and closing the allocated threads that way.

### Enter Foreground Services

With Foreground Services we are able to maintain a service running continuously on the background even when our app is not on the foreground. We are able to do this because our app will have an undismissable notification informing the user that it is still running although he might not be seeing it at the moment. Because our app is informing the user that it’s still running, Google allows it to do virtually any background task you want to do, which in our case is perfect!

So the solution we are going to analyse involves a Foreground service, an AlarmManager API instance, an IntentService and a BroadcastReceiver in order to get regular location updates and store them locally.

## The Solution

The final reproducible demo is [available here](https://github.com/comoser/rn-background-location), and it’s a very small reproducible example of what we want to achieve.

First of all, our solution is based on a lot of native Java code, so from this point onward you can only implement this solution in case you have an ejected react-native app, which is something similar to when you create a react-native project with react-native init my-project .

In order to use the smartphone’s location you naturally have to request permissions for this. This part is handled in the JS side, but it’s nothing major, just skim through the files in order to checkout what’s happening.

First, let’s create our native module, in order to be able to initiate our native code from the JavaScript side.

```javascript
package com.rnbglocation.location;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;

import androidx.core.content.ContextCompat;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.gson.Gson;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

import static com.rnbglocation.location.LocationForegroundService.LOCATION_EVENT_DATA_NAME;

public class LocationModule extends ReactContextBaseJavaModule implements LocationEventReceiver, JSEventSender {
    private static final String MODULE_NAME = "LocationManager";
    private static final String CONST_JS_LOCATION_EVENT_NAME = "JS_LOCATION_EVENT_NAME";
    private static final String CONST_JS_LOCATION_LAT = "JS_LOCATION_LAT_KEY";
    private static final String CONST_JS_LOCATION_LON = "JS_LOCATION_LON_KEY";
    private static final String CONST_JS_LOCATION_TIME = "JS_LOCATION_TIME_KEY";

    private Context mContext;
    private Intent mForegroundServiceIntent;
    private BroadcastReceiver mEventReceiver;
    private Gson mGson;

    LocationModule(@Nonnull ReactApplicationContext reactContext) {
        super(reactContext);
        mContext = reactContext;
        mForegroundServiceIntent = new Intent(mContext, LocationForegroundService.class);
        mGson = new Gson();
        createEventReceiver();
        registerEventReceiver();
    }

    @ReactMethod
    public void startBackgroundLocation() {
        ContextCompat.startForegroundService(mContext, mForegroundServiceIntent);
    }

    @ReactMethod
    public void stopBackgroundLocation() {
        mContext.stopService(mForegroundServiceIntent);
    }

    @Nullable
    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = new HashMap<>();
        constants.put(CONST_JS_LOCATION_EVENT_NAME, LocationForegroundService.JS_LOCATION_EVENT_NAME);
        constants.put(CONST_JS_LOCATION_LAT, LocationForegroundService.JS_LOCATION_LAT_KEY);
        constants.put(CONST_JS_LOCATION_LON, LocationForegroundService.JS_LOCATION_LON_KEY);
        constants.put(CONST_JS_LOCATION_TIME, LocationForegroundService.JS_LOCATION_TIME_KEY);
        return constants;
    }

    @Nonnull
    @Override
    public String getName() {
        return MODULE_NAME;
    }

    @Override
    public void createEventReceiver() {
        mEventReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                LocationCoordinates locationCoordinates = mGson.fromJson(
                        intent.getStringExtra(LOCATION_EVENT_DATA_NAME), LocationCoordinates.class);
                WritableMap eventData = Arguments.createMap();
                eventData.putDouble(
                        LocationForegroundService.JS_LOCATION_LAT_KEY,
                        locationCoordinates.getLatitude());
                eventData.putDouble(
                        LocationForegroundService.JS_LOCATION_LON_KEY,
                        locationCoordinates.getLongitude());
                eventData.putDouble(
                        LocationForegroundService.JS_LOCATION_TIME_KEY,
                        locationCoordinates.getTimestamp());
                // if you actually want to send events to JS side, it needs to be in the "Module"
                sendEventToJS(getReactApplicationContext(),
                        LocationForegroundService.JS_LOCATION_EVENT_NAME, eventData);
            }
        };
    }

    @Override
    public void registerEventReceiver() {
        IntentFilter eventFilter = new IntentFilter();
        eventFilter.addAction(LocationForegroundService.LOCATION_EVENT_NAME);
        mContext.registerReceiver(mEventReceiver, eventFilter);
    }

    @Override
    public void sendEventToJS(ReactContext reactContext, String eventName, @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }
}
```

This is the first step to our Location feature. This is a common procedure for every native module you want to build for react native, you can follow [more documentation here](https://facebook.github.io/react-native/docs/native-modules-android).

The two most important parts in this file are the LocationEventReceiver and JSEventSender interfaces. These were created to show two responsibilities of whatever class implements them respectively:

1. To receive the location updates through a BroadcastReceiver .
2. To send events to the JS side (with the location updates).

It’s important to note that if we want to send events to the JS side, we need to do the actual sending of the events in the React modules created by us, since the ReactApplicationContext is needed to do this. If not for this, the JSEventSender interface could be implemented directly by our Foreground Service.

This Module will expose 2 methods accessible on the JS side:

- `startBackgroundLocation`
- `stopBackgroundLocation`

They will be responsible for either launching our Foreground Service or stopping it.

---

Next we’re going to analyse a bit our Foreground Service, which is kind of our mastermind behind everything.

```javascript
package com.rnbglocation.location;

import android.app.AlarmManager;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.os.Build;
import android.os.IBinder;

import androidx.annotation.Nullable;
import androidx.core.app.NotificationCompat;

import com.google.gson.Gson;
import com.rnbglocation.MainActivity;

public class LocationForegroundService extends Service implements LocationEventReceiver {
    public static final String CHANNEL_ID = "ForegroundServiceChannel";
    public static final int NOTIFICATION_ID = 1;
    public static final String LOCATION_EVENT_NAME = "com.rnbglocation.LOCATION_INFO";
    public static final String LOCATION_EVENT_DATA_NAME = "LocationData";
    public static final int LOCATION_UPDATE_INTERVAL = 60000;
    public static final String JS_LOCATION_LAT_KEY = "latitude";
    public static final String JS_LOCATION_LON_KEY = "longitude";
    public static final String JS_LOCATION_TIME_KEY = "timestamp";
    public static final String JS_LOCATION_EVENT_NAME = "location_received";

    private AlarmManager mAlarmManager;
    private BroadcastReceiver mEventReceiver;
    private PendingIntent mLocationBackgroundServicePendingIntent;
    private Gson mGson;

    @Override
    public void onCreate() {
        super.onCreate();
        mAlarmManager = (AlarmManager) getApplicationContext().getSystemService(Context.ALARM_SERVICE);
        mGson = new Gson();
        createEventReceiver();
        registerEventReceiver();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        createNotificationChannel();
        startForeground(NOTIFICATION_ID, createNotification());

        createLocationPendingIntent();
        mAlarmManager.setRepeating(
            AlarmManager.RTC,
            System.currentTimeMillis(),
            LOCATION_UPDATE_INTERVAL,
            mLocationBackgroundServicePendingIntent
        );

        return START_NOT_STICKY;
    }

    @Override
    public void createEventReceiver() {
        mEventReceiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                LocationCoordinates locationCoordinates = mGson.fromJson(
                        intent.getStringExtra(LOCATION_EVENT_DATA_NAME), LocationCoordinates.class);
                /*
                TODO: do any kind of logic in here with the LocationCoordinates class
                e.g. like a request to an API, etc --> all on the native side
                */
            }
        };
    }

    @Override
    public void registerEventReceiver() {
        IntentFilter eventFilter = new IntentFilter();
        eventFilter.addAction(LOCATION_EVENT_NAME);
        registerReceiver(mEventReceiver, eventFilter);
    }

    @Nullable
    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public void onDestroy() {
        unregisterReceiver(mEventReceiver);
        mAlarmManager.cancel(mLocationBackgroundServicePendingIntent);
        stopSelf();
        super.onDestroy();
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel serviceChannel = new NotificationChannel(
                    CHANNEL_ID,
                    "Foreground Service Channel",
                    NotificationManager.IMPORTANCE_DEFAULT
            );

            NotificationManager manager = getSystemService(NotificationManager.class);
            manager.createNotificationChannel(serviceChannel);
        }
    }

    private Notification createNotification() {
        Intent notificationIntent = new Intent(this, MainActivity.class);
        PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, notificationIntent, 0);

        return new NotificationCompat.Builder(this, CHANNEL_ID)
                .setContentIntent(pendingIntent)
                .build();
    }

    private void createLocationPendingIntent() {
        Intent i = new Intent(getApplicationContext(), LocationBackgroundService.class);
        mLocationBackgroundServicePendingIntent = PendingIntent.getService(getApplicationContext(), 1, i, PendingIntent.FLAG_UPDATE_CURRENT);
    }
}
```

In this service we are implementing LocationEventReceiver like we were on the module. This may be a bit redundant in such a simple demo, but the purpose of having this service knowing the location updates is because you may want your foreground service to launch different background tasks with different work depending on the location of the user, or you may want to do specific native work like persisting these coordinates locally.

The onStartCommand method is the base of the service and it’s responsible for:

- Creating our notification channel (a necessary step from Oreo up)
- Creating the notification that is displayed to our users 
- Call startForeground method which is crucial to start this service as a foreground service 
- Use AlarmManager to schedule a background task to fetch our user location with 1 minute intervals (the interval is fully customisable of course)

Don’t forget that for your app to be able to use foreground services, it must declare the permissions for it in the manifest file with:

- `<uses-permission android:name= "android.permission.FOREGROUND_SERVICE" />`

---

The actual location fetching and handling is done in a background task on a different thread than the main one. Let’s check out this background service.

```javascript
package com.rnbglocation.location;

import android.annotation.SuppressLint;
import android.app.IntentService;
import android.content.Intent;
import android.location.Location;
import android.os.Handler;

import androidx.annotation.Nullable;

import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationCallback;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationResult;
import com.google.android.gms.location.LocationServices;
import com.google.gson.Gson;

import java.util.Date;

public class LocationBackgroundService extends IntentService {
    private FusedLocationProviderClient mFusedLocationClient;
    private LocationCallback mLocationCallback;
    private Gson mGson;

    public LocationBackgroundService() {
        super(LocationForegroundService.class.getName());
        mGson = new Gson();
    }

    @SuppressLint("MissingPermission")
    @Override
    protected void onHandleIntent(@Nullable Intent intent) {
        mFusedLocationClient = LocationServices.getFusedLocationProviderClient(getApplicationContext());
        mLocationCallback = createLocationRequestCallback();

        LocationRequest locationRequest = LocationRequest.create()
                .setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY)
                .setInterval(0)
                .setFastestInterval(0);

        new Handler(getMainLooper()).post(() -> mFusedLocationClient.requestLocationUpdates(locationRequest, mLocationCallback, null));
    }

    private LocationCallback createLocationRequestCallback() {
        return new LocationCallback() {
            @Override
            public void onLocationResult(LocationResult locationResult) {
                if (locationResult == null) {
                    return;
                }
                for (Location location : locationResult.getLocations()) {
                    LocationCoordinates locationCoordinates = createCoordinates(location.getLatitude(), location.getLongitude());
                    broadcastLocationReceived(locationCoordinates);
                    mFusedLocationClient.removeLocationUpdates(mLocationCallback);
                }
            }
        };
    }

    private LocationCoordinates createCoordinates(double latitude, double longitude) {
        return new LocationCoordinates()
                .setLatitude(latitude)
                .setLongitude(longitude)
                .setTimestamp(new Date().getTime());
    }

    private void broadcastLocationReceived(LocationCoordinates locationCoordinates) {
        Intent eventIntent = new Intent(LocationForegroundService.LOCATION_EVENT_NAME);
        eventIntent.putExtra(LocationForegroundService.LOCATION_EVENT_DATA_NAME, mGson.toJson(locationCoordinates));
        getApplicationContext().sendBroadcast(eventIntent);
    }
}
```

This service is pretty simple, it’s using FusedLocationProviderClient to fetch the user location with the details specified in our LocationRequest .

When the location provider finishes fetching the user location, we then send that location transformed into our LocationCoordinates class through our broadcast mechanism for anyone who wants to listen for those coordinates.

These files are the heart of this solution, and with this you can perfectly control user location on almost all Android smartphones out there with a react native solution which is incredibly resource and battery friendly.

--- 

## Additional Notes

For Android 4.4 support there are a few extra steps needed, and they are included on the demo provided but I think they are worth mentioning nonetheless.

In our app.gradle file we need to include a new dependency regarding the build process of the APK, and that dependency is:

- `implementation “com.android.support:multidex:1.0.3”`

Besides that, in that very same file we need to declare that we want our app to enable multi-dexing with the following statement:

- `multiDexEnabled true` under the `defaultConfig` piece of configuration

This will let our app know that we want to include this, but in order for everything to work well we need to do one more thing under the MainApplication.java file:

- `… MainApplication extends MultiDexApplication …`

With these configurations we make sure that our app is now fully compatible until Android 4.4 which is great!

## Conclusion

React-Native is a great platform for developers to use and definitely speeds things up for devs coming from a mostly web background. Still, there are many things that require native knowledge on either Android or iOS and this demo is an example of that.

One thing that I would like to say about the technology itself is:

> Be careful when choosing the technology for your app when you’re in an enterprise environment. React Native is far from stable, and the breaking changes are several from version to version.

Just to have a small idea:

- v0.60 — breaking changes involved for some users
- v0.59 — breaking changes on Android
- v0.58 — breaking changes for some components
- v0.57.2 — breaking changes due to elements removed

> Taking this into account, you can see that all the breaking changes from version to version may have problems on app maintenance in the future when you try to upgrade your app for some new features, optimisations or simply bug fixes. Consider the trade-offs well when considering this technology against the more traditional ones, especially if you’re aiming for something that is going to be maintained long term or you won’t have a particular big or specialised team involved on building and maintaining the product.

I hope you liked this simple demo and most of all, I hope it helps you in your project! 🎉

I would also love your feedback 🙂
If you find this article interesting, please share it, because you know — Sharing is caring!
