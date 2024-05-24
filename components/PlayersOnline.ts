"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/supabaseclient";

type Props = {};

export function PlayersOnline(Props: any) {
  // console.log(Props.created_at);
  const [playerOnline, setPlayerOnline] = useState<any[]>(Props?.player_data);
  useEffect(() => {
    const subscription = supabase
      .channel("playersonline-channel")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "realtime_playersonline",

          // filter: "id=eq.1",
        },
        (payload) => {
          // console.log(payload?.new);
          // setSupabaseData((prev: any) => [...prev, payload?.new]);
          setPlayerOnline(payload?.new?.player_data);
        }
      )
      .subscribe();

    // Clean up subscription on component unmount
    return () => {
      supabase.removeChannel(subscription);
    };
  }, [playerOnline, setPlayerOnline]);

  return playerOnline;
}
