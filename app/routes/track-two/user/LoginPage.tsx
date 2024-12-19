import React, { useState } from "react";
import { loginUserAPI } from "../../../lib/api"; // API function to login
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "~/components/ui/card";
import { Button } from "~/components/ui/button";

interface LoginPageProps {
  readonly onLogin: (credentials: { username: string; secret_phrase: string }) => Promise<void>; // Callback to handle login with credentials
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState("");
  const [secretPhrase, setSecretPhrase] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);

    try {
      const response = await loginUserAPI({ username, secret_phrase: secretPhrase });

      if (response.success) {
        if (response.roles) {
          onLogin({ username, secret_phrase: secretPhrase }); // Pass the credentials to the parent
        } else {
          setError("User role is missing in the response.");
        }
      } else {
        setError(response.message || "Login failed. Please try again.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-full gradient">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Login</CardTitle>
            <CardDescription className="text-gray-600">Enter your credentials to access your account.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white placeholder-white"
              />
              <input
                type="password"
                placeholder="Secret Phrase"
                value={secretPhrase}
                onChange={(e) => setSecretPhrase(e.target.value)}
                className="input w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white placeholder-white"
              />
              {error && <p className="text-red-600 text-sm">{error}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button
              onClick={handleLogin}
              disabled={loading}
              className={`w-full py-2 rounded-md ${
                loading ? "bg-blue-400" : "bg-blue-500 hover:bg-blue-600"
              } text-white`}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
