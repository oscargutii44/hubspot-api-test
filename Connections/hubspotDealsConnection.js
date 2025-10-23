import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const hubspotDealsAPI = axios.create({
  baseURL: "https://api.hubapi.com/crm/v3/objects/deals",
  headers: {
    Authorization: `Bearer ${process.env.HUBSPOT_ACCESS_TOKEN}`,
    "Content-Type": "application/json",
  },
});

export default hubspotDealsAPI;
