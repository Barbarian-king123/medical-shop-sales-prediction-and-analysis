const cron = require("node-cron");
const service = require("./notification.service");

cron.schedule("0 2 * * *", async () => {

    console.log("Running notification cron job");

    await service.checkExpiryNotifications();

    await service.checkLowStockNotifications();

});