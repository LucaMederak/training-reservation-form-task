import React, { useState, useEffect } from "react";
import { HolidaysData } from "../types/holidaysData.types";

const holidaysApiURL = "https://api.api-ninjas.com/v1/holidays";

export const usePolishHolidays = () => {
  const [holidaysData, setHolidaysData] = useState<HolidaysData[] | null>(null);
  const [holidaysError, setHolidaysError] = useState<boolean>(false);
  const [holidaysLoading, setHolidaysLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setHolidaysLoading(true);

      try {
        const response = await fetch(`${holidaysApiURL}?country=PL&year=2024`, {
          headers: {
            "x-api-key": process.env.REACT_APP_HOLIDAYS_API_KEY as string,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = (await response.json()) as HolidaysData[];
        setHolidaysData(result);
      } catch (error) {
        console.log(error);
        setHolidaysError(true);
      } finally {
        setHolidaysLoading(false);
      }
    };

    fetchData();
  }, []);

  return { holidaysData, holidaysError, holidaysLoading };
};
