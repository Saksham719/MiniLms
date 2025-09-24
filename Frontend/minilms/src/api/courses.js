// src/api/courses.js
import { api } from "./client";

export const getCourses = (params) =>
  api.get("/courses", { params }); // {search, category, level, page, pageSize}

export const getCourse = (id) => api.get(`/courses/${id}`);

export const createCourse = (payload) => api.post("/courses", payload); // admin
export const updateCourse = (id, payload) => api.put(`/courses/${id}`, payload); // admin
export const deleteCourse = (id) => api.delete(`/courses/${id}`); // admin
