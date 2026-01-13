import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { User, onAuthStateChanged, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as firebaseSignOut, updateProfile } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";

interface AuthResult {
  error: Error | null;
  user?: User | null;
}

interface FirebaseAuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<AuthResult>;
  signInWithEmail: (email: string, password: string) => Promise<AuthResult>;
  signUpWithEmail: (email: string, password: string, username?: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
}

const FirebaseAuthContext = createContext<FirebaseAuthContextType | undefined>(undefined);

export const FirebaseAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async (): Promise<AuthResult> => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return { error: null, user: result.user };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signInWithEmail = async (email: string, password: string): Promise<AuthResult> => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return { error: null, user: result.user };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signUpWithEmail = async (email: string, password: string, username?: string): Promise<AuthResult> => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the user's display name with username if provided
      if (username && result.user) {
        await updateProfile(result.user, { displayName: username });
      }
      
      return { error: null, user: result.user };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  return (
    <FirebaseAuthContext.Provider
      value={{
        user,
        loading,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signOut,
      }}
    >
      {children}
    </FirebaseAuthContext.Provider>
  );
};

export const useFirebaseAuth = () => {
  const context = useContext(FirebaseAuthContext);
  if (context === undefined) {
    throw new Error("useFirebaseAuth must be used within a FirebaseAuthProvider");
  }
  return context;
};
