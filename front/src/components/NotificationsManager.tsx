import { useState, useEffect } from "react";
import { urlB64ToUint8Array } from "../utils/serviceKey";
import { subscribeToNotifications, unsubscribeFromNotifications, isUserSubscribed } from "../api";

const PUBLIC_PUSH_KEY = "BL6tqu_BJk7GEy2BECyraORLbf-xvzvlPByH1ISt8y80QyVFztayJBgDi8IW-hccjZUGTAx-cwGfjGIY3IqklHA";

export default function NotificationsManager() {
    const [subscribed, setSubscribed] = useState<boolean | null>(null);

    // check if user is subscribed on mount
    useEffect(() => {
        async function checkSubscription() {
            const alreadySubscribed = await isUserSubscribed();
            setSubscribed(alreadySubscribed);
        }
        checkSubscription();
    }, []);

    async function toggleSubscription() {
        if (subscribed) {
            await unsubscribe();
        } else {
            await subscribe();
        }
    }

    async function subscribe() {
        const perm = await Notification.requestPermission();

        if (perm === "granted") {
            const serviceWorker: any = await navigator.serviceWorker.ready;
            let subscription = await serviceWorker.pushManager.getSubscription();

            if (!subscription) {
                subscription = await serviceWorker.pushManager.subscribe({
                    userVisibleOnly: true,
                    applicationServerKey: urlB64ToUint8Array(PUBLIC_PUSH_KEY),
                });
            }

            console.log("Subscription Data:", JSON.stringify(subscription));

            const success = await subscribeToNotifications(subscription);
            if (success) setSubscribed(true);
        }
    }

    async function unsubscribe() {
        const serviceWorker: any = await navigator.serviceWorker.ready;
        const subscription = await serviceWorker.pushManager.getSubscription();

        if (subscription) {
            const success = await unsubscribeFromNotifications(subscription.endpoint);
            if (success) {
                await subscription.unsubscribe();
                setSubscribed(false);
            }
        }
    }

    if (subscribed === null) {
        return <p className="text-gray-500">Checking subscription status...</p>;
    }

    return (
        <button
            className="w-64 bg-orange-600 text-white px-4 py-2 rounded-lg shadow hover:bg-orange-500"
            onClick={toggleSubscription}
        >
            {subscribed ? "🔕 Unsubscribe" : "🔔 Subscribe to notifications"}
        </button>
    );
}
