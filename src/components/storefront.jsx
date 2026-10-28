import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { Link, useLocation } from "react-router-dom";
import "./storefront.css";

const products = [
  {
    id: 1,
    title: "Крісло Royal Velvet",
    price: 5600,
    image:
      "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=900&q=85",
    category: "Вітальня",
  },
  {
    id: 2,
    title: "Диван Scandi Gray",
    price: 15900,
    image:
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=900&q=85",
    category: "Вітальня",
  },
  {
    id: 3,
    title: "Торшер Industrial",
    price: 2400,
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=900&q=85",
    category: "Освітлення",
  },
  {
    id: 4,
    title: "Стіл Oak Wood",
    price: 8900,
    image:
      "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=900&q=85",
    category: "Столи",
  },
  {
    id: 5,
    title: "Ліжко King Size",
    price: 22000,
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=900&q=85",
    category: "Спальня",
  },
  {
    id: 6,
    title: "Ваза Ceramic Art",
    price: 1200,
    image:
      "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=900&q=85",
    category: "Декор",
  },
];

const StoreContext = createContext(null);

export function useStorefront() {
  const value = useContext(StoreContext);
  if (!value) {
    throw new Error("Storefront components must be inside StorefrontShell");
  }
  return value;
}

export function StorefrontShell({ children }) {
  const [cart, setCart] = useState([]);
  const [cartReady, setCartReady] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderTotal, setOrderTotal] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const savedCart = window.localStorage.getItem("superFurnCart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch {
        window.localStorage.removeItem("superFurnCart");
      }
    }
    setCartReady(true);
  }, []);

  useEffect(() => {
    if (cartReady) {
      window.localStorage.setItem("superFurnCart", JSON.stringify(cart));
    }
  }, [cart, cartReady]);

  useEffect(() => {
    setCartOpen(false);
    setCheckout(false);
    setOrderPlaced(false);
  }, [location.pathname]);

  const value = useMemo(
    () => ({
      cart,
      addToCart: (product) =>
        setCart((current) =>
          current.some((item) => item.id === product.id)
            ? current
            : [...current, product],
        ),
      removeFromCart: (id) =>
        setCart((current) => current.filter((item) => item.id !== id)),
      openCart: () => {
        setOrderPlaced(false);
        setCartOpen(true);
      },
    }),
    [cart],
  );

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  function submitOrder(event) {
    event.preventDefault();
    setOrderTotal(total);
    setCart([]);
    setCheckout(false);
    setOrderPlaced(true);
  }

  return (
    <StoreContext.Provider value={value}>
      <div className="storefront">
        <StoreHeader />
        <main>{children}</main>
        <StoreFooter />

        {cartOpen && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 100,
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              justifyContent: "flex-end",
            }}
            onClick={() => {
              setCartOpen(false);
              setCheckout(false);
            }}
          >
            <div
              style={{
                width: "420px",
                maxWidth: "100%",
                background: "#fff",
                height: "100%",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                boxSizing: "border-box",
                overflowY: "auto",
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
                <h2
                  style={{ fontSize: "20px", margin: 0, fontFamily: "serif" }}
                >
                  {checkout
                    ? "Оформлення замовлення"
                    : orderPlaced
                      ? "Замовлення"
                      : "Ваш кошик"}
                </h2>
                <button
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "20px",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setCartOpen(false);
                    setOrderPlaced(false);
                  }}
                >
                  ×
                </button>
              </div>

              {orderPlaced ? (
                <div style={{ textAlign: "center", marginTop: "40px" }}>
                  <span
                    style={{
                      fontSize: "48px",
                      color: "#2e7d32",
                      display: "block",
                      marginBottom: "16px",
                    }}
                  >
                    ✓
                  </span>
                  <h3>Дякуємо за замовлення</h3>
                  <p>До сплати: {formatPrice(orderTotal)}</p>
                  <button
                    className="store-button store-button-dark"
                    type="button"
                    onClick={() => {
                      setCartOpen(false);
                      setOrderPlaced(false);
                    }}
                  >
                    Продовжити покупки
                  </button>
                </div>
              ) : checkout ? (
                <form className="store-checkout" onSubmit={submitOrder}>
                  <label>
                    Ім'я та Прізвище
                    <input name="name" autoComplete="name" required />
                  </label>
                  <label>
                    Номер телефону
                    <input
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      required
                    />
                  </label>
                  <label>
                    Місто та відділення НП / Адреса
                    <input
                      name="address"
                      autoComplete="street-address"
                      required
                    />
                  </label>
                  <div className="checkout-total">
                    <span>Разом</span>
                    <strong>{formatPrice(total)}</strong>
                  </div>
                  <p className="checkout-note">Оплата при отриманні</p>
                  <button
                    className="store-button store-button-dark"
                    type="submit"
                  >
                    Підтвердити замовлення
                  </button>
                  <button
                    className="text-button"
                    type="button"
                    onClick={() => setCheckout(false)}
                  >
                    Повернутися до кошика
                  </button>
                </form>
              ) : cart.length === 0 ? (
                <div style={{ textAlign: "center", marginTop: "40px" }}>
                  <p style={{ color: "#666" }}>Кошик порожній</p>
                  <button
                    className="store-button store-button-dark"
                    type="button"
                    onClick={() => setCartOpen(false)}
                  >
                    Продовжити покупки
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
                          alt={item.title}
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "cover",
                            borderRadius: "4px",
                          }}
                        />
                        <div style={{ flex: 1 }}>
                          <h3 style={{ fontSize: "14px", margin: "0 0 4px 0" }}>
                            {item.title}
                          </h3>
                          <p
                            style={{
                              fontSize: "13px",
                              color: "#666",
                              margin: "0 0 8px 0",
                            }}
                          >
                            {formatPrice(item.price)}
                          </p>
                          <button
                            style={{
                              background: "none",
                              border: "none",
                              color: "#d9534f",
                              fontSize: "12px",
                              cursor: "pointer",
                              padding: 0,
                            }}
                            type="button"
                            onClick={() => value.removeFromCart(item.id)}
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
                      <strong>{formatPrice(total)}</strong>
                    </div>
                    <button
                      className="store-button store-button-dark"
                      type="button"
                      onClick={() => setCheckout(true)}
                    >
                      Оформити замовлення
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </StoreContext.Provider>
  );
}

