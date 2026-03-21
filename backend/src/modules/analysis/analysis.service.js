const repo = require("./analysis.repository");
const { forecast, predictNextDay } = require("../../services/mlService");


exports.getMedicines = async ()=>{

    return await repo.getMedicines();

};



exports.searchMedicines = async (query)=>{

    return await repo.searchMedicines(query);

};



exports.getMedicineAnalysis = async (medicineId)=>{

    const medicine = await repo.getMedicine(medicineId);

    if(!medicine){
        throw new Error("Medicine not found");
    }

    const totalStock = await repo.getTotalStock(medicineId);

    return {

        medicine,
        totalStock

    };

};



exports.getForecast = async (medicineId) => {

    const medicine = await repo.getMedicine(medicineId);

    if (!medicine) {
        throw new Error("Medicine not found");
    }

    const totalStock = await repo.getTotalStock(medicineId);

    const { safety_stock: safetyStock = 0 } =
        await repo.getSafetyStock(medicineId) || {};

    const { lead_time_days: leadTime = 0 } =
        await repo.getLeadTime(medicineId) || {};

    // ✅ NEW: get target stock cycle
    const { target_stock_days: targetDays = 30 } =
        await repo.getTargetStockDays(medicineId) || {};

    // ✅ total forecast horizon
    const totalDays = targetDays + leadTime;

    const forecastResult = await forecast(medicine.atc_code, totalDays);

    const todayDemand = forecastResult.daily_forecast[0]?.predicted_sales || 0;

    // ✅ total demand for cycle + lead time
    const totalDemand = forecastResult.daily_forecast
        .reduce((sum, day) => sum + day.predicted_sales, 0);

    const suggestedRestock = Math.max(
        totalDemand + safetyStock - totalStock,
        0
    );

    return {
        medicineId: medicine.medicine_id,
        medicineName: medicine.name,

        todayDemand,

        forecast: forecastResult.daily_forecast,

        targetDays,   // ✅ NEW
        leadTime,

        totalDemand,

        safetyStock,

        currentStock: totalStock,

        suggestedRestock
    };

};