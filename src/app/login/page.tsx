"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setIsSubmitting(false);

    if (error) {
      setErrorMessage("Correo o contrasena incorrectos.");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: 380,
          background: "#fff",
          border: "1px solid #eed6dc",
          borderRadius: 16,
          padding: 32,
        }}
      >
        <h1 style={{ margin: "0 0 8px", fontSize: 24 }}>Los Guanachapines</h1>
        <p style={{ margin: "0 0 24px", color: "#8a6f76" }}>Iniciar sesion</p>

        <label style={{ display: "block", marginBottom: 6, fontSize: 14 }}>
          Correo
        </label>
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
          style={{
            width: "100%",
            boxSizing: "border-box",
            marginBottom: 16,
            padding: "10px 12px",
            border: "1px solid #eed6dc",
            borderRadius: 8,
          }}
        />

        <label style={{ display: "block", marginBottom: 6, fontSize: 14 }}>
          Contrasena
        </label>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          style={{
            width: "100%",
            boxSizing: "border-box",
            marginBottom: 16,
            padding: "10px 12px",
            border: "1px solid #eed6dc",
            borderRadius: 8,
          }}
        />

        {errorMessage ? (
          <p style={{ color: "#b42318", fontSize: 14 }}>{errorMessage}</p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            width: "100%",
            marginTop: 8,
            padding: "12px 16px",
            border: 0,
            borderRadius: 8,
            background: "#d47a94",
            color: "#fff",
            fontSize: 16,
            cursor: "pointer",
          }}
        >
          {isSubmitting ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </main>
  );
}