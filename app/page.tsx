import Image from "next/image";
import {
  getFileList,
  publicIP,
  selectLoginRecord,
  selectMetrics,
  selectPlayersOnline,
  selectSystemInfo,
} from "./action";

import { getserverSettings, getserverVersion } from "./palworldapi";

import Dashboard from "@/pages/Dashboard";

export default async function Home() {
  const resultsysteminfo = await selectSystemInfo();
  const resultplayersonline = await selectPlayersOnline();
  const resultmetrics = await selectMetrics();
  const resultloginrecord = await selectLoginRecord();
  const resultfilesList = await getFileList();
  const publicip = await publicIP();

  const palworldinfo = await getserverVersion();
  const palserversettings = await getserverSettings();

  // console.log(resultplayersonline?.realtime_playersonline![0].player_data);

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-5xl px-5 pb-5">
        <div>
          <Image
            className="h-full w-full object-center"
            src="/images/palworld.webp"
            alt="palworld Image"
            width={980}
            height={337}
            priority={true}
          />
        </div>
        <Dashboard
          resultsysteminfo={resultsysteminfo?.realtime_systeminfo![0]}
          resultplayersonline={resultplayersonline?.realtime_playersonline![0]}
          resultmetrics={resultmetrics?.realtime_metrics![0]}
          resultloginrecord={resultloginrecord?.realtime_loginrecord}
          resultfilesList={resultfilesList}
          publicip={publicip}
          palworldinfo={palworldinfo}
          palserversettings={palserversettings}
        />
      </div>
    </div>
  );
}
