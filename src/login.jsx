import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FcGoogle } from "react-icons/fc"
import { FaFacebook } from "react-icons/fa"
import { FaEye, FaEyeSlash } from "react-icons/fa"
import './App.css'

export default function login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <div className="flex min-h-[80vh] items-center justify-end">
        <div className="hidden md:block w-1/2 h-{full}">
          <img src="public/education.png" alt="Login Visual" className="object-cover w-full h-full" />
        </div>
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <Card className="w-full max-w-md min-h-[500px] mt-20 pt-15">
              <CardHeader>
                <CardTitle>Login to your account</CardTitle>
                <CardDescription>
                  Enter your email below to login to your account
                </CardDescription>
              </CardHeader>
            <CardContent>
              <form>
                <div className="flex flex-col gap-5">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      required
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
                        className="pr-10"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-2 flex items-center "
                        onClick={() => setShowPassword((prev) => !prev)}
                        tabIndex={-1}
                      >
                        {showPassword ? (
                          <FaEyeSlash className="w-5 h-5" />
                        ) : (
                          <FaEye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
              <CardDescription className="text-left mb-[-20px]">
                You don't have an account? 
                <Button variant="link">Sign Up</Button>
              </CardDescription>
            </CardContent>
            <CardFooter className="flex-col gap-2">
              <Button type="submit" className="w-full">
                Login
              </Button>
                <div className="flex items-center w-full my-2">
                  <hr className="flex-grow border-t border-gray-300" />
                    <span className="mx-3 text-gray-500">OR</span>
                  <hr className="flex-grow border-t border-gray-300" />
                </div>
              <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                <FcGoogle className="w-5 h-5" />
                  Login with Google
              </Button>
              <Button variant="outline" className="w-full flex items-center justify-center gap-2 mt-2">
                <FaFacebook className="w-5 h-5 text-blue-600" />
                  Login with Facebook
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  )
}