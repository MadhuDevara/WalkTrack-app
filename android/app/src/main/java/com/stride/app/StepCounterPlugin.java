package com.stride.app;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.os.Build;

import androidx.core.app.ActivityCompat;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

@CapacitorPlugin(
    name = "StepCounter",
    permissions = {
        @Permission(
            strings = { "android.permission.ACTIVITY_RECOGNITION" },
            alias = "activityRecognition"
        )
    }
)
public class StepCounterPlugin extends Plugin {

    @PluginMethod
    public void startService(PluginCall call) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            if (ActivityCompat.checkSelfPermission(
                    getContext(), android.Manifest.permission.ACTIVITY_RECOGNITION
            ) != PackageManager.PERMISSION_GRANTED) {
                requestPermissionForAlias("activityRecognition", call, "onPermissionResult");
                return;
            }
        }
        doStartService(call);
    }

    @PermissionCallback
    private void onPermissionResult(PluginCall call) {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q &&
            ActivityCompat.checkSelfPermission(
                getContext(), android.Manifest.permission.ACTIVITY_RECOGNITION
            ) != PackageManager.PERMISSION_GRANTED) {
            call.reject("ACTIVITY_RECOGNITION permission denied.");
            return;
        }
        doStartService(call);
    }

    private void doStartService(PluginCall call) {
        Intent i = new Intent(getContext(), StepCounterService.class);
        getContext().startForegroundService(i);
        call.resolve();
    }

    @PluginMethod
    public void stopService(PluginCall call) {
        Intent i = new Intent(getContext(), StepCounterService.class);
        getContext().stopService(i);
        call.resolve();
    }

    @PluginMethod
    public void getTodaySteps(PluginCall call) {
        SharedPreferences prefs = getContext()
            .getSharedPreferences(StepCounterService.PREFS, Context.MODE_PRIVATE);
        String today    = new SimpleDateFormat("yyyy-MM-dd", Locale.US).format(new Date());
        String lastDate = prefs.getString("last_updated", "");
        long   steps    = today.equals(lastDate) ? prefs.getLong("steps_today", 0) : 0;
        JSObject ret = new JSObject();
        ret.put("steps", steps);
        ret.put("date",  today);
        call.resolve(ret);
    }

    @PluginMethod
    public void isServiceRunning(PluginCall call) {
        SharedPreferences prefs = getContext()
            .getSharedPreferences(StepCounterService.PREFS, Context.MODE_PRIVATE);
        String today   = new SimpleDateFormat("yyyy-MM-dd", Locale.US).format(new Date());
        boolean active = today.equals(prefs.getString("last_updated", ""));
        JSObject ret = new JSObject();
        ret.put("running", active);
        call.resolve(ret);
    }
}
