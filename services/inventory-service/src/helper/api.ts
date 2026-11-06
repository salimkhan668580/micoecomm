import axios from "axios";

const api = axios.create();

api.interceptors.request.use((config) => {
  const apiKey = process.env.ISC_API_KEY;
  if (!apiKey) {
    throw new Error("ISC_API_KEY is not defined in the environment variables");
  }

  config.headers.set("x-api-key", apiKey);
  return config;
});

export default api;