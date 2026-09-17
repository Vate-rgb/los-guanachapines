"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      style={{
        marginTop: 24,
        padding: "10px 16px",
        border: "1px solid #eed6dc",
        borderRadius: 8,
        background: "#fff",
        color: "#3a2a2e",
        cursor: "pointer",
      }}
    >
      Salir
    </button>
  );
}