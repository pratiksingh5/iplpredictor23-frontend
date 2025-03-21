import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Upload, Check } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Label } from "./ui/label";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { loginSchema, signUpSchema } from "@/utils/validations/schema";
import { url } from "@/utils/url";
import { useDispatch } from "react-redux";
import { Loader2 } from "lucide-react"; // Import Loader icon
import { setLogin } from "@/redux";

type LoginFormProps = {
  type: string;
};

interface LoginResponse {
  token?: string;
  user?: any;
  msg?: string;
}

export default function LoginForm({ type }: LoginFormProps) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  const registerForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
  });

  async function onLogin(values: z.infer<typeof loginSchema>): Promise<void> {
    setLoading(true); // Start loading
    try {
      const loggedInResponse = await fetch(`${url}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const loggedIn: LoginResponse = await loggedInResponse.json();

      if (loggedInResponse.ok) {
        if (loggedIn.token) {
          loginForm.reset();
          dispatch(
            setLogin({
              user: loggedIn.user,
              token: loggedIn.token,
            })
          );
          navigate("/predict");
          toast.success("Successfully logged In!");
        }
      } else {
        toast.error(loggedIn.msg || "Something went wrong");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      toast.error(errorMessage);
    } finally {
      setLoading(false); // Start loading
    }
  }

  async function onRegister(
    values: z.infer<typeof signUpSchema>
  ): Promise<void> {
    setLoading(true); // Start loading
    try {
      const savedUserResponse = await fetch(`${url}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!savedUserResponse.ok) {
        toast.error(savedUserResponse?.message || "Error registering user");
        throw new Error(savedUserResponse?.message || "Error registering user");
      }

      const savedUser = await savedUserResponse.json();
      registerForm.reset();
      if (savedUser) {
        navigate("/login");
        toast.success("Account created successfully!");
      }
    } catch (error: any) {
      console.error("Registration error:", error.message);

      toast.error("Error creating account. Please try again later.");
    } finally {
      setLoading(false); // Start loading
    }
  }

  const handleUpload = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);

    try {
      const res = await fetch(`${url}/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setImageUrl(data.imageUrl); // Store the uploaded image URL
      registerForm.setValue("picturePath", data.imageUrl);
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      {type === "login" && (
        <Form {...loginForm}>
          <form
            onSubmit={loginForm.handleSubmit(onLogin)}
            className="space-y-8 max-w-3xl mx-auto py-10 "
          >
            <FormField
              control={loginForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      className="border-primary"
                      type="email"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={loginForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      className="border-primary"
                      placeholder="Enter your password."
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full cursor-pointer rounded-full "
              disabled={loading} // Disable button when loading
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : "Login"}
            </Button>
            <Button
              type="button"
              className="w-full bg-transparent border-2 border-primary cursor-pointer rounded-full"
              onClick={() => navigate("/register")}
            >
              Register
            </Button>
          </form>
        </Form>
      )}

      {type === "register" && (
        <Form {...registerForm}>
          <form
            onSubmit={registerForm.handleSubmit(onRegister)}
            className="space-y-8 max-w-3xl mx-auto py-10"
          >
            <div className="flex flex-col gap-2">
              <FormLabel htmlFor="file-upload" className="text-sm font-medium">
                Upload Profile Picture
              </FormLabel>
              <Label
                htmlFor="file-upload"
                className="flex items-center justify-center gap-2 w-full p-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100 hover:text-black"
              >
                {imageUrl ? (
                  <>
                    <Check className="w-5 h-5 text-green-500" />
                    <span className="text-sm">Uploaded</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    <span className="text-sm">
                      {uploading ? "Uploading..." : "Upload"}
                    </span>
                  </>
                )}
              </Label>

              <Input
                id="file-upload"
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={(e) => handleUpload(e.target.files[0])}
              />
            </div>

            {/* Hidden Input to store image URL */}
            <FormField
              control={registerForm.control}
              name="picturePath"
              render={({ field }) => (
                <Input type="hidden" {...field} value={imageUrl} />
              )}
            />
            <FormField
              control={registerForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your Name"
                      type="text"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={registerForm.control}
              name="instaUsername"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Insta Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your Instagram username"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={registerForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      type="email"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={registerForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Enter your password."
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full cursor-pointer rounded-full "
              disabled={loading} // Disable button when loading
            >
              {loading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                "Register"
              )}
            </Button>
            <Button
              type="button"
              className="w-full bg-transparent border-2 border-primary cursor-pointer rounded-full"
              onClick={() => navigate("/login")}
            >
              Login
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}
