// services/createContact.js
import hubspotConnection from "../hubspotConnection.js";

export async function createContact(contactData) {
  try {
    const response = await hubspotConnection.post("/crm/v3/objects/contacts", {
      properties: contactData,
    });

    return { success: true, contact: response.data };
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || error.message,
    };
  }
}
