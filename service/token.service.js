const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const generateToken = (tokenPayload, secret) => {
  return jwt.sign(tokenPayload, secret, { expiresIn: "24h" });
};

const verifyToken = (token, secret) => {
  return jwt.verify(token, secret);
};

function generateTokenWithCrypto() {
  return crypto
    .createHmac("sha256", process.env.USER_VERIFY_HASH)
    .digest("hex");
}

// Verify a token
function verifyTokenWithCrypto(token) {
  const generatedToken = generateTokenWithCrypto();
  return token === generatedToken;
}
module.exports = {
  generateToken,
  verifyToken,
  generateTokenWithCrypto,
  verifyTokenWithCrypto,
};
