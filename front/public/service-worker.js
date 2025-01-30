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

import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching"
import { registerRoute } from "workbox-routing"
import { NetworkFirst } from "workbox-strategies"

// importScripts('/idb.js')

import { openDB } from "idb"

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

function sendPost(postData) {
    // ... @TODO
    // if inserted, we can clean from browser db not to re send again & again
    console.log(postData);
}

self.addEventListener('sync', function (event) {
    console.log("received a sync event: ", event.tag);
    if (event.tag === 'sync-new-posts') {
        // implement logic
        event.waitUntil(
            openDB('offline-sync', 1).then(function(db) {
                return db.getAll('posts').then(function(posts) {
                    // pour chacun faire un petch
                    for (const post in posts) {
                        sendPost(post)
                    }
                })
            })
        )
    }
})


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
            fetch(event.request).catch(function(error) {
                return caches.open(APP_SHELL_CACHE).then(function(cache) {
                    return cache.match("/placeholder.gif").then(function(cachedResponse) {
                        if (cachedResponse) {
                            return cachedResponse
                        } else {
                            console.error("Couldn't fetch placeholder")
                        }
                    })
                })
            })
        );
    }   
})