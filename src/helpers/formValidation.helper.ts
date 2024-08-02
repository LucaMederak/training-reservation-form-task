import * as yup from "yup";
import { trainingReservationSchema } from "../schemas/trainingReservation.schema";
import { TrainingReservationFormData } from "../types/trainingReservation.types";

export const validateForm = async (data: TrainingReservationFormData) => {
  try {
    await trainingReservationSchema.validate(data, { abortEarly: false });
    return { isValid: true, errors: {} };
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      const errors: Record<string, string> = {};
      err.inner.forEach((error) => {
        if (error.path) {
          errors[error.path] = error.message;
        }
      });
      return { isValid: false, errors };
    }
    return { isValid: false, errors: {} };
  }
};

export const validateField = async (
  key: keyof TrainingReservationFormData,
  value: TrainingReservationFormData[keyof TrainingReservationFormData]
): Promise<string | null> => {
  try {
    await trainingReservationSchema.validateAt(key, { [key]: value });
    return null;
  } catch (err) {
    if (err instanceof yup.ValidationError) {
      return err.message;
    }
    return "Unknown validation error";
  }
};
