"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
const supabase = createClient(
  process.env.NODE_SUPABASE_URL!,
  process.env.NODE_SUPABASE_SERVICE_KEY!
  // process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

//
// Function supabaseSelect
export const supabaseSelect = async () => {
  try {
    let { data: palworld, error } = await supabase.from("palworld").select("*");
    if (error) {
      console.error(error);
      return;
    } else {
      revalidatePath("/");
      return { palworld, error };
    }
  } catch (err) {
    console.error(err);
  }
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
      .from("palworld")
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
