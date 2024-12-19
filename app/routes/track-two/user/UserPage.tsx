import { useState, useEffect } from "react";
import LoginPage from "./LoginPage";
import UsersManagement from "./UsersManagement";
import { Button } from "~/components/ui/button";
import { loginUserAPI, logoutUserAPI } from "../../../lib/api";

const UserPage = () => {
  const [roles, setRoles] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoginPage, setIsLoginPage] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        setRoles(decodedToken.roles);
        setUsername(decodedToken.username);
      } catch (error) {
        console.error("Invalid token format:", error);
        localStorage.removeItem("authToken");
      }
    }
  }, []);

  const handleLogin = async (credentials: { username: string; secret_phrase: string }) => {
    setLoading(true);
    setError(null);
    try {
      const { token, roles } = await loginUserAPI(credentials);
      localStorage.setItem("authToken", token ?? "");
      setRoles(roles ?? null);
      setUsername(credentials.username);
    } catch (err) {
      setError("Login failed. Please check your credentials.");
      console.error("Error during login:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    setError(null);
    setIsLoginPage(false);
    try {
      await logoutUserAPI();
      localStorage.removeItem("authToken");
      setRoles(null);
      setUsername(null);
    } catch (err) {
      setError("Logout failed. Please try again.");
      console.error("Error during logout:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    if (!roles) {
      return isLoginPage ? (
        <div>
          <LoginPage onLogin={handleLogin} />
        </div>
      ) : (
        <div className="flex flex-col items-center w-full">
          <div className="flex-grow flex items-center justify-center w-full">
            <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
              <UsersManagement roles="non-authenticated" username="N/A" />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center w-full">
        <div className="flex-grow flex items-center justify-center w-full">
          <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
            <UsersManagement roles={roles} username={username ?? ""} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto flex flex-col items-center p-4">
      <header className="w-full mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold">User Management</h1>
        {!roles ? (
          <>
            {!isLoginPage && (
              <Button onClick={() => setIsLoginPage(true)} className="mt-4">
                Login
              </Button>
            )}
          </>
        ) : (
          roles && (
            <Button onClick={handleLogout} className="mb-4">
              Logout
            </Button>
          )
        )}
      </header>
      {renderContent()}
    </div>
  );
};

export default UserPage;
