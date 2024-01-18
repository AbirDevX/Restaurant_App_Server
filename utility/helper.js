function isValidBase64URL(str) {
  try {
    // Convert the string to a Buffer
    const buffer = Buffer.from(str, "base64");

    // Encode the buffer to base64 again and compare
    const isValid = Buffer.from(buffer.toString("base64")) === buffer;

    return isValid;
  } catch (error) {
    return false; // Invalid base64 URL
  }
}
module.exports = { isValidBase64URL };
