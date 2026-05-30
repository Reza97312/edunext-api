const Certificate = require("./certificateModel");

const createCertificate = async (userId, courseId) => {
  const exists = await Certificate.findOne({ user: userId, course: courseId });
  if (exists) {
    return exists;
  }

  const code = `CERT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  return await Certificate.create({
    user: userId,
    course: courseId,
    code,
  });
};

const getCertificateByCode = async (code) => {
  return await Certificate.findOne({ code })
    .populate("user", "name email profileImage")
    .populate("course", "title courseImage price");
};

module.exports = {
  createCertificate,
  getCertificateByCode,
};
