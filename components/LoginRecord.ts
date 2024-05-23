"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/supabaseclient";

export function LoginRecord(Props: any[]) {
  const [loginRecord, setLoginRecord] = useState<any[]>(Props);

  useEffect(() => {
    const subscription = supabase
      .channel("loginrecord-channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "realtime_loginrecord",
          // filter: "id=eq.1",
        },
        (payload) => {
          // console.log(payload?.new);
          setLoginRecord((prev) => [payload?.new, ...prev]);
          // setloginRecord(payload?.new as any[]);
        }
      )
      .subscribe();

    // Clean up subscription on component unmount
    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  // Check if loginRecord is defined before calling slice
  const slicedRecords = loginRecord ? loginRecord.slice(0, 5) : [];

  return slicedRecords;
}
