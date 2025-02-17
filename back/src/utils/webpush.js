const webpush = require('web-push');
const NotificationSubscription = require("../models/NotificationSubscription");
const { Op } = require("sequelize");

webpush.setVapidDetails(
    'mailto:lalala@gmail.com',
    process.env.NOTIF_PUBLIC_KEY,
    process.env.NOTIF_PRIVATE_KEY
)

async function sendNotifications(authorId, notificationData) {
    console.log(`Sending notifications to all subscribers (excluding user ${authorId})...`);

    // fetch all subscriptions EXCEPT author's
    const subscriptions = await NotificationSubscription.findAll({
        where: {
            userId: { 
                [Op.ne]: authorId // exclude the author
            }
        }
    });

    if (subscriptions.length === 0) {
        console.warn("⚠️ No active subscriptions found.");
        return;
    }

    // send notification to every subscribed user
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