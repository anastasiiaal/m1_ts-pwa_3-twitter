import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching"
import { registerRoute } from "workbox-routing"
import { NetworkFirst } from "workbox-strategies"

importScripts('/idb.js')

import { openDB } from "idb"

cleanupOutdatedCaches()
precacheAndRoute(...self.__WB_MANIFEST);

registerRoute(({request}) => {
    return request.url, request.url.startsWith('http://localhost:8081') && request.method === "GET"
}, new NetworkFirst())

function sendPost(postData) {
    // ... if inserted, we can clean from browser db not to re send again & again
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