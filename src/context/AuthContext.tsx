import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { auth, db, handleFirestoreError, OperationType } from "../firebase";
import { UserProfile } from "../types";

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  displayName: string;
  loading: boolean;
  error: string | null;
  isNameModalOpen: boolean;
  setIsNameModalOpen: (open: boolean) => void;
  updateDisplayName: (name: string) => Promise<void>;
  updateCoverConfig: (config: import("../types").CoverConfig) => Promise<void>;
  updateTheme: (themeId: import("../types").DiaryThemeId) => Promise<void>;
  updateAmbientSoundPreference: (enabled: boolean) => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isNameModalOpen, setIsNameModalOpen] = useState<boolean>(false);

  useEffect(() => {
    let profileUnsub: (() => void) | null = null;

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (profileUnsub) {
        profileUnsub();
        profileUnsub = null;
      }

      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);

        // Listen in real-time to user's private profile document
        profileUnsub = onSnapshot(
          userDocRef,
          (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data() as UserProfile;
              setUserProfile(data);
              // If user has not set a display name yet, prompt them gently
              if (!data.displayName || data.displayName.trim() === "") {
                setIsNameModalOpen(true);
              }
            } else {
              // Create initial user document if it doesn't exist
              const initialProfile: UserProfile = {
                id: currentUser.uid,
                email: currentUser.email || "user@journal.app",
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };
              setDoc(userDocRef, initialProfile, { merge: true }).catch((err) => {
                console.warn("Could not create initial user profile:", err);
              });
              setUserProfile(initialProfile);
              setIsNameModalOpen(true);
            }
          },
          (err) => {
            console.warn("User profile listener error:", err);
          }
        );
      } else {
        setUserProfile(null);
        setIsNameModalOpen(false);
      }
    });

    return () => {
      unsubscribe();
      if (profileUnsub) profileUnsub();
    };
  }, []);

  const updateDisplayName = async (name: string) => {
    if (!user) return;
    const cleanName = name.trim();
    if (!cleanName) return;

    const userDocPath = `users/${user.uid}`;
    try {
      await setDoc(
        doc(db, "users", user.uid),
        {
          id: user.uid,
          email: user.email || userProfile?.email || "",
          displayName: cleanName,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
      setUserProfile((prev) => (prev ? { ...prev, displayName: cleanName } : null));
      setIsNameModalOpen(false);
    } catch (err: any) {
      console.error("Failed to update display name:", err);
      handleFirestoreError(err, OperationType.WRITE, userDocPath);
    }
  };

  const updateCoverConfig = async (config: import("../types").CoverConfig) => {
    if (!user) return;
    const userDocPath = `users/${user.uid}`;
    try {
      await setDoc(
        doc(db, "users", user.uid),
        {
          id: user.uid,
          email: user.email || userProfile?.email || "",
          coverConfig: config,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
      setUserProfile((prev) => (prev ? { ...prev, coverConfig: config } : null));
    } catch (err: any) {
      console.error("Failed to update cover config:", err);
      handleFirestoreError(err, OperationType.WRITE, userDocPath);
    }
  };

  const updateTheme = async (themeId: import("../types").DiaryThemeId) => {
    if (!user) return;
    const currentConfig = userProfile?.coverConfig || {
      color: "cream",
      texture: "leather",
    };
    const newConfig = {
      ...currentConfig,
      themeId,
    };
    await updateCoverConfig(newConfig);
  };

  const updateAmbientSoundPreference = async (enabled: boolean) => {
    if (!user) return;
    const currentConfig = userProfile?.coverConfig || {
      color: "cream",
      texture: "leather",
    };
    const newConfig = {
      ...currentConfig,
      ambientSoundEnabled: enabled,
    };
    await updateCoverConfig(newConfig);
  };

  const signInWithEmail = async (email: string, pass: string) => {
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), pass);
    } catch (err: any) {
      let message = "Failed to sign in. Please verify your credentials.";
      if (
        err?.code === "auth/invalid-credential" ||
        err?.code === "auth/user-not-found" ||
        err?.code === "auth/wrong-password"
      ) {
        message = "Invalid email or password. Please try again.";
      } else if (err?.code === "auth/too-many-requests") {
        message = "Access temporarily disabled due to many failed attempts. Try again in a moment.";
      } else if (err?.message) {
        message = err.message;
      }
      setError(message);
      throw new Error(message);
    }
  };

  const signUpWithEmail = async (email: string, pass: string) => {
    setError(null);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      const userDocPath = `users/${cred.user.uid}`;
      try {
        await setDoc(doc(db, "users", cred.user.uid), {
          id: cred.user.uid,
          email: cred.user.email || email.trim(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, userDocPath);
      }
    } catch (err: any) {
      let message = "Failed to create account.";
      if (err?.code === "auth/email-already-in-use") {
        message = "An account with this email already exists. Try signing in instead.";
      } else if (err?.code === "auth/weak-password") {
        message = "Password should be at least 6 characters long.";
      } else if (err?.code === "auth/invalid-email") {
        message = "Please enter a valid email address.";
      } else if (err?.message) {
        message = err.message;
      }
      setError(message);
      throw new Error(message);
    }
  };

  const signInWithGoogle = async () => {
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      const userDocPath = `users/${cred.user.uid}`;
      try {
        await setDoc(
          doc(db, "users", cred.user.uid),
          {
            id: cred.user.uid,
            email: cred.user.email || "",
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, userDocPath);
      }
    } catch (err: any) {
      if (err?.code !== "auth/popup-closed-by-user") {
        setError(err?.message || "Google sign in failed.");
      }
    }
  };

  const logout = async () => {
    setError(null);
    try {
      await signOut(auth);
    } catch (err: any) {
      setError(err?.message || "Failed to log out.");
    }
  };

  const clearError = () => setError(null);

  // Friendly display name fallback: display name > Google display name > email username > "Friend"
  const computedDisplayName =
    userProfile?.displayName ||
    user?.displayName ||
    (user?.email ? user.email.split("@")[0] : "Friend");

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        displayName: computedDisplayName,
        loading,
        error,
        isNameModalOpen,
        setIsNameModalOpen,
        updateDisplayName,
        updateCoverConfig,
        updateTheme,
        updateAmbientSoundPreference,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
