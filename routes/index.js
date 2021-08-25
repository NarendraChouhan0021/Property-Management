const router = require("express").Router();
const {
  getPropertyList, addProperty, getPropertyDetails
} = require("../controller/property.controller");

router.route("/property").get(getPropertyList).post(addProperty);

router.route("/property/:properties_id").get(getPropertyDetails);

module.exports = router;
