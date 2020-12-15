if ("serviceWorker" in navigator) {
  // window.addEventListener("load", function() {
    registerSW();
    requestPermission();
  // });
} else {
  console.log("ServiceWorker belum didukung browser ini.");
}

function registerSW() {
  return navigator.serviceWorker
    .register("/service-worker-wb.js")
    .then(function(registration) {
      console.log("Pendaftaran ServiceWorker berhasil");
      return registration;
    })
    .catch(function() {
      console.log("Pendaftaran ServiceWorker gagal");
    });
}

function requestPermission() {
  if ('Notification' in window) {
    Notification.requestPermission().then(function (result) {
      if (result === "denied") {
        console.log("Fitur notifikasi tidak diijinkan.");
        return;
      } else if (result === "default") {
        console.error("Pengguna menutup kotak dialog permintaan ijin.");
        return;
      }

      navigator.serviceWorker.ready.then(() => {
        if (('PushManager' in window)) {
          navigator.serviceWorker.getRegistration().then(function(registration) {
              registration.pushManager.subscribe({
                  userVisibleOnly: true,
                  applicationServerKey: urlBase64ToUint8Array("BCrSmrBYJTIiX5VporPzfBm6DI02t8XztwrKivNX7x0M2iQRqWiqqPwjTeqqj8U9pQdcWQy93QHBirz9vrhXpqU"),
              }).then(function(subscribe) {
                  console.log('Berhasil melakukan subscribe dengan endpoint: ', subscribe.endpoint);
                  console.log('Berhasil melakukan subscribe dengan p256dh key: ', btoa(String.fromCharCode.apply(
                      null, new Uint8Array(subscribe.getKey('p256dh')))));
                  console.log('Berhasil melakukan subscribe dengan auth key: ', btoa(String.fromCharCode.apply(
                      null, new Uint8Array(subscribe.getKey('auth')))));
              }).catch(function(e) {
                  console.error('Tidak dapat melakukan subscribe ', e.message);
              });
          });
        };
      })
    });
  } else {
    console.error("Browser tidak mendukung notifikasi.");
  }
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
