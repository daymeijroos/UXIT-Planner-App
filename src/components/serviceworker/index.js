'use strict'

// listen to message event from window
self.addEventListener('message', event => {
  // HOW TO TEST THIS?
  // Run this in your browser console: 
  //     window.navigator.serviceWorker.controller.postMessage({command: 'log', message: 'hello world'})
  // OR use next-pwa injected workbox object
  //     window.workbox.messageSW({command: 'log', message: 'hello world'})
  console.log(event.data + ' from window')
})

self.addEventListener("notificationclick", (event) => {
  Notification.requestPermission((status) => {
    // If the user said okay
    if (status === "granted") {
      console.log("Notification clicked");
      // Create a new notification
      self.registration.showNotification("Hello world!");
    }
  });
});