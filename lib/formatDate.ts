// interface OptionType {
//   month: "2-digit" | "numeric" | "short" | "long" | "narrow" | undefined;
//   day: "2-digit" | "numeric" | undefined;
//   year: "2-digit" | "numeric" | undefined;
//   hour: "2-digit" | "numeric" | undefined;
//   minute: "2-digit" | "numeric" | undefined;
//   hour12: boolean | undefined;
// }

// export const formatDate = (timestampString: any): string => {
//   // Check if timestampString is not provided or empty
//   if (!timestampString) {
//     return "Invalid Date";
//   }

//   // Try creating a Date object from the timestampString
//   const date = new Date(timestampString);

//   // Check if the created date is valid
//   if (isNaN(date.getTime())) {
//     return "Invalid Date";
//   }

//   // Define options for formatting
//   const options: OptionType = {
//     month: "short",
//     day: "2-digit",
//     year: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//     hour12: true,
//   };

//   // Format the date and return
//   return new Intl.DateTimeFormat("en-US", options).format(date);
// };

export const formatDate = (
  timestampString: any
): { date: string; time: string; day: string } => {
  // Check if timestampString is not provided or empty
  if (!timestampString) {
    return { date: "Invalid Date", time: "Invalid Date", day: "Invalid Day" };
  }

  // Try creating a Date object from the timestampString
  const date = new Date(timestampString);

  // Check if the created date is valid
  if (isNaN(date.getTime())) {
    return { date: "Invalid Date", time: "Invalid Date", day: "Invalid Day" };
  }

  // Adjust the time to Bangkok time (UTC+7)
  const bangkokTime = new Date(date.getTime() + 7 * 60 * 60 * 1000);

  // Format the date and time separately
  const formattedDate = bangkokTime.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

  const formattedTime = bangkokTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  // Format the date and time separately
  const formattedDay = bangkokTime.toLocaleDateString("en-US", {
    day: "2-digit",
  });

  // Return the date and time components as an object
  return { date: formattedDate, time: formattedTime, day: formattedDay };
};
