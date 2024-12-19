import axios from "axios";

const API_URL = "http://localhost:3000/api/auth"; // Backend URL

// Define types for backend responses
interface LoginResponse {
  success: boolean; // Indicates whether the login was successful
  token?: string; // JWT token returned on successful login
  roles?: string; // Role of the logged-in user (optional in response)
  message: string; // Backend message indicating the result of the login
}

interface GeneralResponse {
  success: boolean; // Indicates whether the request was successful
  message: string; // Backend message providing details about the request
}

// Save the token to localStorage
const setAuthToken = (token: string) => {
  localStorage.setItem("authToken", token);
};

// Retrieve the token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem("authToken");
};

// Remove the token from localStorage
const removeAuthToken = () => {
  localStorage.removeItem("authToken");
};

// API to register a new user
export const registerUserAPI = async (userData: {
  username: string; // Username for the new user
  roles: string; // Role assigned to the user (e.g., "admin", "user")
  secret_phrase: string; // Secret phrase for authentication
}): Promise<GeneralResponse> => {
  try {
    // Send a POST request to the backend with user registration details
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data; // Return the backend response
  } catch (error) {
    console.error("Error registering user:", error);
    throw error; // Throw the error for further handling
  }
};

// API to log in a user
export const loginUserAPI = async (credentials: {
  username: string; // User's username
  secret_phrase: string; // User's secret phrase
}): Promise<LoginResponse> => {
  try {
    // Send a POST request to the backend with login credentials
    const response = await axios.post<LoginResponse>(`${API_URL}/login`, credentials);
    if (response.data.token) {
      setAuthToken(response.data.token); // Save the token to localStorage if login is successful
    }
    return response.data; // Return the backend response
  } catch (error) {
    console.error("Error logging in:", error);
    throw error; // Throw the error for further handling
  }
};

// API to log out the user
export const logoutUserAPI = async (): Promise<GeneralResponse> => {
  const token = getAuthToken(); // Retrieve the token from localStorage
  if (!token) throw new Error("No token found"); // Throw an error if no token is found

  try {
    // Send a POST request to the backend to log out
    const response = await axios.post(
      `${API_URL}/logout`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` }, // Include the token in the Authorization header
      }
    );
    removeAuthToken(); // Remove the token from localStorage after successful logout
    return response.data; // Return the backend response
  } catch (error) {
    console.error("Error logging out:", error);
    throw error; // Throw the error for further handling
  }
};

// API to fetch user information by username
export const getUserByUsernameAPI = async (username: string) => {
  try {
    // Send a GET request to fetch user details by username
    const response = await axios.get(`${API_URL}/users/${username}`);
    return response.data; // Return the backend response
  } catch (error) {
    console.error("Error fetching user by username:", error);
    throw error; // Throw the error for further handling
  }
};

// API to fetch all users
export const getAllUsersAPI = async () => {
  let token = getAuthToken(); // Get the token from localStorage
  if (!token) {
    // No token found, non-authenticated request to fetch all users
    token = " "; // Set an empty token for non-authenticated requests
  }
  try {
    const response = await axios.get(`${API_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` }, // Include token in Authorization header
    });
    console.log(response.data); 
    return response.data.users; // Return the data
  } catch (error) {
    console.error("Error fetching all users:", error);
    throw error; // Re-throw for further handling
  }
};

// API to update the user's secret phrase
export const updateSecretPhraseAPI = async (newSecretPhrase: {
  secret_phrase: string; // New secret phrase for the user
}) => {
  const token = getAuthToken(); // Retrieve the token from localStorage
  if (!token) throw new Error("No token found"); // Throw an error if no token is found
  try {
    // Send a POST request to update the user's secret phrase
    const response = await axios.post(
      `${API_URL}/update-secret-phrase`,
      newSecretPhrase,
      {
        headers: { Authorization: `Bearer ${token}` }, // Include the token in the Authorization header
      }
    );
    return response.data; // Return the backend response
  } catch (error) {
    console.error("Error updating secret phrase:", error);
    throw error; // Throw the error for further handling
  }
};
