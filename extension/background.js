chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

// Listen for alarms, like the daily 10am check
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'daily-task-check') {
    // Overdue task logic here
    console.log('Running daily task check');
  }
});

// Create alarm for daily 10am
chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create('daily-task-check', {
    delayInMinutes: 1, // Start shortly for testing
    periodInMinutes: 24 * 60, // Then daily
  });
});
