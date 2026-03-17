const router = require("express").Router();
const controller = require("./analysis.controller");

/*
Load medicines list
*/
router.get("/medicines", controller.getMedicines);

/*
Search medicines
*/
router.get("/search", controller.searchMedicines);

/*
Load analysis page data
*/
router.get("/medicine/:id", controller.getMedicineAnalysis);

/*
Run ML forecast
*/
router.post("/forecast", controller.getForecast);

module.exports = router;