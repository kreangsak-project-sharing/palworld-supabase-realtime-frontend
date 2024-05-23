"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/supabaseclient";

type Props = {
  cpu_temp: number;
  cpu_use: number;
  ram_use: number;
  swap_use: number;
};

export function SystemInfo(props: Props) {
  const [systemInfo, setSysteminfo] = useState(props);
  // console.log(props);

  useEffect(() => {
    const subscription = supabase
      .channel("systeminfo-channel")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "realtime_systeminfo",
          // filter: "id=eq.1",
        },
        (payload) => {
          // console.log(payload);
          // setSupabaseData((prev: any) => [...prev, payload?.new]);
          setSysteminfo(payload?.new as Props);
        }
      )
      .subscribe();

    // Clean up subscription on component unmount
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [systemInfo, setSysteminfo]);

  return systemInfo;
}

// return API
// {id: 1, created_at: '2024-04-27T19:17:47.939527+00:00', cpu_temp: 0, cpu_use: 19, ram_use: 46}
