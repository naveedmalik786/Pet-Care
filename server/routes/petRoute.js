// IMPORTS -
const express = require("express");
const {
 createPet, getUserPets, getAllPets, getSinglePet, updatePet, deletePet
} = require("../controllers/petController");
const router = express.Router();
const { isAuthUser, authorizeRoles } = require("../middlewares/auth");

// PET -
router.route("/create").post(isAuthUser, authorizeRoles("user"), createPet);
router.route("/user/pets").get(isAuthUser, authorizeRoles("user"), getUserPets);
router.route("/user/pet/:id").post(getSinglePet).put(isAuthUser, authorizeRoles("user"), updatePet).delete(isAuthUser, authorizeRoles("user"), deletePet);
router.route("/pets/all").get(getAllPets);

module.exports = router;
