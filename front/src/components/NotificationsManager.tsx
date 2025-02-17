import { useState } from "react";
import { urlB64ToUint8Array } from "../utils/serviceKey";
import { getAuthToken } from "../api";
import axios from "axios";

const PUBLIC_PUSH_KEY = "BL6tqu_BJk7GEy2BECyraORLbf-xvzvlPByH1ISt8y80QyVFztayJBgDi8IW-hccjZUGTAx-cwGfjGIY3IqklHA";
const API_BASE_URL = "http://localhost:8081/api/notifications";

export default function NotificationsManager() {
    const [subscribed, setSubscribed] = useState(false);

    // async function testNotification() {
    //     await Notification.requestPermission();
    //     new Notification("Test notification");
    // }

    async function subscribe() {
        const perm = await Notification.requestPermission();

        if (perm === "granted") {
            const serviceWorker: any = await navigator.serviceWorker.ready;
            let subscription = await serviceWorker.pushManager.getSubscription();

            if (subscription == null) {
                subscription = await serviceWorker.pushManager.subscribe({
                    // config de l'abonnement
                    userVisibleOnly: true, // obligatory option 
                    applicationServerKey: urlB64ToUint8Array(PUBLIC_PUSH_KEY)
                });
            }

            console.log("Subscription Data:", JSON.stringify(subscription));

            // send subscription to the backend
            const token = getAuthToken();
            try {
                await axios.post(`${API_BASE_URL}/subscribe`, subscription, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                console.log("✅ Subscription saved to backend.");
                setSubscribed(true);
            } catch (error) {
                console.error("Failed to save subscription:", error);
            }
        }
    }

    return (
        <button
            className="w-64 bg-orange-600 text-white px-4 py-2 rounded-lg shadow hover:bg-orange-500"
            onClick={() => subscribe()}
        >
            {subscribed ? "🔔 Subscribed!" : "Subscribe to Notifications"}
        </button>
    );
}
