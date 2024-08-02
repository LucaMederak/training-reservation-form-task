import { trainingReservationInitialData } from "../schemas/trainingReservation.schema";
import { FormState } from "../types/formState.types";
import { TrainingReservationFormData } from "../types/trainingReservation.types";

export type TrainingReservationFormState = {
  data: TrainingReservationFormData;
  errors: {
    [key in keyof TrainingReservationFormData]?: string;
  };
} & FormState;

export const trainingReservationInitialState: TrainingReservationFormState = {
  data: trainingReservationInitialData,
  isSubmitting: false,
  isSubmitted: false,
  errors: {},
};

export type TrainingReservationFormAction =
  | {
      type: "SET_FIELD_VALUE";
      payload: {
        key: keyof TrainingReservationFormData;
        value: TrainingReservationFormData[keyof TrainingReservationFormData];
      };
    }
  | {
      type: "VALIDATE_FIELD";
      payload: {
        key: keyof TrainingReservationFormData;
        error: any;
      };
    }
  | { type: "SUBMIT" }
  | { type: "SUBMIT_SUCCESS" }
  | { type: "SUBMIT_FAILED" }
  | { type: "RESET" };

export const trainingReservationFormReducer = (
  state: TrainingReservationFormState,
  action: TrainingReservationFormAction
): TrainingReservationFormState => {
  switch (action.type) {
    case "SET_FIELD_VALUE":
      return {
        ...state,
        data: {
          ...state.data,
          [action.payload.key]: action.payload.value,
        },
      };
    case "VALIDATE_FIELD":
      const { key, error } = action.payload;
      return {
        ...state,
        errors: {
          ...state.errors,
          [key]: error,
        },
      };
    case "SUBMIT":
      return { ...state, isSubmitting: true };
    case "SUBMIT_SUCCESS":
      return { ...state, isSubmitting: false, isSubmitted: true };
    case "SUBMIT_FAILED":
      return { ...state, isSubmitting: false, isSubmitted: false };
    case "RESET":
      return trainingReservationInitialState;
    default:
      return state;
  }
};
