import { authClient, signIn, signUp } from "@/lib/auth-client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GoogleIcon from "../assets/google.png";
import { toast } from "sonner";
import { Link, useLocation } from "react-router-dom";

interface AuthFormProps {
  onSuccess?: () => void;
  mode: string;
  callbackURL?: string;
}

// type mode = "signup" | "signin";

const AuthForm = ({ onSuccess, mode }: AuthFormProps) => {
  // const [mode, setMode] = useState<mode>("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);


  const location = useLocation();
  const next = new URLSearchParams(location.search).get("next") || "/dashboard";
  const pack = new URLSearchParams(location.search).get("pack");
  const target = pack ? `${next}?pack=${pack}` : next;

  // Carries ?next=...&pack=... (or any other query string) across the
  // signup <-> login toggle, so a logged-out "Buy Pro" click doesn't lose
  // its destination just because the user has to switch forms first.
    const toggleTarget = `${mode === "signup" ? "/login" : "/signup"}${
      location.search
    }`;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result =
        mode === "signin"
          ? await signIn.email({ email, password })
          : await signUp.email({
              email,
              password,
              name: name || email.split("@")[0]!,
            });
      if (result.error) {
        setError(result.error.message ?? "Signup failed");
      } else {
        await authClient.getSession();
        console.log("session after getSession")
        toast.success("Successfully logged in");
        onSuccess?.();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    // Google's OAuth redirect leaves the SPA entirely, so query params
    // can't be recovered the way onSuccess() does for email/password.
    // Forward next/pack through callbackURL instead, and have the
    // /dashboard/billing route (or wherever callbackURL lands) read them.
    await authClient.signIn.social({
      provider: "google",
      callbackURL: `${window.location.origin}${target}`,
    });
  };
  return (
    <div className=" flex justify-center items-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>
            {mode === "signup"
              ? "Create your account"
              : "Login to your account"}
          </CardTitle>
          <CardDescription>
            {mode === "signup"
              ? "Already have an account? Sign in."
              : "Don't have an account? Sign up."}
          </CardDescription>
          <CardAction>
            <Button
              variant="link"
              render={
                <Link to={toggleTarget}>
                  {mode === "signup" ? "Sign in" : "Sign up"}
                </Link>
              }
            />
          </CardAction>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <div className="flex flex-col gap-6">
              {mode == "signup" && (
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="your@name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              )}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex-col mt-3 gap-2">
            <Button type="submit" className="w-full" disabled={loading}>
              {mode === "signup" ? "Sign up" : "Login"}
            </Button>
            <Button
              type="button"
              onClick={handleGoogleLogin}
              variant="outline"
              className="w-full"
            >
              Continue with Google
              <img src={GoogleIcon} className="w-4 h-4" alt="Google_Icon" />
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AuthForm;
