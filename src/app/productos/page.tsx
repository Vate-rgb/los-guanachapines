"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Product = {
  id: string;
  name: string;
  sale_price: number;
  is_active: boolean;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function loadProducts() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("products")
      .select("id, name, sale_price, is_active")
      .order("name");

    if (error) {
      setErrorMessage("No se pudieron cargar los productos.");
      return;
    }

    setProducts(data ?? []);
  }

  useEffect(() => {
    loadProducts();
  }, []);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setErrorMessage("");
    setIsSaving(true);

    const parsedPrice = Number(price.replace(",", "."));
    if (!name.trim() || Number.isNaN(parsedPrice) || parsedPrice < 0) {
      setErrorMessage("Escribe un nombre y un precio valido.");
      setIsSaving(false);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.from("products").insert({
      name: name.trim(),
      sale_price: parsedPrice,
    });

    setIsSaving(false);

    if (error) {
      setErrorMessage("No se pudo guardar el producto.");
      return;
    }

    setName("");
    setPrice("");
    loadProducts();
  }

  return (
    <main style={{ maxWidth: 640, margin: "0 auto", padding: 24 }}>
      <p style={{ margin: "0 0 8px" }}>
        <Link href="/" style={{ color: "#9b4a62" }}>
          Volver
        </Link>
      </p>
      <h1 style={{ marginTop: 0 }}>Productos</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: 32 }}>
        <input
          placeholder="Nombre"
          value={name}
          onChange={(event) => setName(event.target.value)}
          style={{
            width: "100%",
            boxSizing: "border-box",
            marginBottom: 8,
            padding: "10px 12px",
            border: "1px solid #eed6dc",
            borderRadius: 8,
          }}
        />
        <input
          placeholder="Precio en quetzales"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
          style={{
            width: "100%",
            boxSizing: "border-box",
            marginBottom: 8,
            padding: "10px 12px",
            border: "1px solid #eed6dc",
            borderRadius: 8,
          }}
        />
        {errorMessage ? (
          <p style={{ color: "#b42318" }}>{errorMessage}</p>
        ) : null}
        <button
          type="submit"
          disabled={isSaving}
          style={{
            padding: "10px 16px",
            border: 0,
            borderRadius: 8,
            background: "#d47a94",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          {isSaving ? "Guardando..." : "Agregar"}
        </button>
      </form>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {products.map((product) => (
          <li
            key={product.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "12px 0",
              borderBottom: "1px solid #eed6dc",
            }}
          >
            <span>{product.name}</span>
            <span>Q{Number(product.sale_price).toFixed(2)}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}