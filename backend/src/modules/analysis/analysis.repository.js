const knex = require("../../config/db");


exports.getMedicines = async ()=>{

    return await knex("medicines as m")
    .leftJoin("stock_batches as sb","m.medicine_id","sb.medicine_id")
    .select(
        "m.medicine_id",
        "m.name",
        "m.generic_name",
        "m.atc_code"
    )
    .sum({total_stock:"sb.quantity"})
    .groupBy("m.medicine_id")
    .orderBy("m.name");

};



exports.searchMedicines = async (query) => {

  return await knex("medicines as m")
    .leftJoin("stock_batches as sb", "m.medicine_id", "sb.medicine_id")

    .where(function () {
      this.whereILike("m.name", `%${query}%`)
          .orWhereILike("m.generic_name", `%${query}%`);
    })

    .groupBy(
      "m.medicine_id",
      "m.name",
      "m.generic_name",
      "m.atc_code"
    )

    .select(
      "m.medicine_id",
      "m.name",
      "m.generic_name",
      "m.atc_code",
      knex.raw("COALESCE(SUM(sb.quantity), 0) as total_stock") // ✅ FIX
    )

    .limit(20);

};


exports.getMedicine = async (medicineId)=>{

    return await knex("medicines")
    .where({medicine_id:medicineId})
    .first();

};



exports.getTotalStock = async (medicineId)=>{

    const result = await knex("stock_batches")
    .where("medicine_id",medicineId)
    .sum({total:"quantity"})
    .first();

    return parseInt(result.total || 0);

};

exports.getSafetyStock = async (medicineId) => {

  return await knex("medicines")
    .where("medicine_id", medicineId)
    .select("safety_stock")
    .first();  // 👈 returns single object

};
exports.getLeadTime = async (medicineId) => {

  return await knex("medicine_suppliers")
    .where({
      medicine_id: medicineId,
      is_primary: true
    })
    .select("lead_time_days")
    .first();

};
exports.getTargetStockDays = async (medicineId) => {

  return await knex("medicines")
    .where("medicine_id", medicineId)
    .select("target_stock_days")
    .first();

};