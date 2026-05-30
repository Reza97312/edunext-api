const landingService = require("./landingService");

const getLandingReports = async (req, res, next) => {
  try {
    const data = await landingService.getLandingReports();

    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getLandingReports,
};
