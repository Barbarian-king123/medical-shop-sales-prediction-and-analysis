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



exports.getForecast = async (medicineId)=>{

    const medicine = await repo.getMedicine(medicineId);

    if(!medicine){
        throw new Error("Medicine not found");
    }

    const totalStock = await repo.getTotalStock(medicineId);

    const todayDemand = await predictNextDay(medicine.atc_code);

    const forecastResult = await forecast(medicine.atc_code,30);

    const safetyStock = 50;

    const suggestedRestock = Math.max(
        forecastResult.restock_quantity + safetyStock - totalStock,
        0
    );

    return {

        medicineId:medicine.medicine_id,
        medicineName:medicine.name,

        todayDemand,

        forecast:forecastResult.daily_forecast,

        forecastDemand:forecastResult.restock_quantity,

        safetyStock,

        currentStock:totalStock,

        suggestedRestock

    };

};