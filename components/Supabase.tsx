"use client";

import React, { useState, useEffect, useTransition } from "react";
import { supabase } from "@/lib/supabase/supabaseclient";

import { Button } from "@/components/ui/button";

interface rconDataType {
  names: string[];
  playerIDs: string[];
  steamIDs: string[];
  numPlayerOnline: number;
  rconstatus: boolean;
}

const defaultRconData: rconDataType = {
  names: [],
  playerIDs: [],
  steamIDs: [],
  numPlayerOnline: 0,
  rconstatus: false,
};

const Supabased = () => {
  const [cpuTemp, setCpuTemp] = useState<number>(0);
  const [cpuUse, setCpuUse] = useState<number>(0);
  const [ramUse, setRamUse] = useState<number>(0);
  const [rconData, setRconData] = useState<rconDataType>(defaultRconData);

  const [isPending, startTransition] = useTransition();

  const handleInserts = (payload: any) => {
    // console.log("Change received!", payload);
    setCpuTemp(payload?.new?.cpu_temp);
    setCpuUse(payload?.new?.cpu_use);
    setRamUse(payload?.new?.ram_use);
    setRconData(payload?.new?.rcon_data);
  };

  //
  //
  useEffect(() => {
    const subscription = supabase
      .channel("palworld")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "palworld",
          filter: "id=eq.1",
        },
        handleInserts
      )
      .subscribe();

    // Clean up subscription on component unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <>
      <div className="flex items-center justify-center space-x-10 py-16">
        <div className="flex-auto text-center">
          <div className="text-5xl font-bold tracking-tighter">{cpuTemp} °</div>
          <div className="text-[0.70rem] uppercase text-muted-foreground">
            CUP Tempureture
          </div>
        </div>

        <div className="flex-auto text-center">
          <div className="text-5xl font-bold tracking-tighter">{cpuUse} %</div>
          <div className="text-[0.70rem] uppercase text-muted-foreground">
            CUP Use
          </div>
        </div>
      </div>

      <div className="flex-auto text-center">
        <div className="text-4xl font-bold tracking-tighter">{ramUse}</div>
        <div className="text-[0.70rem] uppercase text-muted-foreground">
          Ram Use
        </div>

        <div className="pt-16">
          Players:{" "}
          {Object.entries(rconData).map(([index, value]) => (
            <div key={index}>
              <div>
                {index}:{" "}
                {Array.isArray(value) ? value?.join(", ") : value?.toString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Supabased;
