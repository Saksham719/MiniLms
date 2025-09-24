import { api } from "./client";

export const listMaterials = (courseId) =>
  api.get(`/courses/${courseId}/materials`);

export const addUrlMaterial = (courseId, { title, url }) =>
  api.post(`/courses/${courseId}/materials/url`, { title, url });

export const uploadFileMaterial = (courseId, { title, file }) => {
  const fd = new FormData();
  fd.append("title", title);
  fd.append("file", file);
  return api.post(`/courses/${courseId}/materials/file`, fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteMaterial = (id) =>
  api.delete(`/materials/${id}`);
