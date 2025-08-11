const backendUrl = import.meta.env.REACT_APP_BACKEND_UR ?? "http://127.0.0.1:8000/api";


if (!backendUrl) {
  throw new Error("REACT_APP_BACKEND_UR is not defined");
}

export default backendUrl;
