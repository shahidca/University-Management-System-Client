export const ROUTES = {
  HOME: "/",

  AUTH: {
    LOGIN: "/login",
    REGISTER: "/register",
    FORGOT_PASSWORD: "/forgot-password",
    RESET_PASSWORD: "/reset-password",
  },

  STUDENT: {
    DASHBOARD: "/student",
    COURSES: "/student/courses",
    ATTENDANCE: "/student/attendance",
    EXAMS: "/student/exams",
    RESULTS: "/student/results",
    TRANSCRIPT: "/student/transcript",
    FEES: "/student/fees",
    PAYMENTS: "/student/payments",
    NOTIFICATIONS: "/student/notifications",
  },

  INSTRUCTOR: {
    DASHBOARD: "/instructor",
    SECTIONS: "/instructor/sections",
    STUDENTS: "/instructor/students",
    ATTENDANCE: "/instructor/attendance",
    EXAMS: "/instructor/exams",
    RESULTS: "/instructor/results",
  },

  ADMIN: {
    DASHBOARD: "/admin",
    STUDENTS: "/admin/students",
    INSTRUCTORS: "/admin/instructors",
    DEPARTMENTS: "/admin/departments",
    PROGRAMS: "/admin/programs",
    COURSES: "/admin/courses",
    SEMESTERS: "/admin/semesters",
    SECTIONS: "/admin/sections",
    ENROLLMENTS: "/admin/enrollments",
    FEES: "/admin/fees",
    PAYMENTS: "/admin/payments",
    NOTIFICATIONS: "/admin/notifications",
    AUDIT_LOGS: "/admin/audit-logs",
  },
} as const;