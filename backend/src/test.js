const { predictNextDay, forecast } = require("./services/mlService");

async function testML() {

    const tomorrow = await predictNextDay("N02BE");

    console.log("Tomorrow demand:", tomorrow);

    const forecast30 = await forecast("N02BE", 30);

    console.log("Restock quantity:", forecast30.restock_quantity);
}

testML();