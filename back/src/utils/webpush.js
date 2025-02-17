const webpush = require('web-push');
const NotificationSubscription = require("../models/NotificationSubscription");

webpush.setVapidDetails(
    'mailto:lalala@gmail.com',
    process.env.NOTIF_PUBLIC_KEY,
    process.env.NOTIF_PRIVATE_KEY
)

async function sendNotifications(userId, notificationData) {
    if (!userId) {
        console.error("Error: userId is undefined in sendNotifications");
        return;
    }

    const subscriptions = await NotificationSubscription.findAll({
        where: { userId }
    });

    if (subscriptions.length === 0) {
        console.warn("No subscriptions found for user:", userId);
        return;
    }

    for (const subscription of subscriptions) {
        try {
            await webpush.sendNotification(
                {
                    endpoint: subscription.endpoint,
                    keys: {
                        p256dh: subscription.p256dh,
                        auth: subscription.auth
                    }
                },
                JSON.stringify(notificationData)
            );
            console.log("✅ Notification sent to:", subscription.endpoint);
        } catch (error) {
            if (error.statusCode === 404 || error.statusCode === 410) {
                console.warn("Subscription is no longer valid. Deleting...");
                await subscription.destroy();
            } else {
                console.error("Error sending notification:", error);
            }
        }
    }
}

module.exports = { sendNotifications };