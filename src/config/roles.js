// An application depends on what roles it will have.

const allRoles = {
  user: ["common", "user"],
  seller: ["common", "seller", "sellerAdmin"],
  admin: ["common", "commonAdmin", "admin", "sellerAdmin"],
  superAdmin: ["common", "commonAdmin", "superAdmin", "sellerAdmin"],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