function StoreHeader() {
  const { cart, openCart } = useStorefront();
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const savedUser = localStorage.getItem("superFurnUser") || "Роман Сушко";

  return (
    <header className="store-header">
      <div className="store-header-inner">
        <Link className="store-logo" to="/" aria-label="SuperFurn — Головна">
          <span className="store-logo-mark">S</span>
          <span>
            Super<span className="logo-gold">Furn</span>
          </span>
        </Link>
        <nav className="store-nav" aria-label="Основна навігація">
          <Link className={isHome ? "active" : ""} to="/">
            Головна
          </Link>
          <Link to={isHome ? "#catalog" : "/#catalog"}>Каталог</Link>
          <Link
            className={pathname === "/inspiration" ? "active" : ""}
            to="/inspiration"
          >
            Ідеї для дому
          </Link>
          <Link to={isHome ? "#contacts" : "/#contacts"}>Контакти</Link>
        </nav>
        <div className="store-header-actions">
          <button
            className="store-cart-trigger"
            type="button"
            onClick={openCart}
            aria-label={`Ваш кошик, ${cart.length} товарів`}
          >
            Кошик <span>{cart.length}</span>
          </button>
          <Link className="store-account" to="/profile">
            {savedUser}
          </Link>
        </div>
      </div>
    </header>
  );
}

function StoreFooter() {
  return (
    <footer className="store-footer" id="contacts">
      <div className="store-footer-inner">
        <div>
          <h2>SuperFurn</h2>
          <p>Твій комфорт в наших руках.</p>
        </div>
        <div>
          <h3>Контакти</h3>
          <p>+38 (099) 123-45-67</p>
          <p>romansushko17@gmail.com</p>
        </div>
        <div>
          <h3>Адреса</h3>
          <p>Болехівці, Дрогобицький район, Львівська область</p>
        </div>
      </div>
      <div className="store-footer-bottom">SuperFurn</div>
    </footer>
  );
}

export function StoreHero() {
  return (
    <section className="store-hero" id="hero">
      <img
        className="store-hero-image"
        src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=2000&q=90"
        alt=""
      />
      <div className="store-hero-shade" />
      <div className="store-hero-content">
        <p className="store-eyebrow">SuperFurn</p>
        <h1>
          Твій дім —<br />
          твої правила
        </h1>
        <p className="store-hero-copy">
          Нова колекція меблів 2026. Естетика, комфорт та натуральні матеріали.
        </p>
        <a className="store-button store-button-gold" href="#catalog">
          Переглянути каталог <span aria-hidden="true">↗</span>
        </a>
      </div>
      <span className="hero-side-note">2026 · HOME COLLECTION</span>
    </section>
  );
}

