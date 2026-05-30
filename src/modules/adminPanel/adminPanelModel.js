const mongoose = require("mongoose");

const adminPanelSchema = new mongoose.Schema(
  {
    siteTitle: {
      type: String,
      default: "Edunext API",
      trim: true,
    },
    isMaintenanceMode: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("AdminPanel", adminPanelSchema);
