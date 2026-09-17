import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
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
      <section
        style={{
          width: "100%",
          maxWidth: 420,
          background: "#fff",
          border: "1px solid #eed6dc",
          borderRadius: 16,
          padding: "40px 32px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 13,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#9b4a62",
          }}
        >
          Comedor
        </p>
        <h1
          style={{
            margin: "8px 0 12px",
            fontSize: 32,
            fontWeight: 650,
          }}
        >
          Los Guanachapines
        </h1>
        <p style={{ margin: 0, color: "#8a6f76", lineHeight: 1.5 }}>
          Sesion iniciada como {user.email}
        </p>
        <LogoutButton />
      </section>
    </main>
  );
}