"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/supabaseclient";

type Props = {
  uptime: number;
  serverfps: number;
  maxplayernum: number;
  serverframetime: number;
  currentplayernum: number;
};

export function MeTrics(Props: Props) {
  const [meTrics, setMeTrics] = useState(Props);

  useEffect(() => {
    const subscription = supabase
      .channel("metrics-channel")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "realtime_metrics",
          // filter: "id=eq.1",
        },
        (payload) => {
          // console.log(payload?.new);
          // setSupabaseData((prev: any) => [...prev, payload?.new]);
          setMeTrics(payload?.new as Props);
        }
      )
      .subscribe();

    // Clean up subscription on component unmount
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [meTrics, setMeTrics]);

  return meTrics;
}

// return API
// {
//     "uptime": 800,
//     "serverfps": 59,
//     "maxplayernum": 16,
//     "serverframetime": 16.777647018432617,
//     "currentplayernum": 2
// }
