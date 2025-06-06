"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/auth-context";
import { Loader2, Film, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("signin");
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (type: "signin" | "signup") => {
    if (!email || !password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    // Password validation
    if (password.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      if (type === "signin") {
        await signIn(email, password);
        toast({
          title: "Welcome back!",
          description: "You have been signed in successfully",
        });
      } else {
        await signUp(email, password);
        toast({
          title: "Account Created!",
          description: "Your account has been created successfully",
        });
      }

      // Redirect to main app
      router.push("/");
    } catch (error: any) {
      toast({
        title: type === "signin" ? "Sign In Failed" : "Sign Up Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      toast({
        title: "Welcome!",
        description: "You have been signed in with Google successfully",
      });
      router.push("/");
    } catch (error: any) {
      toast({
        title: "Google Sign In Failed",
        description: error.message || "Failed to sign in with Google",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const useTestCredentials = () => {
    setEmail("test@movieapp.com");
    setPassword("testuser123");
    setActiveTab("signin");
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://i.pinimg.com/736x/04/8f/87/048f8798ccbc166f4da70df02bf9c298.jpg')",
        }}
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary/30 rounded-full animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-blue-400/40 rounded-full animate-pulse delay-1000" />
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-purple-400/30 rounded-full animate-pulse delay-500" />
      </div>

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-4 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30 soft-shadow-lg">
              <Film className="h-12 w-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">CinemaHub</h1>
          <p className="text-white/80 text-lg">
            Your gateway to endless entertainment
          </p>
        </div>

        <Card className="w-full bg-black/40 backdrop-blur-md border border-white/20 soft-shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-white text-2xl">Welcome</CardTitle>
            <CardDescription className="text-white/70">
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>

          {/* Demo Info Banner */}
          <div className="bg-gradient-to-r from-green-900/50 to-blue-900/50 backdrop-blur-sm mx-6 p-4 rounded-lg border border-green-400/30">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-green-200 text-sm mb-1">
                  Demo Mode
                </p>
                <p className="text-green-300/80 text-xs mb-2">
                  Fill in any valid email and password (6+ characters) to access
                  the app!
                </p>
                <div className="text-xs text-green-300 space-y-1">
                  <p>
                    <strong>Example:</strong> test@movieapp.com
                  </p>
                  <p>
                    <strong>Password:</strong> testuser123
                  </p>
                </div>
                <button
                  type="button"
                  className="text-green-300 underline text-xs mt-2 hover:text-green-200 transition-colors"
                  onClick={useTestCredentials}
                >
                  Use example credentials
                </button>
              </div>
            </div>
          </div>

          <CardContent className="pt-4">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 bg-white/10 backdrop-blur-sm">
                <TabsTrigger
                  value="signin"
                  className="data-[state=active]:bg-primary data-[state=active]:text-white text-white/70"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger
                  value="signup"
                  className="data-[state=active]:bg-primary data-[state=active]:text-white text-white/70"
                >
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signin" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/10 backdrop-blur-sm border-white/30 text-white placeholder:text-white/50 focus:border-primary focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/10 backdrop-blur-sm border-white/30 text-white placeholder:text-white/50 focus:border-primary focus:ring-primary/20"
                  />
                </div>
                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-white font-medium"
                  onClick={() => handleSubmit("signin")}
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign In
                </Button>
              </TabsContent>

              <TabsContent value="signup" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-white">
                    Email
                  </Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/10 backdrop-blur-sm border-white/30 text-white placeholder:text-white/50 focus:border-primary focus:ring-primary/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-white">
                    Password
                  </Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Create a password (min. 6 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/10 backdrop-blur-sm border-white/30 text-white placeholder:text-white/50 focus:border-primary focus:ring-primary/20"
                  />
                </div>
                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-white font-medium"
                  onClick={() => handleSubmit("signup")}
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Account
                </Button>
              </TabsContent>
            </Tabs>

            <div className="my-4 flex justify-center text-xs uppercase">
              <span className="px-2 text-white/70">Or continue with</span>
            </div>

            <Button
              variant="outline"
              className="w-full bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 hover:text-white"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {/* Google icon as image */}
              <img
                src="https://i.pinimg.com/736x/89/73/d4/8973d4473f428cb78cca39f82c15af3e.jpg"
                alt="Google"
                className="mr-2 h-4 w-4 rounded-full object-cover"
                width={16}
                height={16}
              />
              Continue with Google
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
