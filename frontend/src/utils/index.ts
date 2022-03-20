import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { IDL } from "~/api/solana/types/sol_race_core";

export const toastAPIError = (
  e: any,
  defaultMessage = "Something went wrong. Please try again."
) => {
  let message = defaultMessage;

  if ((e as any).isAxiosError) {
    const axiosError = e as AxiosError;
    message =
      axiosError.response?.data?.message ||
      axiosError.response?.statusText ||
      message;
  }

  const messages = e.message?.split(":");

  if (messages && messages.length >= 1) {
    const code = messages[messages.length - 1];
    if (!isNaN(+code)) {
      const error = IDL["errors"].find((err) => err.code === +code);
      if (error) {
        message = `${error.msg}`;
      }
    }
  }

  toast(message, { type: "error" });
};
