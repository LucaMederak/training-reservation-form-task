import * as yup from "yup";
import { TrainingReservationFormData } from "../types/trainingReservation.types";

export const trainingReservationSchema: yup.ObjectSchema<TrainingReservationFormData> =
  yup.object().shape({
    firstName: yup.string().required("First Name is required").default(""),
    lastName: yup.string().required("Last Name is required").default(""),
    emailAddress: yup
      .string()
      .email("Please use correct formatting. Example: address@email.com")
      .required("E-mail address is required")
      .default(""),
    age: yup.number().required("Age is required").default(8).min(8).max(100),
    photo: yup
      .mixed<File>()
      .required("Photo is required")
      .test("fileSize", "The file is too large", (value) => {
        return value && value.size <= 2000000; //2MB
      })
      .test("fileType", "Unsupported File Format", (value) => {
        return (
          value && ["image/jpg", "image/jpeg", "image/png"].includes(value.type)
        );
      })
      .default(new File([""], "filename")),
    date: yup.string().required("Date is required").default(""),
    time: yup.string().required("Time is required").default(""),
  });

export const trainingReservationInitialData: TrainingReservationFormData =
  trainingReservationSchema.cast({});