export function StoreFeatures() {
  return (
    <section className="store-features" aria-label="Переваги">
      <div>
        <span>01</span>
        <h2>Швидка доставка</h2>
        <p>Доставимо за 24 години</p>
      </div>
      <div>
        <span>02</span>
        <h2>Преміум якість</h2>
        <p>Натуральне дерево та сталь</p>
      </div>
      <div>
        <span>03</span>
        <h2>Підтримка 24/7</h2>
        <p>Завжди на зв'язку</p>
      </div>
    </section>
  );
}

export function StoreCatalog() {
  const { cart, addToCart, openCart } = useStorefront();
  const [category, setCategory] = useState("Усі меблі");
  const categories = [
    "Усі меблі",
    "Вітальня",
    "Освітлення",
    "Столи",
    "Спальня",
    "Декор",
  ];
  const filteredProducts =
    category === "Усі меблі"
      ? products
      : products.filter((product) => product.category === category);

  return (
    <section className="store-catalog" id="catalog">
      <div className="catalog-topline">
        <span>ВИБІР ДЛЯ ТВОГО ДОМУ</span>
        <span>01 — 06</span>
      </div>
      <div className="catalog-heading">
        <h2>Наші Бестселери</h2>
        <Link to="/inspiration">
          Знайти своє натхнення <span aria-hidden="true">↗</span>
        </Link>
      </div>
      <div className="catalog-filters" role="group">
        {categories.map((item) => (
          <button
            className={category === item ? "selected" : ""}
            key={item}
            type="button"
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="store-products">
        {filteredProducts.map((product) => {
          const inCart = cart.some((item) => item.id === product.id);
          return (
            <article className="store-product" key={product.id}>
              <div className="product-image-wrap">
                <img src={product.image} alt={product.title} loading="lazy" />
                <span className="product-category">{product.category}</span>
              </div>
              <div className="product-info">
                <div>
                  <h3>{product.title}</h3>
                  <p>{formatPrice(product.price)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    addToCart(product);
                    openCart();
                  }}
                >
                  {inCart ? "У кошику" : "+"}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function StoreInspiration() {
  const ideas = [
    {
      title: "Теплий мінімалізм",
      category: "Вітальня",
      image: products[1].image,
    },
    {
      title: "Природна рівновага",
      category: "Матеріали",
      image: products[3].image,
    },
    { title: "М’яке світло", category: "Деталі", image: products[2].image },
  ];
  return (
    <div className="inspiration-page">
      <section className="inspiration-intro">
        <span className="store-eyebrow">SUPERFURN JOURNAL</span>
        <h1>Ідеї для дому</h1>
        <p>Дім складається з деталей. Знайди ті, що близькі тобі.</p>
      </section>
      <section className="inspiration-grid">
        {ideas.map((idea, index) => (
          <article
            className={`inspiration-card inspiration-card-${index + 1}`}
            key={idea.title}
          >
            <img src={idea.image} alt="" />
            <div>
              <span>{idea.category}</span>
              <h2>{idea.title}</h2>
              <Link to="/#catalog">
                Переглянути каталог <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </article>
        ))}
      </section>
      <div className="inspiration-back">
        <Link to="/#catalog">
          До каталогу <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </div>
  );
}

const defaultProfileSettings = {
  phone: "+38 (099) 123-45-67",
  address: "Болехівці, Львівська область",
  payment: "cash",
  orderUpdates: true,
};

const paymentMethods = [
  {
    id: "cash",
    title: "Готівкою при отриманні",
    description: "Розрахунок з кур'єром після перевірки товару.",
  },
  {
    id: "card-courier",
    title: "Карткою кур'єру",
    description: "Оплата через термінал під час доставки.",
  },
  {
    id: "invoice",
    title: "За рахунком",
    description: "Для юридичних осіб. Рахунок надсилаємо на email.",
  },
];

export function StoreProfile() {
  const email = "romansushko17@gmail.com";
  const displayName = "Роман Сушко";
  const storageKey = `superFurnProfile:${email}`;

  const [settings, setSettings] = useState(() => {
    try {
      const raw = window.localStorage.getItem(storageKey);
      return raw
        ? { ...defaultProfileSettings, ...JSON.parse(raw) }
        : defaultProfileSettings;
    } catch {
      return defaultProfileSettings;
    }
  });

  const [saved, setSaved] = useState(false);

  function update(patch) {
    setSettings((current) => ({ ...current, ...patch }));
    setSaved(false);
  }

  function save(event) {
    event.preventDefault();
    window.localStorage.setItem(storageKey, JSON.stringify(settings));
    setSaved(true);
  }

  return (
    <div
      className="profile-page"
      style={{
        maxWidth: "1000px",
        margin: "40px auto",
        padding: "0 20px",
        background: "#fff",
      }}
    >
      <section className="profile-intro" style={{ marginBottom: "32px" }}>
        <span className="store-eyebrow">ОСОБИСТИЙ КАБІНЕТ</span>
        <h1 style={{ fontSize: "32px", fontFamily: "serif" }}>Профіль</h1>
        <p style={{ color: "#666" }}>
          Контакти, доставка та спосіб оплати в одному місці.
        </p>
      </section>
      <div
        className="profile-layout"
        style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "32px" }}
      >
        <aside
          className="profile-card"
          style={{
            padding: "24px",
            border: "1px solid #dedbd4",
            borderRadius: "8px",
            background: "#fff",
            textAlign: "center",
            height: "fit-content",
          }}
        >
          <span
            className="profile-avatar"
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              background: "#c49f60",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              fontWeight: "bold",
              margin: "0 auto 16px auto",
            }}
          >
            {displayName.charAt(0).toUpperCase()}
          </span>
          <h2 style={{ fontSize: "20px", margin: "0 0 8px 0" }}>
            {displayName}
          </h2>
          <p style={{ color: "#666", fontSize: "14px", margin: "0 0 24px 0" }}>
            {email}
          </p>
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem("superFurnUser");
              window.location.href = "/";
            }}
            style={{
              display: "block",
              width: "100%",
              textAlign: "center",
              padding: "10px 16px",
              background: "#1c272e",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "500",
              fontSize: "14px",
            }}
          >
            Вийти з акаунта
          </button>
        </aside>
        <form
          className="profile-form"
          onSubmit={save}
          style={{ display: "flex", flexDirection: "column", gap: "24px" }}
        >
          <fieldset
            style={{
              border: "1px solid #dedbd4",
              padding: "20px",
              borderRadius: "8px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              background: "#fff",
            }}
          >
            <legend style={{ fontWeight: "bold", padding: "0 8px" }}>
              Контакти та доставка
            </legend>
            <label
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                fontSize: "14px",
              }}
            >
              Номер телефону
              <input
                type="tel"
                value={settings.phone}
                onChange={(event) => update({ phone: event.target.value })}
                style={{
                  padding: "10px",
                  border: "1px solid #dedbd4",
                  borderRadius: "4px",
                  background: "#fff",
                }}
              />
            </label>
            <label
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                fontSize: "14px",
              }}
            >
              Адреса доставки
              <input
                value={settings.address}
                onChange={(event) => update({ address: event.target.value })}
                style={{
                  padding: "10px",
                  border: "1px solid #dedbd4",
                  borderRadius: "4px",
                  background: "#fff",
                }}
              />
            </label>
          </fieldset>
          <fieldset
            style={{
              border: "1px solid #dedbd4",
              padding: "20px",
              borderRadius: "8px",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              background: "#fff",
            }}
          >
            <legend style={{ fontWeight: "bold", padding: "0 8px" }}>
              Спосіб оплати
            </legend>
            {paymentMethods.map((method) => (
              <label
                key={method.id}
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                  cursor: "pointer",
                }}
              >
                <input
                  type="radio"
                  name="payment"
                  value={method.id}
                  checked={settings.payment === method.id}
                  onChange={() => update({ payment: method.id })}
                  style={{ marginTop: "4px" }}
                />
                <span>
                  <strong style={{ display: "block", fontSize: "14px" }}>
                    {method.title}
                  </strong>
                  <small style={{ color: "#666", fontSize: "12px" }}>
                    {method.description}
                  </small>
                </span>
              </label>
            ))}
          </fieldset>
          <fieldset
            style={{
              border: "1px solid #dedbd4",
              padding: "20px",
              borderRadius: "8px",
              background: "#fff",
            }}
          >
            <legend style={{ fontWeight: "bold", padding: "0 8px" }}>
              Сповіщення
            </legend>
            <label
              style={{
                display: "flex",
                gap: "10px",
                alignItems: "center",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={settings.orderUpdates}
                onChange={(event) =>
                  update({ orderUpdates: event.target.checked })
                }
              />
              Надсилати статус замовлення на email
            </label>
          </fieldset>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <p style={{ color: "#2e7d32", fontSize: "14px", margin: 0 }}>
              {saved ? "Зміни збережено на цьому пристрої." : ""}
            </p>
            <button
              type="submit"
              style={{
                padding: "10px 20px",
                background: "#1c272e",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "14px",
              }}
            >
              Зберегти зміни
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function formatPrice(price) {
  return `${price.toLocaleString("uk-UA")} ₴`;
}
