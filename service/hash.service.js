const bcrypt = require("bcrypt");

const generateHash = async (plainTxt, salt) => {
  const saltRounds = salt || 10;
  return await bcrypt.hash(plainTxt?.toString(), saltRounds);
};

const compareHash = async (plainTxt, hashPassword) => {
  return await bcrypt.compare(plainTxt?.toString(), hashPassword?.toString());
};
module.exports = { generateHash, compareHash };
