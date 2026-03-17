const service = require("./notification.service");

exports.getNotifications = async (req,res) => {

    try{

        const { type } = req.query;

        const notifications =
            await service.getNotifications(type);

        res.json(notifications);

    }catch(err){

        res.status(500).json({
            message:err.message
        });

    }

};



exports.runExpiryCheck = async (req,res) => {

    try{

        await service.checkExpiryNotifications();

        res.json({
            message:"Expiry notifications generated"
        });

    }catch(err){

        res.status(500).json({
            message:err.message
        });

    }

};



exports.runStockCheck = async (req,res) => {

    try{

        await service.checkLowStockNotifications();

        res.json({
            message:"Low stock notifications generated"
        });

    }catch(err){

        res.status(500).json({
            message:err.message
        });

    }

};