// IMPORTS -
const ErrorHandler = require("../utils/errorHandler");
const AsyncErr = require("../middlewares/asyncErr");
const applyModel = require("../models/applyModel");
const petModel = require("../models/petModel");
const sendMail = require("../utils/nodeMailer");

const emailContext = (val, subject, name, petName, petType, status) => {
  var html;

  if (val === 1) {
    html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>PetCare: ${subject}</title>
</head>
<body>
  <p>Dear <b>${name}</b>,</p>

  <p>We'd like to inform you that your pet, <b>${petName}</b>, of type <b>${petType}</b>, has an adoption request!</p>
  <p>Please log in to the platform for more actions.</p>
 

  <p>Best,</p>
  <p><b>PetCare Team</b></p>
</body>
</html>`;

    return html;
  } else {
    html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${subject}</title>
</head>
<body>
  <p>Dear <b>${name}</b>,</p>

  <p>We'd like to inform you that your adoption request has been <b>${status}</b>.</p>
  <p>Please log in to the platform for more actions.</p>
 

  <p>Best,</p>
  <p><b>PetCare Team</b></p>
</body>
</html>`;

    return html;
  }
};

// CREATE AN ADOPTION REQUEST -
exports.createRequest = AsyncErr(async (req, res, next) => {
  const { petId, message } = req.body;

  if (!message) {
    return next(
      new ErrorHandler("Please write a message to the pet owner", 400)
    );
  }

  const pet = await petModel.findById(petId).populate("user", "email name");

  if (!pet) {
    return next(new ErrorHandler("Pet not found", 404));
  }

  const checkReq = await applyModel.findOne({
    $and: [{ adopter: req.user.id }, { pet: pet.id }],
  });

  if (checkReq !== null) {
    return next(
      new ErrorHandler(
        "You can only create one adoption request at a time",
        409
      )
    );
  }

  await applyModel.create({
    adopter: req.user.id,
    message,
    pet: petId,
    petOwner: pet.user.id,
  });

  //  SEND EMAIL TO THE PET OWNER -
  await sendMail({
    email: pet?.user?.email,
    subject: "PetCare: Adoption request",
    html: emailContext(
      1,
      "PetCare: Adoption request",
      pet?.user?.name,
      pet?.petName,
      pet?.petType
    ),
  });

  res.status(201).json({
    success: true,
    message: "Adoption request has been sent",
  });
});

// GET ALL ADOPTION REQUESTS FOR OWNER - Received requests
exports.getOwnerRequests = AsyncErr(async (req, res, next) => {
  const request = await applyModel
    .find({ petOwner: req.user.id })
    .populate("adopter")
    .limit(3);
  res.status(200).json({
    success: true,
    request,
  });
});

// GET ALL ADOPTION REQUESTS FOR ADOPTER - Sent requests
exports.getAdopterRequests = AsyncErr(async (req, res, next) => {
  const request = await applyModel
    .find({ adopter: req.user.id })
    .populate("petOwner")
    .limit(2);
  res.status(200).json({
    success: true,
    request,
  });
});

// UPDATE REQUEST STATUS -
exports.updateReqStatus = AsyncErr(async (req, res, next) => {
  const { status } = req.body;

  if (!status) {
    return next(
      new ErrorHandler("Please specify the status for an action", 400)
    );
  }

  console.log(status);
  const request = await applyModel
    .findOne({ petOwner: req.user.id })
    .populate("adopter", "name email");

  if (!request) {
    return next(new ErrorHandler("Pet not found", 404));
  }

  if (status === "accept") {
    await request.updateOne({ status: "accept" });

    //  SEND EMAIL TO THE ADOPTER -
    await sendMail({
      email: request?.adopter?.email,
      subject: "PetCare: Adoption request update",
      html: emailContext(
        "",
        "PetCare: Adoption request update",
        request?.adopter?.name,
        "",
        "",
        "accepted"
      ),
    });
  }

  if (status === "reject") {
    await request.deleteOne();

    //  SEND EMAIL TO THE ADOPTER -
    await sendMail({
      email: request?.adopter?.email,
      subject: "PetCare: Adoption request update",
      html: emailContext(
        "",
        "PetCare: Adoption request update",
        request?.adopter?.name,
        "",
        "",
        "rejected"
      ),
    });
  }

  res.status(200).json({
    success: true,
    message: "The request has been updated",
  });
});

// DELETE AN APPLIED REQUEST -
exports.deletePetRequest = AsyncErr(async (req, res, next) => {
  const request = await applyModel.findById(req.params.id);

  if (!request) {
    return next(new ErrorHandler("Request not found", 404));
  }

  await request.deleteOne();

  res.status(200).json({
    success: true,
    message: "The request has been deleted",
  });
});
