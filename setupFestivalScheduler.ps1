$vbsPath = "c:\Users\rohit\OneDrive\Documents\Sarkari News\runSilentFestivalBroadcast.vbs"
$action = New-ScheduledTaskAction -Execute "wscript.exe" -Argument "`"$vbsPath`""
$trigger = New-ScheduledTaskTrigger -Daily -At "08:00 AM"
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -Hidden -ExecutionTimeLimit (New-TimeSpan -Hours 1)

Register-ScheduledTask -TaskName "SarkariJobAlertsFestivalBroadcast" -Action $action -Trigger $trigger -Settings $settings -Force
Write-Host "✅ Scheduled Task 'SarkariJobAlertsFestivalBroadcast' registered successfully for 08:00 AM daily trigger!"
