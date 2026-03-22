const cron = require("node-cron");
const service = require("./notification.service");

// ⏰ Runs every day at 2:00 AM
cron.schedule("0 2 * * *", async () => {

    console.log("🕑 Notification cron job started at:", new Date());

    try {

        // 🔥 Run both checks
        await service.checkExpiryNotifications();
        await service.checkLowStockNotifications();

        console.log("✅ Notification cron job completed successfully");

    } catch (err) {

        console.error("❌ Cron job failed:", err.message);

    }

}, {
    scheduled: true,
    timezone: "Asia/Kolkata" // ✅ IMPORTANT for India
});