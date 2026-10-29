import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";

export function formatPrice(price) {
  return `${price.toLocaleString("uk-UA")} ₴`;
}

export const CartContext = React.createContext();

export default function StorefrontShell({ children }) {
  const [user, setUser] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState("cart");
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("superfurn_cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    deliveryMethod: "nova_poshta",
    paymentMethod: "card",
  });

  useEffect(() => {
    const savedUser = localStorage.getItem("superFurnUser");
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("superfurn_cart", JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item,
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setCartOpen(true);
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

  const handleOrderSubmit = (e) => {
    e.preventDefault();
    const newOrder = {
      id: "SF-" + Math.floor(1000 + Math.random() * 9000),
      date: new Date().toISOString().split("T")[0],
      total: totalPrice,
      status: "В обробці",
      items: cart.map((item) => `${item.name} (${item.qty} шт.)`),
      delivery: formData.deliveryMethod,
      payment: formData.paymentMethod,
      address: formData.address,
    };

    try {
      const existingOrders = JSON.parse(
        localStorage.getItem("superfurn_orders") || "[]",
      );
      localStorage.setItem(
        "superfurn_orders",
        JSON.stringify([newOrder, ...existingOrders]),
      );
    } catch (err) {
      console.error(err);
    }

    setCheckoutStep("success");
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ addToCart, cart, setCartOpen }}>
      <div
        className="site-wrapper"
        style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      >
        <header
          className="header"
          style={{ background: "#1c272e", color: "#fff", padding: "16px 0" }}
        >
          <div
            className="container"
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              padding: "0 20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Link
              to="/"
              className="logo"
              style={{
                color: "#fff",
                textDecoration: "none",
                fontSize: "24px",
                fontWeight: "bold",
              }}
            >
              Super<span style={{ color: "#c49f60" }}>Furn</span>
            </Link>

            <nav className="nav-menu" style={{ display: "flex", gap: "20px" }}>
              <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>
                Головна
              </Link>
              <Link
                to="/inspiration"
                style={{ color: "#fff", textDecoration: "none" }}
              >
                Натхнення
              </Link>
              <a
                href="/#catalog"
                style={{ color: "#fff", textDecoration: "none" }}
              >
                Каталог
              </a>
            </nav>

            <div
              className="user-panel"
              style={{ display: "flex", alignItems: "center", gap: "16px" }}
            >
              <button
                onClick={() => {
                  setCartOpen(true);
                  setCheckoutStep("cart");
                }}
                style={{
                  background: "transparent",
                  border: "1px solid #c49f60",
                  color: "#fff",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                Кошик ({totalItems})
              </button>
              {user ? (
                <Link
                  to="/profile"
                  style={{
                    color: "#c49f60",
                    textDecoration: "none",
                    fontWeight: "500",
                  }}
                >
                  {user}
                </Link>
              ) : (
                <Link
                  to="/sign-in"
                  style={{
                    padding: "6px 16px",
                    background: "#c49f60",
                    color: "#1c272e",
                    borderRadius: "4px",
                    textDecoration: "none",
                    fontWeight: "600",
                  }}
                >
                  Увійти
                </Link>
              )}
            </div>
          </div>
        </header>

        <main style={{ flex: "1" }}>{children}</main>

        <footer
          id="contacts"
          style={{
            background: "#11181c",
            color: "#aaa",
            padding: "40px 0",
            marginTop: "auto",
          }}
        >
          <div
            className="container"
            style={{
              maxWidth: "1200px",
              margin: "0 auto",
              padding: "0 20px",
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "20px",
            }}
          >
            <div>
              <h4 style={{ color: "#fff", marginBottom: "12px" }}>SuperFurn</h4>
              <p>Твій комфорт в наших руках.</p>
            </div>
            <div>
              <h4 style={{ color: "#fff", marginBottom: "12px" }}>Контакти</h4>
              <p>+38 (099) 123-45-67</p>
              <p>romansushko17@gmail.com</p>
            </div>
            <div>
              <h4 style={{ color: "#fff", marginBottom: "12px" }}>Адреса</h4>
              <p>Болехівці, Дрогобицький район, Львівська область</p>
            </div>
          </div>
        </footer>

        {cartOpen && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 100,
              background: "rgba(0,0,0,0.4)",
              display: "flex",
              justifyContent: "flex-end",
            }}
            onClick={() => setCartOpen(false)}
          >
            <div
              style={{
                width: "420px",
                background: "#fff",
                height: "100%",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                boxSizing: "border-box",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "20px",
                }}
              >
                <h2 style={{ fontSize: "20px", margin: 0 }}>Ваш кошик</h2>
                <button
                  onClick={() => setCartOpen(false)}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "18px",
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              </div>

              {checkoutStep === "cart" &&
                (cart.length === 0 ? (
                  <div style={{ textAlign: "center", marginTop: "40px" }}>
                    <p style={{ color: "#666" }}>Кошик порожній</p>
                    <button
                      onClick={() => setCartOpen(false)}
                      style={{
                        padding: "10px 20px",
                        background: "#c49f60",
                        color: "#1c272e",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontWeight: "bold",
                      }}
                    >
                      До покупок
                    </button>
                  </div>
                ) : (
                  <>
                    <div
                      style={{
                        flex: 1,
                        overflowY: "auto",
                        display: "flex",
                        flexDirection: "column",
                        gap: "12px",
                      }}
                    >
                      {cart.map((item) => (
                        <div
                          key={item.id}
                          style={{
                            display: "flex",
                            gap: "12px",
                            borderBottom: "1px solid #eee",
                            paddingBottom: "12px",
                          }}
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            style={{
                              width: "60px",
                              height: "60px",
                              objectFit: "cover",
                              borderRadius: "4px",
                            }}
                          />
                          <div style={{ flex: 1 }}>
                            <h4
                              style={{ fontSize: "14px", margin: "0 0 4px 0" }}
                            >
                              {item.name}
                            </h4>
                            <p
                              style={{
                                fontSize: "13px",
                                color: "#666",
                                margin: "0 0 8px 0",
                              }}
                            >
                              {formatPrice(item.price)} × {item.qty}
                            </p>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              style={{
                                background: "none",
                                border: "none",
                                color: "#d9534f",
                                fontSize: "12px",
                                cursor: "pointer",
                                padding: 0,
                              }}
                            >
                              Видалити
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div
                      style={{
                        borderTop: "1px solid #eee",
                        paddingTop: "16px",
                        marginTop: "16px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "16px",
                          fontSize: "16px",
                        }}
                      >
                        <span>Разом:</span>
                        <strong>{formatPrice(totalPrice)}</strong>
                      </div>
                      <button
                        onClick={() => setCheckoutStep("form")}
                        style={{
                          width: "100%",
                          padding: "12px",
                          background: "#1c272e",
                          color: "#fff",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                      >
                        Оформити замовлення
                      </button>
                    </div>
                  </>
                ))}

              {checkoutStep === "form" && (
                <form
                  onSubmit={handleOrderSubmit}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    flex: 1,
                    overflowY: "auto",
                  }}
                >
                  <p style={{ fontSize: "14px", color: "#666", margin: 0 }}>
                    Вкажіть дані для доставки:
                  </p>

                  <label
                    style={{
                      fontSize: "13px",
                      color: "#444",
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                    }}
                  >
                    Імя&apos;:
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      style={{
                        padding: "8px",
                        border: "1px solid #dedbd4",
                        borderRadius: "4px",
                      }}
                    />
                  </label>

                  <label
                    style={{
                      fontSize: "13px",
                      color: "#444",
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                    }}
                  >
                    Телефон:
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      style={{
                        padding: "8px",
                        border: "1px solid #dedbd4",
                        borderRadius: "4px",
                      }}
                    />
                  </label>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "6px",
                    }}
                  >
                    <label style={{ fontSize: "13px", color: "#444" }}>
                      Спосіб доставки:
                    </label>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(3, 1fr)",
                        gap: "8px",
                      }}
                    >
                      {[
                        { id: "nova_poshta", title: "Нова Пошта" },
                        { id: "meest", title: "Meest" },
                        { id: "pickup", title: "Самовивіз" },
                      ].map((method) => (
                        <div
                          key={method.id}
                          onClick={() =>
                            setFormData({
                              ...formData,
                              deliveryMethod: method.id,
                            })
                          }
                          style={{
                            padding: "10px 6px",
                            border: `2px solid ${formData.deliveryMethod === method.id ? "#c49f60" : "#dedbd4"}`,
                            borderRadius: "6px",
                            textAlign: "center",
                            cursor: "pointer",
                            background:
                              formData.deliveryMethod === method.id
                                ? "#fcf8f2"
                                : "#fff",
                            fontSize: "12px",
                            fontWeight:
                              formData.deliveryMethod === method.id
                                ? "bold"
                                : "normal",
                            color: "#1c272e",
                          }}
                        >
                          {method.title}
                        </div>
                      ))}
                    </div>
                  </div>

                  <label
                    style={{
                      fontSize: "13px",
                      color: "#444",
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                    }}
                  >
                    Адреса / відділення:
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      style={{
                        padding: "8px",
                        border: "1px solid #dedbd4",
                        borderRadius: "4px",
                      }}
                    />
                  </label>

                  <label
                    style={{
                      fontSize: "13px",
                      color: "#444",
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                    }}
                  >
                    Спосіб оплати:
                    <select
                      value={formData.paymentMethod}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          paymentMethod: e.target.value,
                        })
                      }
                      style={{
                        padding: "8px",
                        border: "1px solid #dedbd4",
                        borderRadius: "4px",
                      }}
                    >
                      <option value="card">Карткою онлайн</option>
                      <option value="cash">При отриманні</option>
                    </select>
                  </label>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      margin: "8px 0",
                      fontSize: "16px",
                    }}
                  >
                    <span>До сплати:</span>
                    <strong>{formatPrice(totalPrice)}</strong>
                  </div>

                  <button
                    type="submit"
                    style={{
                      width: "100%",
                      padding: "12px",
                      background: "#1c272e",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    Підтвердити замовлення
                  </button>
                  <button
                    type="button"
                    onClick={() => setCheckoutStep("cart")}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#666",
                      cursor: "pointer",
                      fontSize: "13px",
                    }}
                  >
                    Назад до кошика
                  </button>
                </form>
              )}

              {checkoutStep === "success" && (
                <div
                  style={{
                    textAlign: "center",
                    marginTop: "40px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  <h3 style={{ margin: 0, color: "#2e7d32" }}>
                    Замовлення успішно оформлено!
                  </h3>
                  <p style={{ fontSize: "14px", color: "#666", margin: 0 }}>
                    Дякуємо за покупку. Дані збережено у вашому профілі.
                  </p>
                  <button
                    onClick={() => {
                      setCartOpen(false);
                      setCheckoutStep("cart");
                    }}
                    style={{
                      padding: "10px 20px",
                      background: "#c49f60",
                      color: "#1c272e",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontWeight: "bold",
                    }}
                  >
                    Продовжити покупки
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </CartContext.Provider>
  );
}
