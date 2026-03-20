const db = require("../../config/db");

exports.getDashboardStats = async (user) => {

  const baseQuery = db("sales_master as sm");

  // Role filter (Owner sees all)
  if (user.role !== "Owner") {
    baseQuery.where("sm.user_id", user.user_id);
  }

  // Total Sales
  const totalSales = await baseQuery.clone()
    .sum("sm.total_sale_amount as total")
    .first();

  // Total Bills
  const totalBills = await baseQuery.clone()
    .countDistinct("sm.invoice_id as total")
    .first();

  // Net Profit Calculation
  // Net Profit Calculation
const profitQuery = db("sales_items as si")
  .join("sales_master as sm", "sm.invoice_id", "si.invoice_id")
  .join("stock_batches as sb", "sb.batch_id", "si.batch_id");

if (user.role !== "Owner") {
  profitQuery.where("sm.user_id", user.user_id);
}

const netProfit = await profitQuery
  .select(
    db.raw("SUM((si.unit_price - sb.purchase_price) * si.quantity) as total")
  )
  .first();

  return {
    totalSales: Number(totalSales.total || 0),
    totalCustomers: Number(totalBills.total || 0),
    netProfit: Number(netProfit.total || 0)
  };
};

exports.getAtcDistribution = async (user) => {

  const query = db("sales_items as si")
    .join("sales_master as sm", "sm.invoice_id", "si.invoice_id")
    .join("medicines as m", "m.medicine_id", "si.medicine_id")
    .select(
      "m.atc_code",
      db.raw("SUM(si.line_total) as total_sales"),
      db.raw("SUM(si.quantity) as total_units")
    )
    .groupBy("m.atc_code")
    .orderBy("total_sales", "desc");

  if (user.role !== "Owner") {
    query.where("sm.user_id", user.user_id);
  }

  return query;
};
exports.getWeeklyDayDistribution = async (user) => {
  const subquery = db("sales_items")
    .select("invoice_id")
    .sum("quantity as total_quantity")
    .groupBy("invoice_id")
    .as("si");

  const query = db("sales_master as sm")
    .join(subquery, "si.invoice_id", "sm.invoice_id")
    .select(
      db.raw("TRIM(TO_CHAR(sm.sale_date, 'Day')) as day_name"),
      db.raw("EXTRACT(DOW FROM sm.sale_date) as day_number"),
      db.raw("SUM(sm.total_sale_amount) as total_sales"),
      db.raw("SUM(si.total_quantity) as total_quantity")
    )
    .where("sm.sale_date", ">=", db.raw("NOW() - INTERVAL '7 days'"))
    .groupByRaw("day_name, day_number")
    .orderBy("day_number", "asc");

  if (user.role !== "Owner") {
    query.andWhere("sm.user_id", user.user_id);
  }

  return query;
};