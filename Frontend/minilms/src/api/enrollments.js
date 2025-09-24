import { api } from "./client";

export const enrollCourse = (courseId) =>
  api.post(`/enrollments/enroll/${courseId}`);

export const getStudentEnrollments = (userId, page = 1, pageSize = 10) =>
  api.get(`/enrollments/student/${userId}`, { params: { page, pageSize } });

export const getAdminEnrollments = ({ search, userId, courseId, page = 1, pageSize = 10 } = {}) =>
  api.get(`/enrollments/admin`, { params: { search, userId, courseId, page, pageSize } });

export const updateProgress = (id, progress) =>
  api.put(`/enrollments/${id}/progress`, progress, {
    headers: { "Content-Type": "application/json" },
  });

// --- NEW: admin edit + delete ---
export const adminUpdateEnrollment = (id, progress) =>
  api.put(`/enrollments/${id}/admin`, progress, {
    headers: { "Content-Type": "application/json" },
  });

export const adminDeleteEnrollment = (id) =>
  api.delete(`/enrollments/${id}`);
