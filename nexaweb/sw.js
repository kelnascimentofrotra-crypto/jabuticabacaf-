// NexaWeb service worker: lets sale notifications show on phones (Android and installed iPhone app).
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((windows) => {
      const app = windows.find((client) => /\/app\.html/.test(client.url) && "focus" in client);
      if (app) return app.focus();
      return self.clients.openWindow ? self.clients.openWindow("./app.html#finance") : undefined;
    }),
  );
});
