$vbsPath = "c:\Users\rohit\OneDrive\Documents\Sarkari News\runSilentDailyUpdate.vbs"
$action = New-ScheduledTaskAction -Execute "wscript.exe" -Argument "`"$vbsPath`""
$trigger = New-ScheduledTaskTrigger -Daily -At "10:00 AM"
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable -Hidden -ExecutionTimeLimit (New-TimeSpan -Hours 2)
Register-ScheduledTask -TaskName "SarkariJobAlertsDailyUpdate" -Action $action -Trigger $trigger -Settings $settings -Force
Write-Host "Task SarkariJobAlertsDailyUpdate registered successfully with silent background execution!"
