"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Product = {
  id: string;
  name: string;
  sale_price: number;
  is_active: boolean;
  stock_qty: number;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function loadProducts() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("products")
      .select("id, name, sale_price, stock_qty, is_active")
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
    const parsedStock = stock.trim() === "" ? 0 : Number(stock.replace(",", "."));

    if (!name.trim() || Number.isNaN(parsedPrice) || parsedPrice < 0) {
      setErrorMessage("Escribe un nombre y un precio válido.");
      setIsSaving(false);
      return;
    }

    if (Number.isNaN(parsedStock) || parsedStock < 0) {
      setErrorMessage("El stock no es válido.");
      setIsSaving(false);
      return;
    }

    const supabase = createClient();
    const { error } = await supabase.from("products").insert({
      name: name.trim(),
      sale_price: parsedPrice,
      stock_qty: parsedStock,
    });

    setIsSaving(false);

    if (error) {
      setErrorMessage("No se pudo guardar el producto.");
      return;
    }

    setName("");
    setPrice("");
    setStock("");
    loadProducts();
  }

  async function handlePriceBlur(product: Product, rawValue: string) {
    const parsedPrice = Number(rawValue.replace(",", "."));
    if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
      setErrorMessage("Precio no válido.");
      return;
    }

    if (parsedPrice === Number(product.sale_price)) {
      return;
    }

    const supabase = createClient();
    const { error } = await supabase
      .from("products")
      .update({ sale_price: parsedPrice, updated_at: new Date().toISOString() })
      .eq("id", product.id);

    if (error) {
      setErrorMessage("No se pudo actualizar el precio.");
      return;
    }

    setErrorMessage("");
    loadProducts();
  }

  async function handleToggleActive(product: Product) {
    const supabase = createClient();
    const { error } = await supabase
      .from("products")
      .update({
        is_active: !product.is_active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", product.id);

    if (error) {
      setErrorMessage("No se pudo cambiar el estado.");
      return;
    }

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
        <input
          placeholder="Stock inicial"
          value={stock}
          onChange={(event) => setStock(event.target.value)}
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

      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {products.map((product) => (
          <li
            key={product.id}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 90px auto",
              gap: 8,
              alignItems: "center",
              padding: "12px 0",
              borderBottom: "1px solid #eed6dc",
              opacity: product.is_active ? 1 : 0.5,
            }}
          >
            <span>
              {product.name} ({Number(product.stock_qty)} disp.)
            </span>
            <input
              defaultValue={Number(product.sale_price).toFixed(2)}
              onBlur={(event) => handlePriceBlur(product, event.target.value)}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "6px 8px",
                border: "1px solid #eed6dc",
                borderRadius: 8,
              }}
            />
            <button
              type="button"
              onClick={() => handleToggleActive(product)}
              style={{
                padding: "6px 10px",
                border: "1px solid #eed6dc",
                borderRadius: 8,
                background: "#fff",
                cursor: "pointer",
              }}
            >
              {product.is_active ? "Desactivar" : "Activar"}
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}