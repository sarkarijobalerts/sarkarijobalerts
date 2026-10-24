$batPath = "c:\Users\rohit\OneDrive\Documents\Sarkari News\runDailyJobUpdate.bat"
$action = New-ScheduledTaskAction -Execute "cmd.exe" -Argument "/c `"$batPath`""
$trigger = New-ScheduledTaskTrigger -Daily -At "9:00 PM"
$settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable
Register-ScheduledTask -TaskName "SarkariJobAlertsDailyUpdate" -Action $action -Trigger $trigger -Settings $settings -Force
Write-Host "Task SarkariJobAlertsDailyUpdate registered successfully!"
