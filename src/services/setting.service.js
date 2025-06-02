const { PrivacyPolicy, AboutUs, SellerAgreement, UserAgreement, TermsAndCondition } = require("../models");

// Privacy Policy
const getPrivacyPolicy = async () => {
  return await PrivacyPolicy.findOne();
};

const upsertPrivacyPolicy = async (content) => {
  let privacy = await PrivacyPolicy.findOne();
  if (privacy) {
    privacy.content = content;
    return privacy.save();
  }
  return PrivacyPolicy.create({ content });
};

// About Us
const getAboutUs = async () => {
  return await AboutUs.findOne();
};

const upsertAboutUs = async (content) => {
  let about = await AboutUs.findOne();
  if (about) {
    about.content = content;
    return about.save();
  }
  return AboutUs.create({ content });
};

// Terms & Conditions (currently using AboutUs model as in your code)
const getTermsAndCondition = async () => {
  return await TermsAndCondition.findOne();
};

const upsertTermsAndCondition = async (content) => {
  let terms = await TermsAndCondition.findOne();
  if (terms) {
    terms.content = content;
    return terms.save();
  }
  return TermsAndCondition.create({ content });
};

// Seller Agreement
const getSellerAgreement = async () => {
  return await SellerAgreement.findOne();
};

const upsertSellerAgreement = async (content) => {
  let agreement = await SellerAgreement.findOne();
  if (agreement) {
    agreement.content = content;
    return agreement.save();
  }
  return SellerAgreement.create({ content });
};

// User Agreement
const getUserAgreement = async () => {
  return await UserAgreement.findOne();

};

const upsertUserAgreement = async (content) => {
  let agreement = await UserAgreement.findOne();
  if (agreement) {
    agreement.content = content;
    return agreement.save();
  }
  return UserAgreement.create({ content });
};

module.exports = {
  getPrivacyPolicy,
  upsertPrivacyPolicy,
  getAboutUs,
  upsertAboutUs,
  getTermsAndCondition,
  upsertTermsAndCondition,
  getSellerAgreement,
  upsertSellerAgreement,
  getUserAgreement,
  upsertUserAgreement,
};
