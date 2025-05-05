import { jwtDecode } from "jwt-decode"; // Correct import statement

export const checkTokenExpiry = () => {
  const token = JSON.parse(localStorage.getItem("authUser"))?.token;

  if (!token) {
    return false;
  }

  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Current time in seconds

    // Check if the token has expired
    if (decoded.exp < currentTime) {
      return false; // Token expired
    }

    return true; // Token is valid
  } catch (error) {
    console.log("Error decoding token:", error);
    return false;
  }
};
