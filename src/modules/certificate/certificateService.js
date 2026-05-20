const Certificate = require("./certificateModel");

const createCertificate = async (userId, courseId) => {
  const code = `CERT-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  return await Certificate.create({
    user: userId,
    course: courseId,
    code,
  });
};

module.exports = { createCertificate };
