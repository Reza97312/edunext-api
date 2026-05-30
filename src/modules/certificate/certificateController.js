const service = require("./certificateService");

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
  getCertificateByCode,
};
