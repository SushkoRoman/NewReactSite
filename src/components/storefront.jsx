import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { FormEvent, ReactNode } from "react";
import { Link, useLocation } from "react-router";

import "./storefront.css";

export type Product = {
  id: number;
  title: string;
  price: number;
  image: string;
  category: string;
};

export const products: Product[] = [
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

type StoreContextValue = {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: number) => void;
  openCart: () => void;
  user: string | null;
  openLogin: () => void;
  logout: () => void;
};

const StoreContext = createContext<StoreContextValue | null>(null);

export function useStorefront() {
  const value = useContext(StoreContext);
  if (!value)
    throw new Error("Storefront components must be inside StorefrontShell");
  return value;
}

export function StorefrontShell({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Product[]>([]);
  const [cartReady, setCartReady] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkout, setCheckout] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderTotal, setOrderTotal] = useState(0);

  const [user, setUser] = useState<string | null>(null);
  const [loginOpen, setLoginOpen] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const savedCart = window.localStorage.getItem("superFurnCart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart) as Product[]);
      } catch {
        window.localStorage.removeItem("superFurnCart");
      }
    }
    const savedUser = window.localStorage.getItem("superFurnUser");
    if (savedUser) {
      setUser(savedUser);
    }
    setCartReady(true);
  }, []);

  useEffect(() => {
    if (cartReady)
      window.localStorage.setItem("superFurnCart", JSON.stringify(cart));
  }, [cart, cartReady]);

  useEffect(() => {
    setCartOpen(false);
    setCheckout(false);
    setOrderPlaced(false);
  }, [location.pathname]);

  const value = useMemo<StoreContextValue>(
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
      user,
      openLogin: () => setLoginOpen(true),
      logout: () => {
        setUser(null);
        window.localStorage.removeItem("superFurnUser");
      },
    }),
    [cart, user],
  );

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setOrderTotal(total);
    setCart([]);
    setCheckout(false);
    setOrderPlaced(true);
  }

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = (formData.get("username") as string) || "Користувач";
    setUser(username);
    window.localStorage.setItem("superFurnUser", username);
    setLoginOpen(false);
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
              backgroundColor: "rgba(0, 0, 0, 0.55)",
              zIndex: 100,
              display: "flex",
              justifyContent: "flex-end",
            }}
            onClick={() => {
              setCartOpen(false);
              setCheckout(false);
            }}
          >
            <div
              className="store-cart-sheet"
              style={{
                width: "100%",
                maxWidth: "420px",
                height: "100%",
                padding: "28px",
                display: "flex",
                flexDirection: "column",
                overflowY: "auto",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="store-cart-head">
                <h2>
                  {checkout
                    ? "Оформлення замовлення"
                    : orderPlaced
                      ? "Замовлення"
                      : "Ваш кошик"}
                </h2>
                <button
                  type="button"
                  className="store-close"
                  aria-label="Закрити"
                  onClick={() => {
                    setCartOpen(false);
                    setCheckout(false);
                    setOrderPlaced(false);
                  }}
                >
                  ×
                </button>
              </div>

              {orderPlaced ? (
                <div className="store-order-success">
                  <span className="success-mark" aria-hidden="true">
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
                <div className="store-empty-cart">
                  <span className="store-empty-bag" aria-hidden="true" />
                  <p>Кошик порожній</p>
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
                  <div className="store-cart-items">
                    {cart.map((item) => (
                      <div className="store-cart-item" key={item.id}>
                        <img src={item.image} alt="" />
                        <div>
                          <h3>{item.title}</h3>
                          <p>{formatPrice(item.price)}</p>
                          <button
                            className="text-button remove-button"
                            type="button"
                            onClick={() => value.removeFromCart(item.id)}
                          >
                            Видалити
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="store-cart-bottom">
                    <div className="checkout-total">
                      <span>Разом</span>
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

        {loginOpen && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0, 0, 0, 0.55)",
              zIndex: 100,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "16px",
            }}
            onClick={() => setLoginOpen(false)}
          >
            <div
              className="store-cart-sheet"
              style={{
                width: "100%",
                maxWidth: "380px",
                padding: "28px",
                borderRadius: "4px",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="store-cart-head">
                <h2>Вхід в акаунт</h2>
                <button
                  type="button"
                  className="store-close"
                  aria-label="Закрити"
                  onClick={() => setLoginOpen(false)}
                >
                  ×
                </button>
              </div>
              <form className="store-checkout" onSubmit={handleLogin}>
                <label>
                  Логін або Email
                  <input name="username" required />
                </label>
                <label>
                  Пароль
                  <input name="password" type="password" required />
                </label>
                <button
                  className="store-button store-button-dark"
                  type="submit"
                >
                  Увійти
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </StoreContext.Provider>
  );
}

function StoreHeader() {
  const { cart, openCart, user, openLogin, logout } = useStorefront();
  const { pathname } = useLocation();
  const isHome = pathname === "/";

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
          <a href={isHome ? "#catalog" : "/#catalog"}>Каталог</a>
          <Link
            className={pathname === "/inspiration" ? "active" : ""}
            to="/inspiration"
          >
            Ідеї для дому
          </Link>
          <a href={isHome ? "#contacts" : "/#contacts"}>Контакти</a>
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
          {user ? (
            <button className="store-account" type="button" onClick={logout}>
              {user} (Вийти)
            </button>
          ) : (
            <button className="store-account" type="button" onClick={openLogin}>
              Вхід
            </button>
          )}
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
      <div
        className="catalog-filters"
        role="group"
        aria-label="Фільтр за категорією"
      >
        {categories.map((item) => (
          <button
            className={category === item ? "selected" : ""}
            key={item}
            type="button"
            onClick={() => setCategory(item)}
            aria-pressed={category === item}
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
                  aria-label={`${inCart ? "У кошику" : "Додати у кошик"}: ${product.title}`}
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
      <section className="inspiration-grid" aria-label="Ідеї для інтер’єру">
        {ideas.map((idea, index) => (
          <article
            className={`inspiration-card inspiration-card-${index + 1}`}
            key={idea.title}
          >
            <img src={idea.image} alt="" />
            <div>
              <span>{idea.category}</span>
              <h2>{idea.title}</h2>
              <a href="/#catalog">
                Переглянути каталог <span aria-hidden="true">↗</span>
              </a>
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

export function StorefrontHomePage() {
  return (
    <StorefrontShell>
      <StoreHero />
      <StoreFeatures />
      <StoreCatalog />
    </StorefrontShell>
  );
}

export function StorefrontInspirationPage() {
  return (
    <StorefrontShell>
      <StoreInspiration />
    </StorefrontShell>
  );
}

export function formatPrice(price: number) {
  return `${price.toLocaleString("uk-UA")} ₴`;
}
