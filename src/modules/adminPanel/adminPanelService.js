const adminPanelRepository = require("./adminPanelRepository");

const calculateGrowth = (current, previous) => {
  const difference = current - previous;

  let percentage = 0;

  if (previous > 0) {
    percentage = Number((((current - previous) / previous) * 100).toFixed(1));
  }

  return {
    difference,
    percentage,
  };
};

const getReports = async () => {
  const currentMonth = adminPanelRepository.getMonthRange();

  const previousMonth = adminPanelRepository.getPreviousMonthRange();

  const [
    totalStudents,
    totalCourses,
    totalSoldCourses,

    currentMonthStudents,
    previousMonthStudents,

    currentMonthCourses,
    previousMonthCourses,

    currentMonthRevenue,
    previousMonthRevenue,
  ] = await Promise.all([
    adminPanelRepository.countStudents(),
    adminPanelRepository.countCourses(),
    adminPanelRepository.countSoldCourses(),

    adminPanelRepository.countStudentsInRange(
      currentMonth.start,
      currentMonth.end,
    ),

    adminPanelRepository.countStudentsInRange(
      previousMonth.start,
      previousMonth.end,
    ),

    adminPanelRepository.countCoursesInRange(
      currentMonth.start,
      currentMonth.end,
    ),

    adminPanelRepository.countCoursesInRange(
      previousMonth.start,
      previousMonth.end,
    ),

    adminPanelRepository.getRevenueInRange(
      currentMonth.start,
      currentMonth.end,
    ),

    adminPanelRepository.getRevenueInRange(
      previousMonth.start,
      previousMonth.end,
    ),
  ]);

  return {
    totalStudents: {
      total: totalStudents,
      thisMonth: currentMonthStudents,
      growth: calculateGrowth(currentMonthStudents, previousMonthStudents),
    },

    totalCourses: {
      total: totalCourses,
      thisMonth: currentMonthCourses,
      growth: calculateGrowth(currentMonthCourses, previousMonthCourses),
    },

    totalSales: {
      total: currentMonthRevenue,
      thisMonth: currentMonthRevenue,
      growth: calculateGrowth(currentMonthRevenue, previousMonthRevenue),
    },

    totalSoldCourses,
  };
};

const getSettings = async () => {
  let settings = await adminPanelRepository.getSettings();

  if (!settings) {
    settings = await adminPanelRepository.createSettings({
      siteTitle: "Edunext API",
      isMaintenanceMode: false,
    });
  }

  return settings;
};

const updateSettings = async (updateData) => {
  const updatedSettings = await adminPanelRepository.updateSettings(updateData);
  return updatedSettings;
};

module.exports = {
  getSettings,
  updateSettings,
  getReports,
};
