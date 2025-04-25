import axios from "axios";

const API_URL = "https://cloud-project-test-main-3.onrender.com/api";

export const getStations = async () => {
  const response = await axios.get(`${API_URL}/stations/`);
  return response.data;
};
