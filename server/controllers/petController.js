// IMPORTS -
const ErrorHandler = require("../utils/errorHandler");
const AsyncErr = require("../middlewares/asyncErr");
const petModel = require("../models/petModel");
const cloudinary = require("cloudinary");

// CREATE A PET -
exports.createPet = AsyncErr(async (req, res, next) => {
  console.log(req.body);
  const {
    petName,
    profile,
    petType,
    petBreed,
    petGender,
    petAge,
    petPrecautions,
    petInterests,
    ownerMessage,
    startDate,
    endDate,
    availableForBorrow,
  } = req.body;


  console.log(
    petName,
    profile,
    petType,
    petBreed,
    petGender,
    petAge,
    petPrecautions,
    availableForBorrow
  );

  if (
    !petName ||
    !profile ||
    !petType ||
    !petBreed ||
    !petGender ||
    !petAge ||
    !petPrecautions ||
    !availableForBorrow
  ) {
    return next(new ErrorHandler("Please fill all the fields", 400));
  }

  // CLOUDINARY
  const myCloud = await cloudinary.v2.uploader.upload(profile, {
    folder: "Pets Profile",
    width: 150,
    crop: "scale",
  });

  const pet = await petModel.create({
    petName,
    profile: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
    petType,
    petBreed,
    petGender,
    petAge,
    petInterests: req.body.petInterests || undefined,
    petPrecautions,
    availableForBorrow,
    user: req.user.id,
    startDate: req.body.startDate || undefined,
    endDate: req.body.endDate || undefined,
    ownerMessage: req.body.ownerMessage || undefined,
  });

  res.status(201).json({
    success: true,
    pet,
  });
});

// GET ALL USER PETS -
exports.getUserPets = AsyncErr(async (req, res) => {
  const pets = await petModel.find({ user: req.user.id });

  res.status(200).json({
    success: true,
    pets,
  });
});

// GET SINGLE PET -
exports.getSinglePet = AsyncErr(async (req, res, next) => {
  const pet = await petModel.findById(req.params.id);

  if (!pet) {
    return next(new ErrorHandler("Pet not found", 404));
  }

  res.status(200).json({
    success: true,
    pet,
  });
});

// GET ALL PETS -
exports.getAllPets = AsyncErr(async (req, res) => {
  const pets = await petModel.find({ availableForBorrow: { $in: [true] } });

  res.status(200).json({
    success: true,
    pets,
  });
});

// UPDATE A PET -
exports.updatePet = AsyncErr(async (req, res, next) => {
  const newPetData = {
    petName: req.body.petName,
    petType: req.body.petType,
    petBreed: req.body.petBreed,
    petGender: req.body.petGender,
    petAge: req.body.petAge,
    petInterests: req.body.petInterests,
    petPrecautions: req.body.petPrecautions,
    availableForBorrow: req.body.availableForBorrow,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    ownerMessage: req.body.ownerMessage,
  };

  let pet = await petModel.findById(req.params.id);

  if (!pet) {
    return next(new ErrorHandler("Pet not found", 404));
  }

  if (req.body.profile !== undefined) {
    const imageID = pet.profile.public_id;
    await cloudinary.v2.uploader.destroy(imageID);

    const myCloud = await cloudinary.v2.uploader.upload(req.body.profile, {
      folder: "Pets Profile",
      width: 150,
      crop: "scale",
    });

    newPetData.profile = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  await pet.updateOne(newPetData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    message: "Pet updated successfully",
  });
});

// DELETE A PET -
exports.deletePet = AsyncErr(async (req, res, next) => {
  const pet = await petModel.findById(req.params.id);

  if (!pet) {
    return next(new ErrorHandler("Pet not found", 404));
  }

  await pet.deleteOne();

  res.status(200).json({
    success: true,
    message: "Pet deleted successfully",
  });
});
