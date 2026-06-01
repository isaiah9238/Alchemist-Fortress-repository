'use client';
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase-config";

export default function FortressLogin() {
    const handleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const token = await result.user.getIdToken();
            
            // Send the token to our new API route
            await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token })
            });
            
            window.location.reload(); // Refresh to show "Unlocked" state
        } catch (error) {
            console.error("Login Failed:", error);
        }
    };

    return (
        <button onClick={handleLogin} className="neon-button">
            UNSEAL THE FORTRESS
        </button>
    );
}