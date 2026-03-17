const db = require("../../config/db");

exports.getDailySales = async () => {
  return db("sales_master")
    .select(
      db.raw("DATE(sale_date) as date"),
      db.raw("SUM(total_sale_amount) as total_sales")
    )
    .groupByRaw("DATE(sale_date)")
    .orderBy("date", "desc");
};

exports.getMonthlySales = async () => {
  return db("sales_master")
    .select(
      db.raw("TO_CHAR(sale_date, 'YYYY-MM') as month"),
      db.raw("SUM(total_sale_amount) as total_sales")
    )
    .groupBy("month")
    .orderBy("month", "desc");
};

exports.getYearlySales = async () => {
  return db("sales_master")
    .select(
      db.raw("EXTRACT(YEAR FROM sale_date) as year"),
      db.raw("SUM(total_sale_amount) as total_sales")
    )
    .groupBy("year")
    .orderBy("year", "desc");
};
exports.getSalesSummary = async (startDate, endDate) => {
  return db("sales_master as sm")
    .select(

      db.raw(`
        COUNT(sm.invoice_id) as total_bills
      `),

      db.raw(`
        COALESCE(SUM(sm.total_sale_amount), 0) as total_sales
      `),

      db.raw(`
        COALESCE(SUM(sm.total_gst_amount), 0) as gst_collected
      `),

      db.raw(`
        (
          SELECT COALESCE(
            SUM((si.unit_price - sb.purchase_price) * si.quantity),
            0
          )
          FROM sales_items si
          JOIN stock_batches sb ON sb.batch_id = si.batch_id
          JOIN sales_master sm2 ON sm2.invoice_id = si.invoice_id
          WHERE sm2.sale_date BETWEEN ? AND ?
        ) as net_profit
      `, [
        `${startDate} 00:00:00`,
        `${endDate} 23:59:59`
      ])

    )
    .whereBetween("sm.sale_date", [
      `${startDate} 00:00:00`,
      `${endDate} 23:59:59`
    ]);
};
exports.getGenericWiseSales = async (startDate, endDate) => {
  const query = db("sales_items as si")
    .join("sales_master as sm", "sm.invoice_id", "si.invoice_id")
    .join("medicines as m", "m.medicine_id", "si.medicine_id")
    .join("stock_batches as sb", "sb.batch_id", "si.batch_id")
    .select(
      "m.generic_name",
      db.raw("SUM(si.quantity) as total_units_sold"),
      db.raw("SUM(si.line_total) as total_sales"),
      db.raw("SUM(si.gst_amount) as total_gst"),
      db.raw(`
        SUM(
          COALESCE((si.unit_price - sb.purchase_price) * si.quantity, 0)
        ) as net_profit
      `)
    )
    .groupBy("m.generic_name")
    .orderBy("total_sales", "desc");

  if (startDate && endDate) {
    query.whereBetween("sm.sale_date", [
      `${startDate} 00:00:00`,
      `${endDate} 23:59:59`
    ]);
  }

  return query;
};