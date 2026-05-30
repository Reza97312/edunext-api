const landingRepository = require("./landingRepository");

const getLandingReports = async () => {
  const [courses, teachers, students] = await Promise.all([
    landingRepository.countCourses(),
    landingRepository.countTeachers(),
    landingRepository.countStudents(),
  ]);

  return {
    totalCourses: courses,
    totalTeachers: teachers,
    totalStudents: students,
  };
};

module.exports = {
  getLandingReports,
};
