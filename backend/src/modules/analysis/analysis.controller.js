const service = require("./analysis.service");


exports.getMedicines = async (req,res)=>{

    try{

        const medicines = await service.getMedicines();

        res.json({
            success:true,
            data:medicines
        });

    }catch(error){

        console.error(error);

        res.status(500).json({
            success:false,
            message:"Failed to load medicines"
        });

    }

};



exports.searchMedicines = async (req,res)=>{

    try{

        const query = req.query.q || "";

        const medicines = await service.searchMedicines(query);

        res.json({
            success:true,
            data:medicines
        });

    }catch(error){

        console.error(error);

        res.status(500).json({
            success:false,
            message:"Search failed"
        });

    }

};



exports.getMedicineAnalysis = async (req,res)=>{

    try{

        const medicineId = parseInt(req.params.id);

        if(!medicineId){

            return res.status(400).json({
                success:false,
                message:"Invalid medicine id"
            });

        }

        const result = await service.getMedicineAnalysis(medicineId);

        res.json({
            success:true,
            data:result
        });

    }catch(error){

        console.error(error);

        res.status(500).json({
            success:false,
            message:error.message
        });

    }

};



exports.getForecast = async (req,res)=>{

    try{

        const { medicineId } = req.body;

        if(!medicineId){

            return res.status(400).json({
                success:false,
                message:"medicineId required"
            });

        }

        const forecast = await service.getForecast(medicineId);

        res.json({
            success:true,
            data:forecast
        });

    }catch(error){

        console.error(error);

        res.status(500).json({
            success:false,
            message:"Forecast failed"
        });

    }

};