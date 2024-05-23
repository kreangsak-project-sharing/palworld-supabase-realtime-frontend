"use server";

import { revalidatePath } from "next/cache";

export const restAPI = async (apiurl: string) => {
  // Credentials for Basic Authentication
  const username = process.env.NODE_RCON_USER;
  const password = process.env.NODE_RCON_PASSWORD;

  try {
    // Fetch data from the API endpoint
    const response = await fetch(
      `${process.env.NODE_PALWORLD_APIURL}${apiurl}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Basic ${btoa(`${username}:${password}`)}`, // Basic Auth header
          //   "Content-Type": "application/json", // Specify JSON content type
        },
        // body: JSON.stringify({ message: "Your message here" }), // Convert object to JSON string
      }
    );

    // Check if response is OK
    if (!response.ok) {
      // Throw an error if response is not OK
      throw new Error(`Failed to fetch API: ${response.statusText}`);
    }

    // Parse response body as JSON
    const data = await response.json();
    return data; // Return the fetched data
  } catch (error) {
    // Handle any errors
    console.error("There was a problem with the fetch operation:", error);
    throw error; // Rethrow the error to handle it outside of this function
  }
};

//
//
export const getserverVersion = async () => {
  try {
    const res = await restAPI("info");

    revalidatePath("/");

    return res;
  } catch (error) {
    throw error; // Rethrow any errors
  }
};

//
//
export const getserverSettings = async () => {
  try {
    const res = await restAPI("settings");

    revalidatePath("/");

    return res;
  } catch (error) {
    throw error; // Rethrow any errors
  }
};

export const restartServer = async () => {
  try {
    // Fetch data from the API endpoint
    await fetch(`${process.env.NODE_PALWORLD_APIURL}shutdown`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Basic ${btoa(
          `${process.env.NODE_RCON_USER}:${process.env.NODE_RCON_PASSWORD}`
        )}`, // Basic Auth header
        "Content-Type": "application/json", // Specify JSON content type
      },
      //   body: JSON.stringify({ message: "Your message here" }), // Convert object to JSON string
      body: JSON.stringify({
        waittime: 5,
        message: "Server will restart in 5 seconds.",
      }), // Convert object to JSON string
    });

    return;
  } catch (error) {
    // Handle any errors
    console.error("There was a problem with the fetch operation:", error);
    throw error; // Rethrow the error to handle it outside of this function
  }
};
