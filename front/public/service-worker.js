import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { NetworkFirst } from "workbox-strategies";
import { openDB } from "idb";

const APP_SHELL_CACHE = "app-shell"
const SHELL_FILES = [
    "/",
    "https://unpkg.com/@tailwindcss/browser@4",
    "/manifest.json",
    "/vite.svg",
    "/placeholder.gif"
]

self.addEventListener('install', function(event) {
    console.log("Installed");

    // caches - objet global dispo sur service workers
    event.waitUntil(
        caches.open(APP_SHELL_CACHE).then(async (cache) => {
            await cache.addAll(SHELL_FILES);
        })
    );
})

self.addEventListener('activate', function(event) {
    console.log("Activated");
})


cleanupOutdatedCaches()
// precacheAndRoute(...self.__WB_MANIFEST);
precacheAndRoute([
    ...self.__WB_MANIFEST,
    {"revision": null, "url":"/"},
    {"revision": null, "url":"placeholder.gif"}
]);

registerRoute(({request}) => {
    return request.url, request.url.startsWith('http://localhost:8081') && request.method === "GET"
}, new NetworkFirst())

async function sendPost(post) {
    try {
        const response = await fetch("http://localhost:8081/api/posts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${post.token}`,
            },
            body: JSON.stringify({
                text: post.text,
                image: post.image,
                createdAt: post.createdAt,
            }),
        });

        if (response.ok) {
            console.log("✅ Post successfully sent:", post);
            return true;
        } else {
            console.error("Failed to send post:", response.status);
            return false;
        }
    } catch (error) {
        console.error("Network error while sending post:", error);
        return false;
    }
}

self.addEventListener('sync', function (event) {
    console.log("received a sync event: ", event.tag);
    if (event.tag === 'sync-new-posts') {
        event.waitUntil(
            openDB('offline-sync', 1).then(async function (db) {
                // get only the IDs (== keys) of the stored posts
                const keys = await db.getAllKeys("posts");

                // pour chacun faire un petch
                for (const key of keys) {
                    const post = await db.get("posts", key);
                    if (!post) continue; // skip if post doesn't exist == already deleted

                    const success = await sendPost(post);
                    if (success) {
                        await db.delete("posts", key); // remove post after successful sync
                        console.log("Post deleted from IndexedDB:", key);
                    }
                }
            })
        );
    }
});


const APP_ROOT = "http://localhost:5173";
self.addEventListener('fetch', function(event) {
    if (SHELL_FILES.includes(event.request.url.replace(APP_ROOT, ''))) {
        event.respondWith(
            caches.open(APP_SHELL_CACHE).then(function(cache) {
                return cache.match(event.request).then(function(cachedResult) {
                    if (cachedResult) {
                        // console.log("Returned " + event.request.url + " from cache");
                        return cachedResult;
                    } else {
                        console.log("Couldn't get " + event.request.url + " from cache");
                    }
                })
            })
        )
    } 
    else if (event.request.url.startsWith("https://img.freepik.com/")) {
        event.respondWith(
            fetch(event.request).catch(function() {
                return caches.open(APP_SHELL_CACHE).then(function(cache) {
                    return cache.match("/placeholder.gif");
                })
            })
        );
    }
})

// le truc bonus pour fetch à une période
// self.addEventListener('activate', (event) => {
//     if(self.redistration.periodsync) {
//         event.waitUntil
//     }
// })


self.addEventListener("push", (event) => {
    console.log("Data reçu de l'event :", event);

    if (!event.data) {
        console.warn("No data in push event.");
        return;
    }

    const notificationData = event.data.json();
    console.log("Notification data:", notificationData);

    const title = notificationData.title || "New notification";
    const options = {
        body: notificationData.body || "You have a new message.",
        icon: "/icons/icon_144.png",
        badge: "/icons/icon_144.png",
        vibrate: [200, 100, 200],
        actions: [
            { action: "open", title: "View" },
            { action: "close", title: "Dismiss" }
        ]
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

// handle notification click
self.addEventListener("notificationclick", (event) => {
    console.log("🔔 Notification clicked:", event.notification);

    event.notification.close();

    if (event.action === "open") {
        clients.openWindow("/");
    }
});
