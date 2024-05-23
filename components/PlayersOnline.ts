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

// return API
// [
//   {
//     ip: "171.6.114.102",
//     name: "MikomakO-",
//     ping: 44.85714340209961,
//     level: 7,
//     userId: "steam_76561198070518796",
//   },
//   {
//     ip: "184.22.229.197",
//     name: "Pokémon",
//     ping: 49.64285659790039,
//     level: 3,
//     userId: "steam_76561199569185686",
//   },
// ];

// "use client";

// import React, { useState, useEffect } from "react";
// import { supabase } from "@/lib/supabase/supabaseclient";

// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
//   TableFooter,
// } from "@/components/ui/table";

// type Props = {
//   serverselect: any;
// };

// export const Playersonline = ({ serverselect }: Props) => {
//   const [dataResponse, setDataResponse] = useState(serverselect);
//   useEffect(() => {
//     const subscription = supabase
//       .channel("playersonline-channel")
//       .on(
//         "postgres_changes",
//         {
//           event: "UPDATE",
//           schema: "public",
//           table: "realtime_playersonline",
//           // filter: "id=eq.1",
//         },
//         (payload) => {
//           // console.log(payload?.new);
//           // setSupabaseData((prev: any) => [...prev, payload?.new]);
//           setDataResponse(payload?.new?.player_data);
//         }
//       )
//       .subscribe();

//     // Clean up subscription on component unmount
//     return () => {
//       supabase.removeChannel(subscription);
//     };
//   }, [supabase, dataResponse, setDataResponse]);
//   return (
//     <div>
//       Playersonline{" "}
//       {dataResponse?.map((data: any, index: number) => (
//         <React.Fragment key={index}>
//           <div>{data.name}</div>
//         </React.Fragment>
//       ))}
//     </div>
//   );
// };

// export default Playersonline;

// // return API
// // [
// //   {
// //     ip: "171.6.114.102",
// //     name: "MikomakO-",
// //     ping: 44.85714340209961,
// //     level: 7,
// //     userId: "steam_76561198070518796",
// //   },
// //   {
// //     ip: "184.22.229.197",
// //     name: "Pokémon",
// //     ping: 49.64285659790039,
// //     level: 3,
// //     userId: "steam_76561199569185686",
// //   },
// // ];
