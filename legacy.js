var monitor = require('active-window');
var system = require('@paulcbetts/system-idle-time');
var screenshot = require("desktop-screenshot");


callback = function(window){
  try {
    console.log("App: " + window.app);
    console.log("Title: " + window.title);
  }catch(err) {
      console.log(err);
  } 
}

inactiveCallback = function () {
    console.log("Inactive: " + system.getIdleTime());
}

onScreenshotResponse = function (error, complete) {
    if(error)
        console.log("Screenshot failed", error);
    else
        console.log("Screenshot succeeded");
}

screenshotCallback = function () {
    screenshot('screenshotstest/screenshot' + Date.now() + ".jpg", { width: 900, height: 620, quality: 60 }, onScreenshotResponse);
}
/*Watch the active window 
  @callback
  @number of requests; infinity = -1 
  @interval between requests
*/
monitor.getActiveWindow(callback,-1,5);

setInterval(inactiveCallback, 1000);

setInterval(screenshotCallback, 5000);
//Get the current active window
//monitor.getActiveWindow(callback);