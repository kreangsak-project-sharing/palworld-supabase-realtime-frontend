"use server";

// For getFileList
import fs from "fs";
import path from "path";
import moment from "moment-timezone";

// Public IP
import { publicIpv4 } from "public-ip";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
const supabase = createClient(
  process.env.NODE_SUPABASE_URL!,
  process.env.NODE_SUPABASE_SERVICE_KEY!
  // process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

//
//
// Function selectSystemInfo
export const selectSystemInfo = async () => {
  let realtime_systeminfo: any[] | undefined;
  let error: any;
  try {
    let { data, error: fetchError } = await supabase
      .from("realtime_systeminfo")
      .select("*");

    if (fetchError) {
      console.error(fetchError);
      error = fetchError;
    } else {
      realtime_systeminfo = data || [];
    }
  } catch (err) {
    console.error(err);
    error = err;
  }

  // Trigger revalidation outside of the try-catch block
  // Cannot build if inside try-catch
  revalidatePath("/");

  return { realtime_systeminfo, error };
};

// //
// //
// // Function selectSystemInfo
// export const selectPlayersOnline = async () => {
//   try {
//     let { data: realtime_playersonline, error } = await supabase
//       .from("realtime_playersonline")
//       .select("player_data")
//       .eq("id", 1);
//     if (error) {
//       console.error(error);
//       return;
//     } else {
//       return { realtime_playersonline };
//     }
//   } catch (err) {
//     console.error(err);
//   }

//   revalidatePath("/");
// };

//
//
// Function selectSystemInfo
export const selectPlayersOnline = async () => {
  let realtime_playersonline: any[] | undefined;
  let error: any;

  try {
    const { data, error: fetchError } = await supabase
      .from("realtime_playersonline")
      .select("*");
    // .eq("id", 1);

    if (fetchError) {
      console.error(fetchError);
      error = fetchError;
    } else {
      realtime_playersonline = data || [];
    }
  } catch (err) {
    console.error(err);
    error = err;
  }

  // Trigger revalidation outside of the try-catch block
  // Cannot build if inside try-catch
  revalidatePath("/");

  return { realtime_playersonline, error };
};

//
//
// Function selectSystemInfo
export const selectMetrics = async () => {
  let realtime_metrics: any[] | undefined;
  let error: any;

  try {
    let { data, error: fetchError } = await supabase
      .from("realtime_metrics")
      .select("*");
    // .eq("id", 1);

    if (fetchError) {
      console.error(fetchError);
      error = fetchError;
    } else {
      // revalidatePath("/");
      realtime_metrics = data || [];
    }
  } catch (err) {
    console.error(err);
    error = err;
  }

  // Trigger revalidation outside of the try-catch block
  // Cannot build if inside try-catch
  revalidatePath("/");

  return { realtime_metrics, error };
};

//
//
// Function selectSystemInfo
export const selectLoginRecord = async () => {
  let realtime_loginrecord: any[] | undefined;
  let error: any;

  try {
    let { data, error: fetchError } = await supabase
      .from("realtime_loginrecord")
      .select("*")
      .order("created_at", { ascending: false }) // Order by created_at in descending order (latest first)
      .limit(5); // Limit to 5 records
    // .eq("id", 1);

    if (fetchError) {
      console.error(fetchError);
      error = fetchError;
    } else {
      realtime_loginrecord = data || [];
    }
  } catch (err) {
    console.error(err);
    error = err;
  }

  // Trigger revalidation outside of the try-catch block
  // Cannot build if inside try-catch
  revalidatePath("/");

  return { realtime_loginrecord, error };
};

//
//
// Function supabaseInsertRcon
interface updateType {
  cputemp: number;
  cpuuse: number;
  ramuse: number;
}

export const supabaseUpdate = async ({
  cputemp,
  cpuuse,
  ramuse,
}: updateType) => {
  try {
    const { error } = await supabase
      .from("realtime-systeminfo")
      .update({ cpu_temp: cputemp, cpu_use: cpuuse, ram_use: ramuse })
      .eq("id", 1);
    if (error) {
      console.error(error);
    }
  } catch (err) {
    console.error(err);
  }
};

//
//
// Function supabaseInsertRcon
export const supabaseInsertRcon = async (data: any) => {
  try {
    const { error } = await supabase
      .from("palworld")
      .insert({ rconAPICall: data });
    if (error) {
      console.error(error);
    }
  } catch (err) {
    console.error(err);
  }
};

//
//
// Function to retrieve list of files in a directory
export const getFileList = async () => {
  const directoryPath = "./palworldbackups";

  try {
    const files = await fs.promises.readdir(directoryPath);

    // Get last modified time for each file
    const fileListWithTime = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(directoryPath, file);
        const stats = await fs.promises.stat(filePath);
        return {
          name: file,
          lastModified: moment
            .utc(stats.mtime)
            .tz("Asia/Bangkok")
            .format("MMM DD, YYYY, h:mm A"), // Last modified time
        };
      })
    );

    return { fileListWithTime };
  } catch (error) {
    console.error("Error getting file list:", error); // Log the error
    return false;
  }
};

//
//
// Function to download a file from a URL and save it to a destination folder
export const downloadFile = async (filename: string) => {
  const directoryPath = "./palworldbackups"; // Directory where files are stored
  const filePath = path.join(directoryPath, filename);

  try {
    // Check if the file exists
    const fileExists = fs.existsSync(filePath);
    if (!fileExists) {
      return false;
    }

    // Read the file and return its content as a base64 string
    const fileContent = await fs.promises.readFile(filePath, {
      encoding: "base64",
    });

    return fileContent;
  } catch (error) {
    console.error("Error downloading file:", error);
    return error;
  }
};

//
//
// Get public IP
export const publicIP = async () => {
  const publicIP = await publicIpv4();
  return publicIP;
};
