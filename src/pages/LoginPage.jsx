import React from "react";
import { Link, useNavigate } from "react-router";

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    navigate("/profile");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f8f7f4",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: "40px",
          borderRadius: "8px",
          border: "1px solid #dedbd4",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <Link
          to="/"
          style={{
            color: "#666",
            textDecoration: "none",
            fontSize: "14px",
            display: "block",
            marginBottom: "20px",
          }}
        >
          ← На головну
        </Link>
        <h1
          style={{ fontSize: "24px", marginBottom: "24px", color: "#1e272e" }}
        >
          Вхід в акаунт
        </h1>

        <form
          onSubmit={handleLogin}
          style={{ display: "flex", flexDirection: "column", gap: "16px" }}
        >
          <label
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              fontSize: "14px",
              color: "#666",
            }}
          >
            Електронна пошта
            <input
              type="email"
              placeholder="mail@example.com"
              required
              style={{
                padding: "12px",
                border: "1px solid #dedbd4",
                borderRadius: "4px",
                outline: "none",
              }}
            />
          </label>
          <label
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              fontSize: "14px",
              color: "#666",
            }}
          >
            Пароль
            <input
              type="password"
              placeholder="••••••••"
              required
              style={{
                padding: "12px",
                border: "1px solid #dedbd4",
                borderRadius: "4px",
                outline: "none",
              }}
            />
          </label>

          <button
            type="submit"
            style={{
              marginTop: "8px",
              padding: "12px",
              background: "#1e272e",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Увійти
          </button>
        </form>
      </div>
    </div>
  );
}
