import { utcToZonedTime } from "date-fns-tz";

const getCurrentUTCDate = () => {
    return utcToZonedTime(new Date(), "Asia/Kolkata");
};

export default getCurrentUTCDate;
