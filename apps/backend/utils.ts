export const checkSubmissionStatus = async (tokenQuery: string) => {
    while (true) {
      try {
        const response = await axios.get(
          `${JUDGE0_URL}/submissions/batch?tokens=${tokenQuery}&base64_encoded=false`,
          {
            headers: {
              "x-rapidapi-key": JUDGE0_API_KEY,
              "x-rapidapi-host": JUDGE0_HOST,
              "Content-Type": "application/json",
            },
          }
        );
  
        const submissions = response.data.submissions;
  
        // Check statuses
        let allAccepted = true;
        for (const submission of submissions) {
          const status = submission.status.description;
  
          if (status === "In Queue" || status === "Processing") {
            console.log("Still processing... Retrying in 2 seconds.");
            await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for 2 seconds before retrying
            allAccepted = false;
            break; // Exit loop and retry the request
          }
  
          if (status !== "Accepted") {
            return "REJECTED"; // If any status is not "Accepted", return "Failed"
          }
        }
  
        if (allAccepted) {
          return "ACCEPTED";
        }
      } catch (error) {
        console.error("Error fetching submission status:", error);
        return "REJECTED";
      }
    }
  
  }
  