export const calculateMatching = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(`/api/v1/hiring/matching/calculate`, {
      method: "POST",
      body: formData,
    });

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      if (response.status === 504) {
        throw new Error("Server is not responding. Please try again later.");
      }
      throw new Error("Unable to process server response.");
    }

    if (!response.ok) {
      console.log('response', response)
      switch (response.status) {
        case 504:
          throw new Error("Server is not responding. Please try again later.");
        case 502:
          throw new Error(
            "Server is temporarily unavailable. Please try again later."
          );
        case 500:
          throw new Error("Internal server error. Please try again later.");
        default:
          throw new Error(data.error || "An unexpected error occurred.");
      }
    }
    return data.results;
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message.includes("timed out")) {
        throw new Error("Server is not responding. Please try again later.");
      }

      if (!navigator.onLine) {
        throw new Error("No internet connection. Please check your network.");
      }

      if (
        error instanceof TypeError &&
        error.message.includes("Failed to fetch")
      ) {
        throw new Error(
          "Cannot connect to server. Please check if the server is running."
        );
      }

      throw error;
    }

    // If error is not an Error instance, convert it to one
    throw new Error(
      error instanceof Object ? JSON.stringify(error) : String(error)
    );
  }
};
