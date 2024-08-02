import React, {
  useReducer,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import "./tooltip.css";
import "./datePicker.css";
import { twMerge } from "tailwind-merge";

//components
import CTA from "./components/CTA";
import DeleteIcon from "./components/DeleteIcon";
import TextField from "./components/TextField";
import SkeletonLoadingGrid from "./components/SkeletonLoadingGrid";
import TimeSlot from "./components/TimeSlot";

//icons
import ArrowLeftIcon from "./icons/ArrowLeftIcon";
import ArrowRightIcon from "./icons/ArrowRightIcon";
import ErrorIcon from "./icons/ErrorIcon";

//services
import { usePolishHolidays } from "./services/usePolishHolidays";

//form state and reducer
import {
  TrainingReservationFormAction,
  trainingReservationFormReducer,
  TrainingReservationFormState,
  trainingReservationInitialState,
} from "./state/trainingReservationFormState";

//form types
import { TrainingReservationFormData } from "./types/trainingReservation.types";

//form validation helpers
import { validateForm, validateField } from "./helpers/formValidation.helper";

//date picker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

//photo dropzone
import { useDropzone } from "react-dropzone";

const dayAvailableHours = ["12:00", "14:00", "16:30", "18.30", "20:00"];

const App = () => {
  const { holidaysData, holidaysLoading, holidaysError } = usePolishHolidays();

  const [formState, dispatch] = useReducer<
    React.Reducer<TrainingReservationFormState, TrainingReservationFormAction>
  >(trainingReservationFormReducer, trainingReservationInitialState);

  //form fields validation
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const validateAllFields = async () => {
      const { isValid } = await validateForm(formState.data);

      if (!isValid) {
        setIsFormValid(false);
      } else {
        setIsFormValid(true);
      }
    };
    validateAllFields();
  }, [formState.data]);

  const handleChangeFieldValue = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const fieldName = event.target.name as keyof TrainingReservationFormData;
    const value = event.target.value;
    dispatch({ type: "SET_FIELD_VALUE", payload: { key: fieldName, value } });
  };

  const handleBlur = async (key: keyof TrainingReservationFormData) => {
    const error = await validateField(key, formState.data[key]);
    dispatch({ type: "VALIDATE_FIELD", payload: { key, error } });
  };

  const onPhotoDrop = useCallback((acceptedFiles: File[]) => {
    dispatch({
      type: "SET_FIELD_VALUE",
      payload: { key: "photo", value: acceptedFiles[0] },
    });
  }, []);

  const removePhoto = () => {
    dispatch({
      type: "SET_FIELD_VALUE",
      payload: { key: "photo", value: new File([""], "filename.jpg") },
    });
  };

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop: onPhotoDrop,
    noClick: true,
    maxFiles: 1,
    accept: {
      "image/jpg": [],
      "image/jpeg": [],
      "image/png": [],
    },
  });

  const handleDateChange = (date: Date | null) => {
    if (date) {
      const formatDate = () => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      dispatch({
        type: "SET_FIELD_VALUE",
        payload: { key: "date", value: formatDate() },
      });
    }
  };

  const isValidCalendarDay = (date: Date) => {
    //is sunday
    const day = date.getDay();
    if (day === 0) {
      //day is disabled
      return false;
    }

    //day is national holiday
    const dayIsNationalHoliday = holidaysData?.some(
      (holiday) =>
        new Date(holiday.date).toDateString() === date.toDateString() &&
        holiday.type === "NATIONAL_HOLIDAY"
    );

    if (dayIsNationalHoliday) {
      return false;
    }

    return true;
  };

  const selectedDayIsObservance = (date: Date) => {
    //day is national holiday
    const dayIsObservance = holidaysData?.find(
      (holiday) =>
        new Date(holiday.date).toDateString() === date.toDateString() &&
        holiday.type === "OBSERVANCE"
    );

    if (dayIsObservance) {
      return {
        isObservance: true,
        name: dayIsObservance.name,
      };
    }

    return {
      isObservance: false,
      name: "",
    };
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch({ type: "SUBMIT" });

    const data = formState.data;
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value instanceof File ? value : String(value));
    });

    fetch("http://letsworkout.pl/submit", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        dispatch({ type: "SUBMIT_SUCCESS" });
        console.log("Success:", data);
      })
      .catch((error) => {
        dispatch({ type: "SUBMIT_FAILED" });
        console.error("Error:", error);
      });
  };

  if (holidaysLoading)
    return (
      <div className="flex items-center justify-center flex-col space-y-5 w-full bg-backgroundAccent min-h-screen">
        <SkeletonLoadingGrid />
      </div>
    );

  if (holidaysError)
    return (
      <div className="flex items-center justify-center flex-col space-y-5 w-full bg-backgroundAccent min-h-screen p-5">
        <h1 className="text-2xl font-bold text-textDefault text-center">
          Oops! Something went wrong.
        </h1>
        <p className="text-lg font-normal text-textDefault text-center">
          You may refresh the page or try again later.
        </p>
      </div>
    );

  return (
    <main className="flex sm:items-center justify-start flex-col font-Inter w-full min-h-screen bg-backgroundAccent">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-start justify-start sm:m-auto max-w-screen-xl space-y-12 pl-[23px] pr-[25px] py-[96px] sm:py-[120px]"
      >
        <div className="space-y-8 w-full">
          <h2 className="text-2xl font-medium">Personal info</h2>
          <div className="space-y-6">
            <TextField
              label="First Name"
              name="firstName"
              type="text"
              required
              value={formState.data.firstName}
              onBlur={() => handleBlur("firstName")}
              errorMessage={formState.errors.firstName}
              onChange={handleChangeFieldValue}
            />
            <TextField
              label="Last Name"
              name="lastName"
              type="text"
              required
              value={formState.data.lastName}
              onBlur={() => handleBlur("lastName")}
              errorMessage={formState.errors.lastName}
              onChange={handleChangeFieldValue}
            />
            <TextField
              label="Email Address"
              name="emailAddress"
              type="email"
              required
              value={formState.data.emailAddress}
              onBlur={() => handleBlur("emailAddress")}
              errorMessage={formState.errors.emailAddress}
              onChange={handleChangeFieldValue}
            />

            <div className="flex items-start justify-start flex-col space-y-2">
              <label
                htmlFor="age"
                className="font-normal text-base text-textDefault "
              >
                Age
              </label>

              <div className="flex flex-col w-full">
                <div className="relative flex flex-col space-y-3">
                  <div className="flex justify-between w-full sm:w-[426px] px-1 space-y-1">
                    <span className="text-xs font-normal">8</span>
                    <span className=" text-xs font-normal">100</span>
                  </div>

                  <input
                    type="range"
                    min={8}
                    max={100}
                    onChange={(e) => {
                      dispatch({
                        type: "SET_FIELD_VALUE",
                        payload: {
                          key: "age",
                          value: e.target.valueAsNumber,
                        },
                      });
                    }}
                    value={formState.data.age}
                    step={1}
                    className="relative h-1 w-full bg-primary-200 rounded-sm appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:bg-primary-600 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
                  />
                  <span
                    className={`tooltip-icon absolute top-3`}
                    style={{ left: `${formState.data.age - 8}%` }}
                  >
                    {formState.data.age}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="photo"
                className="font-normal text-base text-textDefault "
              >
                Photo
              </label>

              <div {...getRootProps()}>
                <input {...getInputProps()} />
                <div className="flex items-center justify-center border border-borderDefault rounded-md w-full sm:w-[426px] h-24 bg-white space-x-[5px] cursor-pointer">
                  {Object.keys(formState.data.photo).length !== 0 ? (
                    <>
                      <p className="font-medium text-base text-textDefault">
                        {formState.data.photo.name}
                      </p>
                      <DeleteIcon onClick={removePhoto} />
                    </>
                  ) : (
                    <>
                      <p className="font-normal text-base text-textMuted">
                        <span
                          className="underline cursor-pointer text-primary-600"
                          onClick={open}
                        >
                          Upload a file
                        </span>{" "}
                        or drag and drop here
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <h2 className="text-2xl font-medium">Your workout</h2>
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex items-start justify-start flex-col space-y-2">
              <label
                htmlFor="date"
                className="font-normal text-base text-textDefault "
              >
                Date
              </label>
              <div className="space-y-3">
                <DatePicker
                  name="date"
                  inline
                  calendarStartDay={1}
                  selected={
                    formState.data.date ? new Date(formState.data.date) : null
                  }
                  onChange={handleDateChange}
                  calendarClassName="!font-Inter !w-[326px] bg-white border !border-borderDefault rounded-lg p-6"
                  weekDayClassName={(day) =>
                    "text-sm font-medium text-textDefault !w-8 !h-8 !flex !items-center !justify-center"
                  }
                  dayClassName={(day) =>
                    `${twMerge(
                      `text-base font-normal !text-textDefault !w-8 !h-8 !flex !items-center !justify-center !rounded-full ${
                        !isValidCalendarDay(day) &&
                        "!pointer-events-none !text-textMuted"
                      } ${
                        day.getDate() ===
                          (formState.data.date &&
                            new Date(formState.data.date).getDate()) &&
                        " !bg-primary-600 !text-white "
                      }`
                    )} `
                  }
                  renderCustomHeader={({ date, changeYear, changeMonth }) => (
                    <div className="flex items-center justify-between w-full">
                      <button
                        type="button"
                        onClick={() => changeMonth(date.getMonth() - 1)}
                      >
                        <ArrowLeftIcon />
                      </button>
                      <span className="text-base text-textDefault font-medium">
                        {date.toLocaleDateString("en-US", {
                          month: "long",
                          year: "numeric",
                        })}
                      </span>
                      <button
                        type="button"
                        onClick={() => changeMonth(date.getMonth() + 1)}
                      >
                        <ArrowRightIcon />
                      </button>
                    </div>
                  )}
                />
              </div>
              {formState.data.date &&
                selectedDayIsObservance(new Date(formState.data.date))
                  .isObservance && (
                  <div className="flex items-center justify-start space-x-2">
                    <ErrorIcon />
                    <span className="font-normal text-base">
                      {
                        selectedDayIsObservance(new Date(formState.data.date))
                          .name
                      }
                    </span>
                  </div>
                )}
            </div>

            {formState.data.date && (
              <div className="flex items-start justify-start flex-col space-y-2">
                <label
                  htmlFor="time"
                  className="font-normal text-base text-textDefault "
                >
                  Time
                </label>
                <div className="flex flex-wrap gap-2 sm:flex-col">
                  {dayAvailableHours.map((hour) => (
                    <TimeSlot
                      name="time"
                      key={hour}
                      value={hour}
                      selected={formState.data.time === hour}
                      onClick={() => {
                        dispatch({
                          type: "SET_FIELD_VALUE",
                          payload: {
                            key: "time",
                            value: hour,
                          },
                        });
                      }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        <CTA disabled={!isFormValid || formState.isSubmitting} />
      </form>
    </main>
  );
};

export default App;
