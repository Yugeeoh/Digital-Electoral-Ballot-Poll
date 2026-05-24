// This code would typically be in a separate JavaScript file (e.g., script.js)
// linked from your index.html, or directly in a <script> tag before </body>.

if ('serviceWorker' in navigator && 'PushManager' in window) {
    console.log('Service Worker and Push is supported');

    navigator.serviceWorker.register('scripts/service-worker.js')
        .then(function(swReg) {
            console.log('Service Worker is registered', swReg);

            swReg.pushManager.getSubscription()
                .then(function(subscription) {
                    if (subscription === null) {
                        // User is not subscribed, prompt to subscribe
                        console.log('User is NOT subscribed to push.');
                        // You might want to show a UI element here to ask the user to subscribe
                        // For example, a button that calls subscribeUser()
                    } else {
                        // User is subscribed
                        console.log('User IS subscribed to push.');
                        console.log('Subscription object:', subscription);
                        // At this point, you could send a "welcome back" notification
                        // though typically notifications are sent from the server side.
                        // To send a notification directly from here (client side) for a visit:
                        // You'd need to use the Notification API, not Push API.
                        showWelcomeNotification();
                    }
                });
        })
        .catch(function(error) {
            console.error('Service Worker Error', error);
        });
} else {
    console.warn('Push messaging is not supported');
}

function showWelcomeNotification() {
    if (Notification.permission === 'granted') {
        navigator.serviceWorker.ready.then(function(registration) {
            registration.showNotification('Welcome Back!', {
                body: 'Thanks for visiting the Digital Electoral Ballot Poll!',
                icon: 'images/debp-logo.svg', // Use an appropriate icon
                vibrate: [200, 100, 200]
            });
        });
    } else if (Notification.permission !== 'denied') {
        // Request permission if not already granted or denied
        Notification.requestPermission().then(function(permission) {
            if (permission === 'granted') {
                showWelcomeNotification(); // Try showing again if permission was granted
            }
        });
    }
}

function subscribeUser() {
    const applicationServerKey = 'YOUR_PUBLIC_VAPID_KEY_HERE'; // Replace with your actual VAPID key
    const applicationServerKeyB64 = urlBase64ToUint8Array(applicationServerKey);

    navigator.serviceWorker.ready.then(function(registration) {
        registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: applicationServerKeyB64
        })
        .then(function(subscription) {
            console.log('User is subscribed:', subscription);
            // Send the subscription object to your server
            // to store it for sending future push notifications.
            // fetch('/subscribe', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json'
            //     },
            //     body: JSON.stringify(subscription)
            // });
        })
        .catch(function(err) {
            console.log('Failed to subscribe the user: ', err);
        });
    });
}

// Utility function to convert VAPID key
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

