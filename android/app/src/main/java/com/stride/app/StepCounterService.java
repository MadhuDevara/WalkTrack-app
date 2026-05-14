package com.dkmstack.app;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Build;
import android.os.IBinder;
import androidx.core.app.NotificationCompat;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

public class StepCounterService extends Service implements SensorEventListener {

    public static final String PREFS          = "WalkTrack_steps";
    private static final String CHANNEL_ID   = "WalkTrack_step_counter";
    private static final int    NOTIF_ID     = 1001;

    private SensorManager sensorManager;
    private Sensor        stepSensor;
    private SharedPreferences prefs;

    private long dayBaseline    = -1;
    private String currentDay   = "";

    @Override
    public void onCreate() {
        super.onCreate();
        prefs         = getSharedPreferences(PREFS, Context.MODE_PRIVATE);
        sensorManager = (SensorManager) getSystemService(SENSOR_SERVICE);
        stepSensor    = sensorManager.getDefaultSensor(Sensor.TYPE_STEP_COUNTER);
        createNotificationChannel();
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        long saved = loadTodaySteps();
        startForeground(NOTIF_ID, buildNotification(saved));
        if (stepSensor != null) {
            sensorManager.registerListener(this, stepSensor, SensorManager.SENSOR_DELAY_NORMAL);
        }
        return START_STICKY;
    }

    @Override
    public void onSensorChanged(SensorEvent event) {
        if (event.sensor.getType() != Sensor.TYPE_STEP_COUNTER) return;

        long hardwareTotal = (long) event.values[0];
        String today = todayDate();

        if (!today.equals(currentDay)) {
            currentDay  = today;
            dayBaseline = hardwareTotal;
            prefs.edit()
                .putLong("day_baseline_" + today, hardwareTotal)
                .putString("current_day", today)
                .apply();
        }

        if (dayBaseline < 0) {
            dayBaseline = prefs.getLong("day_baseline_" + today, hardwareTotal);
            currentDay  = today;
        }

        if (hardwareTotal < dayBaseline) {
            long stepsBeforeReboot = prefs.getLong("steps_today", 0);
            prefs.edit()
                .putLong("steps_before_reboot_" + today, stepsBeforeReboot)
                .putLong("day_baseline_" + today, hardwareTotal)
                .apply();
            dayBaseline = hardwareTotal;
        }

        long stepsThisSession = hardwareTotal - dayBaseline;
        long stepsBeforeReboot = prefs.getLong("steps_before_reboot_" + today, 0);
        long todayTotal = stepsBeforeReboot + stepsThisSession;
        if (todayTotal < 0) todayTotal = 0;

        prefs.edit()
            .putLong("steps_today", todayTotal)
            .putString("last_updated", today)
            .apply();

        NotificationManager nm = (NotificationManager) getSystemService(NOTIFICATION_SERVICE);
        if (nm != null) nm.notify(NOTIF_ID, buildNotification(todayTotal));
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {}

    @Override
    public IBinder onBind(Intent intent) { return null; }

    @Override
    public void onDestroy() {
        super.onDestroy();
        if (sensorManager != null) sensorManager.unregisterListener(this);
    }

    private long loadTodaySteps() {
        String today = todayDate();
        if (today.equals(prefs.getString("last_updated", ""))) {
            return prefs.getLong("steps_today", 0);
        }
        return 0;
    }

    private String todayDate() {
        return new SimpleDateFormat("yyyy-MM-dd", Locale.US).format(new Date());
    }

    private void createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel ch = new NotificationChannel(
                CHANNEL_ID, "Step Tracker", NotificationManager.IMPORTANCE_LOW
            );
            ch.setDescription("Counts your steps all day, even when WalkTrack is closed");
            ch.setShowBadge(false);
            NotificationManager nm = getSystemService(NotificationManager.class);
            if (nm != null) nm.createNotificationChannel(ch);
        }
    }

    private Notification buildNotification(long steps) {
        Intent openApp = new Intent(this, MainActivity.class);
        openApp.setFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);
        PendingIntent pi = PendingIntent.getActivity(
            this, 0, openApp,
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        String text = steps == 0 ? "Tracking steps..." : steps + " steps today";
        return new NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("WalkTrack")
            .setContentText(text)
            .setSmallIcon(R.drawable.ic_notif_steps)
            .setContentIntent(pi)
            .setOngoing(true)
            .setSilent(true)
            .setPriority(NotificationCompat.PRIORITY_LOW)
            .setCategory(NotificationCompat.CATEGORY_SERVICE)
            .build();
    }
}
