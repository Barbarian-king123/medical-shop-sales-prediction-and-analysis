const asyncHandler = require("../../utils/asyncHandler");
const service = require("./reports.service");

// exports.dailySales = asyncHandler(async (req, res) => {
//   const data = await service.getDailySales();
//   res.status(200).json({ status: "success", data });
// });

// exports.monthlySales = asyncHandler(async (req, res) => {
//   const data = await service.getMonthlySales();
//   res.status(200).json({ status: "success", data });
// });

// exports.yearlySales = asyncHandler(async (req, res) => {
//   const data = await service.getYearlySales();
//   res.status(200).json({ status: "success", data });
// });


exports.salesSummary = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const data = await service.getSalesSummary(
    startDate,
    endDate
  );

  res.status(200).json({
    status: "success",
    dateRange: {
      startDate,
      endDate,
    },
    data: {
      totalBills: Number(data.total_bills || 0),
      totalSales: Number(data.total_sales || 0),
      gstCollected: Number(data.gst_collected || 0),
      netProfit: Number(data.net_profit || 0),
    }
  });
});

exports.genericWiseSales = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const data = await service.getGenericWiseSales(
    startDate,
    endDate
  );

  res.status(200).json({
    status: "success",
    dateRange: {
      startDate,
      endDate,
    },
    results: data.length,
    data,
  });
});