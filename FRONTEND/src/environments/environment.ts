// src/environments/environment.ts
export const environment = {
  production: false,
  cloudinary: {
    cloudName: 'dkymvpncv',
    uploadPreset: 'intern_motel_mate',
  },
  apiURL: {
    getTenant: 'http://localhost:5223/api',
    getRoom: 'http://localhost:5223/api',
    getAsset: 'http://localhost:5223/api',
    serviceApi: 'http://localhost:5223/api/service',
  },
};
