import axios from "axios";

export const tradeLongUrl = async (longUrl) => {
  const response = await axios.post("/", {
    longUrl,
  }, {validateStatus: (status) => status === 200});
  return response.data;
};
