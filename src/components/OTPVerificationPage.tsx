import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { ShieldCheck, Mail } from "lucide-react";
import { REGEXP_ONLY_DIGITS } from "input-otp"


// Form validation schema
const otpSchema = z.object({
  otp: z.string().min(6, "OTP must be 6 digits").max(6, "OTP must be 6 digits"),
});

type OTPFormValues = z.infer<typeof otpSchema>;

export function OTPVerificationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isResending, setIsResending] = useState(false);
  
  // Get email from navigation state (passed from registration page)
  const email = location.state?.email || "your email";

  const form = useForm<OTPFormValues>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const onSubmit = (data: OTPFormValues) => {
    console.log("OTP data:", data);
    // Here you would typically verify the OTP with your backend API
    toast.success("Email verified successfully!", {
      description: "Your account has been verified. Please login to continue.",
    });
    // After successful verification, navigate to login
    setTimeout(() => navigate("/login"), 1500);
  };

  const handleResendOTP = () => {
    setIsResending(true);
    // Here you would typically call your backend to resend OTP
    console.log("Resending OTP to:", email);
    setTimeout(() => {
      setIsResending(false);
      toast.success("Code resent!", {
        description: "A new verification code has been sent to your email.",
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">Verify Your Email</CardTitle>
          <CardDescription className="text-base">
            We've sent a 6-digit verification code to
            <div className="flex items-center justify-center gap-2 mt-2 text-foreground font-medium">
              <Mail className="w-4 h-4" />
              {email}
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* OTP Field */}
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center">
                    <FormLabel>Enter Verification Code</FormLabel>
                    <FormControl>
                      <InputOTP maxLength={6} {...field} pattern={REGEXP_ONLY_DIGITS}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSeparator />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormDescription>
                      Please enter the 6-digit code sent to your email
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full h-11 text-base font-semibold cursor-pointer">
                Verify Email
              </Button>

              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Didn't receive the code?
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleResendOTP}
                  disabled={isResending}
                  className="text-primary hover:text-primary/80 cursor-pointer"
                >
                  {isResending ? "Sending..." : "Resend Code"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
