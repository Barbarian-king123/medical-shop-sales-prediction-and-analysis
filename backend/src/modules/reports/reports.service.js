const AppError = require("../../utils/AppError");
const repo = require("./reports.repository");

exports.getDailySales = async () => {
  return repo.getDailySales();
};

exports.getMonthlySales = async () => {
  return repo.getMonthlySales();
};

exports.getYearlySales = async () => {
  return repo.getYearlySales();
};


exports.getSalesSummary = async (startDate, endDate) => {
  if (!startDate || !endDate) {
    throw new AppError("startDate and endDate are required", 400);
  }

  // Validate format
  if (isNaN(Date.parse(startDate)) || isNaN(Date.parse(endDate))) {
    throw new AppError("Invalid date format. Use YYYY-MM-DD", 400);
  }

  const result = await repo.getSalesSummary(startDate, endDate);

  return result[0] || {};
};




exports.getGenericWiseSales = async (startDate, endDate) => {
  if (!startDate || !endDate) {
    throw new AppError("startDate and endDate are required", 400);
  }

  return repo.getGenericWiseSales(startDate, endDate);
};