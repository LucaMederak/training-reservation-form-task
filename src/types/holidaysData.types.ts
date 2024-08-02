type HolidayType = "NATIONAL_HOLIDAY" | "OBSERVANCE" | "SEASON";

export type HolidaysData = {
  country: string;
  date: string;
  day: string;
  iso: string;
  name: string;
  type: HolidayType;
  year: number;
};
