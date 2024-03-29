const internModel = require("../models/internModel");
const collegeModel = require("../models/collegeModel");

const isValid = function (value) {
  if (typeof value === "undefined" || value === null) return false;
  if (typeof value === "string" && value.length === 0) return false;
  return true;
};

const isValidRequestBody = function (requestbody) {
  return Object.keys(requestbody).length > 0;
};

//=========================================2 api ==================================================

const createIntern = async function (req, res) {
  try {
    const requestBody = req.body; //reading input
    req.body.collegeName = req.body.collegeName.toLowerCase().trim();

    if (!isValidRequestBody(requestBody)) {
      res.status(400).send({
        status: false,
        message: "Invalid request parameters. Please provide intern details",
      });
      return;
    }

    const { name, email, mobile, collegeName } = requestBody; //Destructuring

    //  mandatory fields validation
    if (!isValid(name)) {
      res
        .status(400)
        .send({ status: false, message: "Intern name is required" });
      return;
    }
    if (!isValid(email)) {
      res
        .status(400)
        .send({ status: false, message: "Intern email is required" });
      return;
    }
    if (!isValid(collegeName)) {
      res
        .status(400)
        .send({ status: false, message: "  intern College name is required" });
      return;
    }

    if (requestBody.email) {
      let validmail = /^\w+([\.-]?\w+)@\w+([\. -]?\w+)(\.\w{2,3})+$/.test(
        requestBody.email
      );
      if (!validmail) {
        return res
          .status(400)
          .send({ status: false, message: "  Enter valid email" });
      }
    }

    const isEmailAlreadyUsed = await internModel.findOne({ email });
    if (isEmailAlreadyUsed) {
      res.status(400).send({
        status: false,
        message: `${email} Email is already used, try different one `,
      });
      return;
    }

    if (!isValid(mobile)) {
      res
        .status(400)
        .send({ status: false, message: "Intern mobile is required" });
      return;
    }

    const validPincode = /^(\+\d{1,3}[- ]?)?\d{6}$/.test(Body.pincode);
    if (!validPincode) {
      return res.status(400).send({ status: false, msg: "Invalid Pincode" });
    }

    const ismobileAlreadyUsed = await internModel.findOne({ mobile });
    if (ismobileAlreadyUsed) {
      res.status(400).send({
        status: false,
        message: `${mobile} mobile is already used, try different one`,
      });
      return;
    }

    // Find college
    const collegenameDetails = await collegeModel.findOne({
      name: collegeName,
      isDeleted: false,
    });
    if (!collegenameDetails) {
      res
        .status(404)
        .send({ status: false, message: "No college exist with this name" });
      return;
    }

    // extract collgeId from college data
    const collegeId = collegenameDetails["_id"];

    // create intern with following keys
    const interndata = { name, email, mobile, collegeId };

    // create intern
    const newIntern = await internModel.create(interndata);
    res.status(201).send({
      status: true,
      message: "New Intern created successfully",
      data: newIntern,
    });
  } catch (error) {
    res.status(500).send({ status: false, msg: error.message });
  }
};

module.exports.createIntern = createIntern;
