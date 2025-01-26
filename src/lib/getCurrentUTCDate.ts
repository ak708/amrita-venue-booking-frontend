import { utcToZonedTime } from "date-fns-tz";

const getCurrentUTCDate = () => {
    console.log(utcToZonedTime(new Date(), "Asia/Kolkata"));
    return utcToZonedTime(new Date(), "Asia/Kolkata");
};

export default getCurrentUTCDate;
