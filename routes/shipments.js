"use strict";

const express = require("express");
const router = new express.Router();
const jsonschema = require("jsonschema");
const { shipProduct } = require("../shipItApi");

const orderSchema = require("../schema/order.json");
const { BadRequestError } = require("../expressError");
/** POST /ship
 *
 * VShips an order coming from json body:
 *   { productId, name, addr, zip }
 *
 * Returns { shipped: shipId }
 */

router.post("/", async function (req, res, next) {
    try {
      const result = jsonschema.validate(req.body, orderSchema)
      if (!result.valid) {
        let errs = result.errors.map(err => err.stack);
        return next(new BadRequestError(errs))
      }
    const { productId, name, addr, zip } = req.body;
    const shipId = await shipProduct({ productId, name, addr, zip });
    return res.json({ shipped: shipId });
  } catch (err) {
    return next(err);
  }
});


module.exports = router;