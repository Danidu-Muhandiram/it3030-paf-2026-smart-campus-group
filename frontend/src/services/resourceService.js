import axiosInstance from './axios';

// ─── Image Upload ─────────────────────────────────────────────────────────────

export const uploadImage = (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosInstance
        .post('/uploads/image', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        .then((r) => r.data.data.url); // returns "/uploads/filename.ext"
};

// ─── Assets ──────────────────────────────────────────────────────────────────

export const getAllAssets = () =>
    axiosInstance.get('/assets').then((r) => r.data.data);

export const getAssetById = (id) =>
    axiosInstance.get(`/assets/${id}`).then((r) => r.data.data);

export const getDistinctAssetTypes = () =>
    axiosInstance.get('/assets/types').then((r) => r.data.data);

export const createAsset = (payload) =>
    axiosInstance.post('/assets', payload).then((r) => r.data.data);

export const updateAsset = (id, payload) =>
    axiosInstance.put(`/assets/${id}`, payload).then((r) => r.data.data);

export const deleteAsset = (id) =>
    axiosInstance.delete(`/assets/${id}`).then((r) => r.data);

// ─── Locations ───────────────────────────────────────────────────────────────

export const getAllLocations = () =>
    axiosInstance.get('/locations').then((r) => r.data.data);

export const createLocation = (payload) =>
    axiosInstance.post('/locations', payload).then((r) => r.data.data);

export const updateLocation = (id, payload) =>
    axiosInstance.put(`/locations/${id}`, payload).then((r) => r.data.data);

export const deleteLocation = (id) =>
    axiosInstance.delete(`/locations/${id}`).then((r) => r.data);
