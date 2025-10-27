// src/login.jsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import educationImg from "/books.svg";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import "./responsive.css";
import "./App.css";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { signIn, signInWithGoogle, signInWithFacebook } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error } = await signIn({ email, password });
      if (error) throw error;
    } catch (error) {
      // Handle error messages
      if (error.message.includes("Invalid login credentials")) {
        setError(
          "Sorry, your password was incorrect. Please double check your password."
        );
      } else if (error.message.includes("Email not confirmed")) {
        setError("Please verify your email address before logging in.");
      } else if (error.message.includes("User not found")) {
        setError(
          "No account found with this email address. Please sign up first."
        );
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await signInWithGoogle();
      if (error) throw error;
    } catch (error) {
      setError(error.message);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      const { error } = await signInWithFacebook();
      if (error) throw error;
    } catch (error) {
      setError(error.message);
    }
  };

  // Clear error
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) setError("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (error) setError("");
  };

  return (
    <>
      <div className="flex min-h-screen items-center justify-center md:justify-end">
        <div className="login-image">
          <img src={educationImg} alt="Login Visual" />
        </div>

        <div className="w-full md:w-1/2 flex items-center justify-center px-4">
          <Card className="w-full max-w-md md:max-w-md min-h-[500px] mt-8 md:mt-0 py-6">
            <CardHeader>
              <CardTitle className="text-center login">Login</CardTitle>
              <CardDescription className="text-center">
                Enter your email below to login to your account
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-5">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={handleEmailChange}
                      disabled={loading}
                      className={error ? "border-red-500" : ""}
                    />
                  </div>

                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                      <a
                        href="#"
                        className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      >
                        Forgot your password?
                      </a>
                    </div>

                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        required
                        className={`pr-10 ${error ? "border-red-500" : ""}`}
                        value={password}
                        onChange={handlePasswordChange}
                        disabled={loading}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-2 flex items-center"
                        onClick={() => setShowPassword((prev) => !prev)}
                        tabIndex={-1}
                        disabled={loading}
                      >
                        {showPassword ? (
                          <FaEyeSlash className="w-5 h-5" />
                        ) : (
                          <FaEye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {/* Display wrong password ni siya*/}
                    {error && (
                      <div className="text-red-700 px-[-3px] rounded text-sm">
                        <div className="flex items-center">{error}</div>
                      </div>
                    )}
                  </div>
                </div>

                <CardDescription className="text-left mt-4">
                  You don't have an account?
                  <Button variant="link" disabled={loading}>
                    <Link to="/signup" className="reg">
                      Sign Up
                    </Link>
                  </Button>
                </CardDescription>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing in..." : "Login"}
                </Button>
              </form>
            </CardContent>

            <CardFooter className="flex-col gap-2">
              <div className="flex items-center w-full mt-[-15px]">
                <hr className="flex-grow border-t border-gray-300" />
                <span className="mx-3 text-gray-500">OR</span>
                <hr className="flex-grow border-t border-gray-300" />
              </div>
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                <FcGoogle className="w-5 h-5" />
                Login with Google
              </Button>
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2 mt-2"
                onClick={handleFacebookLogin}
                disabled={loading}
              >
                <FaFacebook className="w-5 h-5 text-blue-600" />
                Login with Facebook
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  );
}
