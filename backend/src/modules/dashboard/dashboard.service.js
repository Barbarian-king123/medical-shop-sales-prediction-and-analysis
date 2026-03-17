
const repo = require("./dashboard.repository");

exports.getDashboardData = async (user) => {

  const stats = await repo.getDashboardStats(user);
  const atcData = await repo.getAtcDistribution(user);
  const weeklyRaw = await repo.getWeeklyDayDistribution(user);

  // ----------- ATC FORMAT (Pie Chart) -----------
  const totalRevenue = atcData.reduce(
    (sum, item) => sum + Number(item.total_sales),
    0
  );

  const formattedAtcData = atcData.map(item => ({
    atc_code: item.atc_code || "Unknown",
    total_sales: Number(item.total_sales),
    total_units: Number(item.total_units),
    percentage: totalRevenue
      ? Number(((Number(item.total_sales) / totalRevenue) * 100).toFixed(2))
      : 0
  }));

  // ----------- WEEKDAY FORMAT (Bar Graph) -----------
  const daysMap = {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday"
  };

  const resultMap = {};

  weeklyRaw.forEach(item => {
    resultMap[item.day_number] = {
      day_name: item.day_name,
      day_number: Number(item.day_number),
      total_sales: Number(item.total_sales),
      total_quantity: Number(item.total_quantity)
    };
  });

  const completeWeek = [];

  for (let i = 0; i < 7; i++) {
    if (resultMap[i]) {
      completeWeek.push(resultMap[i]);
    } else {
      completeWeek.push({
        day_name: daysMap[i],
        day_number: i,
        total_sales: 0,
        total_quantity: 0
      });
    }
  }

  return {
    stats,
    atcDistribution: formattedAtcData,   // 👈 Pie chart
    weeklyDayDistribution: completeWeek  // 👈 Bar graph
  };
};