"use client";

import React, { useState, useEffect, useTransition } from "react";
import { SystemInfo } from "@/components/SystemInfo";
import { PlayersOnline } from "@/components/PlayersOnline";
import { MeTrics } from "@/components/MeTrics";
import { LoginRecord } from "@/components/LoginRecord";

import { CgSmartphoneRam } from "react-icons/cg";
import { GrCpu } from "react-icons/gr";

import { formatDate } from "@/lib/formatDate";

import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { restartServer } from "@/app/palworldapi";

//
//
type Props = {
  resultsysteminfo: any;
  resultplayersonline: any;
  resultmetrics: any;
  resultloginrecord: any;
  resultfilesList: any;
  publicip: string;
  palworldinfo: any;
  palserversettings: any;
};

const Dashboard = (props: Props) => {
  const [serverVer, setServerVer] = useState("Server Version");

  const systeminfo = SystemInfo(props?.resultsysteminfo);
  const playerdata = PlayersOnline(props?.resultplayersonline);
  const metrics = MeTrics(props?.resultmetrics);
  const loginrecord = LoginRecord(props?.resultloginrecord);

  //
  //
  const getTimeAgo = (timestamp: Date) => {
    const currentTime = new Date();
    const timeDifference = currentTime.getTime() - timestamp.getTime();
    const minutes = Math.floor(timeDifference / (1000 * 60));

    if (minutes < 1) {
      return "Just now";
    } else if (minutes < 60) {
      return `${minutes} min ago`;
    } else {
      return `${Math.floor(minutes / 60)} hour ago`;
    }
  };

  //
  //
  function formatSettings(settings: any) {
    // Convert the JSON object to a string with JSON.stringify
    let jsonString = JSON.stringify(settings, null, 2);

    // Remove the curly braces
    jsonString = jsonString?.slice(1, -1);

    // Perform the replacements to match the desired format
    jsonString = jsonString?.replace(/"([^"]+)":/g, "$1:"); // Remove quotes from keys
    jsonString = jsonString?.replace(/"/g, "'"); // Replace double quotes with single quotes

    return jsonString;
  }

  return (
    <div className="grid lg:grid-cols-12 gap-4">
      <div className="grid lg:col-span-6">
        <div className="card">
          <div className="card-header">Server Status</div>
          <div className="card-body flex justify-center">
            <div className="w-full">
              <div className="flex justify-between items-center">
                <p>Status:</p>
                <p className="text-[18px] text-green-600 font-bold">Online</p>
              </div>
              <div className="flex justify-between items-center">
                <p>Address:</p>
                <p className="text-sm text-gray-500">{props.publicip}</p>
              </div>
              <div className="flex justify-between items-center">
                <p>Port:</p>
                <p className="text-sm text-gray-500">8211</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:col-span-6 row-span-2">
        <div className="card">
          <div className="card-header">
            Player Online ({playerdata?.length} / {metrics?.maxplayernum})
          </div>
          <div className="card-body bg-blue-50">
            <div className="flex justify-between items-center">
              {playerdata?.length === 0 ? (
                <div>No players Online</div>
              ) : (
                <div
                  className={
                    playerdata?.length > 4 ? "flex flex-wrap" : "w-full"
                  }
                >
                  {playerdata?.map((data: any, index: number) =>
                    playerdata?.length > 4 ? (
                      <div key={index}>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Avatar className="bg-white shadow-sm shadow-gray-400 ml-3 mb-2 w-[60px] h-[60px]">
                                <AvatarImage
                                  src={`/images/palimages/${data.imagename}`}
                                />
                                <AvatarFallback>PA</AvatarFallback>
                              </Avatar>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="font-bold">{data.name}</p>
                              <p>Level: {data.level}</p>
                              <p>
                                Login time:{" "}
                                {getTimeAgo(new Date(`${data?.logintime}`))}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    ) : (
                      <div
                        key={index}
                        className={
                          playerdata?.length === index + 1
                            ? "flex justify-between items-center"
                            : "flex justify-between items-center mb-1 border-b border-gray-300"
                        }
                      >
                        <div
                          className={
                            playerdata?.length === index + 1
                              ? "flex items-center"
                              : "flex items-center mb-1"
                          }
                        >
                          <Avatar className="bg-white shadow-sm shadow-gray-400">
                            <AvatarImage
                              src={`/images/palimages/${data.imagename}`}
                            />
                            <AvatarFallback>CN</AvatarFallback>
                          </Avatar>
                          <span className="ml-3 mb-1">
                            <p>{data?.name}</p>
                            <p className="text-gray-500">
                              Level: {data?.level}
                            </p>
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          {getTimeAgo(new Date(`${data?.logintime}`))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:col-span-2">
        <div className="card">
          <div className="card-header">CPU Usage</div>
          <div className="card-body">
            <div className="flex justify-between items-center">
              <h1>{systeminfo?.cpu_use} %</h1>
              <GrCpu size={30} className="text-gray-500" />
            </div>
            <div className="text-gray-400 text-sm mt-2 mb-1">CPU usage</div>
            <Progress value={systeminfo?.cpu_use} className="h-[14px]" />
          </div>
        </div>
      </div>

      <div className="grid lg:col-span-2">
        <div className="card">
          <div className="card-header">RAM Usage</div>
          <div className="card-body">
            <div className="flex justify-between items-center">
              <h1>{systeminfo?.ram_use} %</h1>
              <CgSmartphoneRam size={30} className="text-gray-500" />
            </div>
            <div className="text-gray-400 text-sm mt-2 mb-1">Ram usage</div>
            <Progress value={systeminfo?.ram_use} className="h-[14px]" />
          </div>
        </div>
      </div>

      <div className="grid lg:col-span-2">
        <div className="card">
          <div className="card-header">Swap Usage</div>
          <div className="card-body">
            <div className="flex justify-between items-center">
              <h1>{systeminfo?.swap_use} %</h1>
              <CgSmartphoneRam size={30} className="text-gray-500" />
            </div>
            <div className="text-gray-400 text-sm mt-2 mb-1">Swap usage</div>
            <Progress value={systeminfo?.swap_use} className="h-[14px]" />
          </div>
        </div>
      </div>

      <div className="grid lg:col-span-6">
        <div className="card">
          <div className="card-header">Backup Files</div>
          <div className="card-body">
            {props?.resultfilesList?.fileListWithTime
              ?.slice() // Create a copy of the array to avoid mutating the original array
              .reverse() // Reverse the order of the array
              .slice(0, 5) // Get the first 5 items from the reversed array
              .map((data: any, index: any) => (
                <div
                  className={
                    props?.resultfilesList?.fileListWithTime.length ===
                    index + 1
                      ? "text-sm text-gray-600"
                      : "text-sm text-gray-600 mb-2 border-b border-gray-300"
                  }
                  key={index}
                >
                  <div className="flex justify-between items-center mt-1 mb-3">
                    <div>
                      <p className="uppercase font-bold mt-1">
                        {data?.lastModified}
                      </p>
                      <p>{data?.name}</p>
                    </div>
                    <Button
                      variant="outline"
                      // onClick={() => }
                    >
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            {/* <Table>
                <TableHeader>
                  <TableRow className="uppercase">
                    <TableHead className="w-[100px]">uptime</TableHead>
                    <TableHead>serverfps</TableHead>
                    <TableHead>maxplayernum</TableHead>
                    <TableHead>serverframetime</TableHead>
                    <TableHead className="text-right">
                      currentplayernum
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">
                      {metrics?.uptime}
                    </TableCell>
                    <TableCell>{metrics?.serverfps}</TableCell>
                    <TableCell>{metrics?.maxplayernum}</TableCell>
                    <TableCell>{metrics?.serverframetime}</TableCell>
                    <TableCell className="text-right">
                      {metrics?.currentplayernum}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table> */}
          </div>
        </div>
      </div>

      <div className="grid lg:col-span-6">
        <div className="card">
          <div className="card-header">Login Record</div>
          <div className="card-body relative">
            <div className="absolute top-0 left-[105px] h-full border-l-2 border-dashed border-gray-300 md:left-[125px]"></div>
            {loginrecord?.map((data: any, index: number) => (
              <div className="flex items-center py-5" key={index}>
                <h4 className="text-gray-400 text-nowrap">
                  {formatDate(data?.created_at).time}
                </h4>
                <div className="absolute left-[90px] hidden md:flex justify-center items-center w-10 h-10 border-2 border-blue-500 rounded-full mx-4 bg-white z-10 text-blue-500">
                  {formatDate(data?.created_at).day}
                </div>
                <div className="absolute left-[120px] md:left-[160px]">
                  <p className="text-sm text-gray-700 font-bold">{data.name}</p>
                  <p className="flex flex-col text-sm text-gray-500">
                    {data.userId}
                    <span className="hidden sm:block">{data.playerId}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:col-span-6">
        <div className="card">
          <div className="card-header">Server Info</div>
          <div className="card-body text-gray-600 text-sm">
            <p className="flex justify-between">
              The server FPS : <span>{metrics?.serverfps}</span>
            </p>
            <p className="flex justify-between">
              The number of current players :{" "}
              <span>{metrics?.currentplayernum}</span>
            </p>
            <p className="flex justify-between">
              Server frame time (ms) : <span>{metrics?.serverframetime}</span>
            </p>
            <p className="flex justify-between">
              The maximum number of players :{" "}
              <span>{metrics?.maxplayernum}</span>
            </p>
            <p className="flex justify-between">
              The server uptime of seconds : <span>{metrics?.uptime}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:col-span-6">
        <div className="card">
          {/* <div className="card-header">Server Info</div> */}
          <div className="card-body text-gray-600 text-sm">
            <Tabs defaultValue="controller">
              <TabsList>
                <TabsTrigger value="controller">Controller</TabsTrigger>
                <TabsTrigger value="config">Additional</TabsTrigger>
              </TabsList>
              <div className="border-2 border-gray-300 md:border-blue-500 border-dashed rounded-lg mt-2 p-2">
                <TabsContent
                  value="controller"
                  className="mt-0 grid grid-cols-2 gap-2"
                >
                  <Button variant="outline" size="sm">
                    Restart Server
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    // onClick={() => }
                  >
                    Backup
                  </Button>

                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm">
                        Server Settings
                      </Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>Server Settings</SheetTitle>
                        <SheetDescription>
                          {formatSettings(props?.palserversettings)}
                          {/* {JSON.stringify(props?.palserversettings, null, 2)} */}
                        </SheetDescription>
                      </SheetHeader>
                    </SheetContent>
                  </Sheet>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setServerVer(props?.palworldinfo?.version)}
                  >
                    {serverVer}
                  </Button>
                </TabsContent>
                <TabsContent value="config" className="mt-0">
                  <p className="flex justify-between">
                    Server version: <span>{props?.palworldinfo?.version}</span>
                  </p>
                  <p className="flex justify-between">
                    Server name: <span>{props?.palworldinfo?.servername}</span>
                  </p>
                  <p className="flex justify-between">
                    Description: <span>{props?.palworldinfo?.description}</span>
                  </p>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
