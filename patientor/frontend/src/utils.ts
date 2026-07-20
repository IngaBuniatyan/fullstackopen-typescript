import axios from "axios";

export const getErrorMessage = (error: unknown): string => {
  if (!axios.isAxiosError(error)) {
    return "Unknown error";
  }

  const responseData: unknown = error.response?.data;

  if (typeof responseData === "string") {
    return responseData.replace("Something went wrong. Error: ", "");
  }

  if (
    typeof responseData !== "object"
    || responseData === null
    || !("error" in responseData)
  ) {
    return error.message;
  }

  const reason: unknown = responseData.error;

  if (typeof reason === "string") {
    return reason;
  }

  if (Array.isArray(reason)) {
    const messages = reason.flatMap((issue: unknown) => {
      if (typeof issue !== "object" || issue === null || !("message" in issue)) {
        return [];
      }

      const message = issue.message;
      const path =
        "path" in issue && Array.isArray(issue.path)
          ? issue.path.filter((part): part is string => typeof part === "string")
          : [];

      return typeof message === "string"
        ? [`${path.length > 0 ? `${path.join(".")}: ` : ""}${message}`]
        : [];
    });

    if (messages.length > 0) {
      return messages.join(", ");
    }
  }

  return "The backend rejected the request";
};
