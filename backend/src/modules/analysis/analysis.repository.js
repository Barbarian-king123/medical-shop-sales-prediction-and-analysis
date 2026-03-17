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



exports.searchMedicines = async (query)=>{

    return await knex("medicines")
    .whereILike("name",`%${query}%`)
    .orWhereILike("generic_name",`%${query}%`)
    .select(
        "medicine_id",
        "name",
        "generic_name",
        "atc_code"
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