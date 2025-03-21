import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  resetPasswordSchema,
  updatePasswordSchema,
} from "@/utils/validations/schema";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { url } from "@/utils/url";
import { Loader2 } from "lucide-react";

const ResetPassword = () => {
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const resetForm = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const updatePasswordForm = useForm<z.infer<typeof updatePasswordSchema>>({
    resolver: zodResolver(updatePasswordSchema),
  });

  const sendOTP = async (values: z.infer<typeof resetPasswordSchema>) => {
    setLoading(true);
    try {
      const savedUserResponse = await fetch(`${url}/auth/forgot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const forgotUser = await savedUserResponse.json();
      if (forgotUser) {
        toast.success("OTP Sent! Please check your mail");
        setIsOTPSent(true);
      }
    } catch (error) {
      console.error("Form submission error", error);
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (values: z.infer<typeof updatePasswordSchema>) => {
    setLoading(true);
    try {
      const savedUserResponse = await fetch(`${url}/auth/resetPassword`, {
        method: "POST",
        credentials: "include", // To send cookies
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const forgotUser = await savedUserResponse.json();

      if (savedUserResponse.status === 200) {
        toast.success(
          forgotUser.message ||
            "Password successfully changed! Login to continue"
        );
        updatePasswordForm.reset();
        navigate("/login");
      }
    } catch (error) {
      console.error("Form submission error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {!isOTPSent ? (
        <Form {...resetForm}>
          <form
            onSubmit={resetForm.handleSubmit(sendOTP)}
            className="space-y-8 max-w-3xl mx-auto py-10"
          >
            <FormField
              control={resetForm.control}
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
            <Button
              type="submit"
              className="w-full cursor-pointer rounded-full "
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5" />
                  Sending OTP...
                </>
              ) : (
                "Get Code on Email"
              )}
            </Button>
          </form>
        </Form>
      ) : (
        <Form {...updatePasswordForm}>
          <form
            onSubmit={updatePasswordForm.handleSubmit(verifyOTP)}
            className="space-y-8 max-w-3xl mx-auto py-10"
          >
            <FormField
              control={updatePasswordForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      disabled
                      type="email"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={updatePasswordForm.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Enter New Password"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={updatePasswordForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      placeholder="Confirm your password."
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={updatePasswordForm.control}
              name="OTP"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>One-Time Password</FormLabel>
                  <FormControl>
                    <InputOTP maxLength={6} {...field}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription>
                    Please enter the one-time password sent to your email.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full cursor-pointer rounded-full "
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5" />
                  Submiting...
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};

export default ResetPassword;
