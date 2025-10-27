// src/signup.jsx
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./App.css";
import { Link } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("student");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { signUp, signInWithGoogle, signInWithFacebook } = useAuth();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const { data, error } = await signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            role: role,
          },
        },
      });

      if (error) throw error;

      // Show success message - user is automatically logged in
      if (data.user) {
        setSuccess("Account created successfully! Redirecting...");
        // The user will be automatically redirected by AuthContext
      }
    } catch (error) {
      // Handle specific error messages
      if (error.message.includes("User already registered")) {
        setError("An account with this email already exists.");
      } else if (
        error.message.includes("Password should be at least 6 characters")
      ) {
        setError("Password must be at least 6 characters long.");
      } else if (error.message.includes("Invalid email")) {
        setError("Please enter a valid email address.");
      } else {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const { error } = await signInWithGoogle();
      if (error) throw error;
    } catch (error) {
      setError(error.message);
    }
  };

  const handleFacebookSignup = async () => {
    try {
      const { error } = await signInWithFacebook();
      if (error) throw error;
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <Card className="w-full max-w-sm shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold tracking-tight">
            StudySpot
          </CardTitle>
          <CardDescription className="text-center text-md">
            Create a new account to see places and study with your friends.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="grid gap-4">
            {success && (
              <div className="bg-green-100 text-green-700 p-3 rounded-md text-sm border border-green-300">
                {success}
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="name">Username</Label>
              <Input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                disabled={loading}
                placeholder="Enter your username"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>

              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                placeholder="Enter your email"
                className={error ? "border-red-500" : ""}
              />
              {/*Display message email */}
              {error && (
                <div className="text-red-700 text-sm ">
                  <div className="flex items-center">{error}</div>
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className={`pr-10 ${error ? "border-red-500" : ""}`}
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Create a password"
                  minLength="6"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-2 flex items-center text-gray-600 hover:text-gray-800"
                  disabled={loading}
                >
                  {showPassword ? (
                    <FaEyeSlash className="w-5 h-5" />
                  ) : (
                    <FaEye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500">
                Password must be at least 6 characters
              </p>
            </div>

            <div className="grid gap-2">
              <Label>Role</Label>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-between text-gray-700"
                    disabled={loading}
                  >
                    {role === "library_staff"
                      ? "Library Staff"
                      : role.charAt(0).toUpperCase() + role.slice(1)}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>Select your role</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup value={role} onValueChange={setRole}>
                    <DropdownMenuRadioItem value="student">
                      Student
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="teacher">
                      Teacher
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="library_staff">
                      Library Staff
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>

          <CardDescription className="m-[-4px] text-left px-7">
            Already have an account?
            <Button variant="link" disabled={loading}>
              <Link to="/login" className="reg">
                Sign In
              </Link>
            </Button>
          </CardDescription>

          <CardFooter className="flex flex-col space-y-3">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </Button>
            <div className="flex items-center w-full">
              <div className="flex-grow border-t border-gray-300" />
              <span className="mx-3 text-sm text-gray-500">OR</span>
              <div className="flex-grow border-t border-gray-300" />
            </div>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={handleGoogleSignup}
              disabled={loading}
            >
              <FcGoogle className="w-5 h-5" />
              Continue with Google
            </Button>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
              onClick={handleFacebookSignup}
              disabled={loading}
            >
              <FaFacebook className="w-5 h-5 text-blue-600" />
              Continue with Facebook
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default Signup;
