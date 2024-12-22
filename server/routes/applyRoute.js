// IMPORTS -
const express = require("express");
const { createRequest, getAdopterRequests, getOwnerRequests, updateReqStatus, deletePetRequest } = require("../controllers/applyController");
const { isAuthUser, authorizeRoles } = require("../middlewares/auth");
const router = express.Router();

// USER -
router.route("/adopt").post(isAuthUser, authorizeRoles("user"), createRequest);
router.route("/owner/requests").get(isAuthUser, authorizeRoles("user"), getOwnerRequests);
router.route("/adopter/requests").get(isAuthUser, authorizeRoles("user"), getAdopterRequests);
router.route("/owner/request/update").post(isAuthUser, authorizeRoles("user"), updateReqStatus);
router.route("/request/:id").delete(isAuthUser, authorizeRoles("user"), deletePetRequest);

module.exports = router;
  