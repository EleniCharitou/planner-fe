const backendUrl =
  import.meta.env.VITE_BACKEND_URL ?? "http://127.0.0.1:8000/api";

if (!backendUrl) {
  throw new Error("VITE_BACKEND_URL is not defined");
}

export default backendUrl;
