import { useEffect, useState } from "react";
import { SignedIn, SignedOut, useUser, useAuth } from '@clerk/clerk-react';
import { SignIn } from '@clerk/clerk-react';
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { setAuthToken } from "../services/api";

export default function Auth({ setUser }) {
  const { isLoaded: authLoaded, getToken } = useAuth();
  const { isLoaded: userLoaded, isSignedIn, user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      if (!authLoaded || !userLoaded) return;
      if (!isSignedIn || !user) return;

      try {
        const token = await getToken();
        setAuthToken(token);
        const email = user.emailAddresses?.[0]?.emailAddress || user.primaryEmailAddress?.emailAddress || null;

        // Inform backend to create or fetch a mapped user
        try {
          const backendUser = await (await import('../services/api')).clerkUpsert({
            username: user.username || (email ? email.split('@')[0] : user.id),
            email,
            avatarUrl: user.imageUrl || null,
          });
          setUser(backendUser);
          localStorage.setItem("user", JSON.stringify(backendUser));
        } catch (err) {
          console.error("Backend upsert failed, using fallback", err);
          const appUser = {
            username: email ? email.split('@')[0] : user.id,
            email,
            avatarUrl: user.imageUrl || null,
            id: user.id,
          };
          setUser(appUser);
          localStorage.setItem("user", JSON.stringify(appUser));
        }

        toast.success("Signed in successfully!");
        // Give state update time to propagate before redirect
        setTimeout(() => navigate("/"), 500);
      } catch (err) {
        console.error("Auth error:", err);
        toast.error("Sign in failed");
      }
    };

    init();
  }, [authLoaded, userLoaded, isSignedIn, user, getToken, setUser, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 bg-black">
      <div className="w-full max-w-md">
        <SignedIn>
          <div className="text-center">
            <p className="text-gray-400">Completing sign-in...</p>
          </div>
        </SignedIn>
        <SignedOut>
          <SignIn
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-[#1a1a1a] border border-gray-800 rounded-2xl shadow-2xl",
                headerTitle: "text-3xl font-bold text-white",
                headerSubtitle: "text-gray-400 text-sm",
                socialButtonsBlockButton: "border border-gray-700 bg-gray-50 hover:bg-gray-100 text-black font-semibold",
                dividerLine: "bg-gray-700",
                dividerText: "text-gray-400 text-xs",
                formFieldLabel: "text-xs font-bold text-gray-500 uppercase tracking-wider",
                formFieldInput: "bg-[#111] border border-[#222] text-white rounded-lg focus:border-blue-500",
                formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold",
                footerActionLink: "text-blue-500 hover:text-blue-400",
              },
            }}
            redirectUrl="/"
          />
        </SignedOut>
      </div>
    </div>
  );
}