// src/environments/environment.ts
export const environment = {
  production: false,
  cloudinary: {
    cloudName: 'dkymvpncv',
    uploadPreset: 'intern_motel_mate',
  },
  apiURL: {
    getTenant: 'http://localhost:5223/api/tenant',
    serviceApi: 'http://localhost:5223/api/service',
  },
};
