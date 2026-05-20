const service = require("./certificateService");

const getMyCertificates = async (req, res, next) => {
  try {
    const data = await service.getUserCertificates(req.user._id);
    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

const getCertificateByCode = async (req, res, next) => {
  try {
    const data = await service.getCertificateByCode(req.params.code);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }

    res.status(200).json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMyCertificates,
  getCertificateByCode,
};
