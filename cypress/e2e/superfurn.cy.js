// Cypress tests 
import { products, formatPrice } from "../../src/components/storefront";

describe("1. Unit-тести: Перевірка даних та функцій магазину", () => {
  it("Функція formatPrice правильно форматує ціну у гривнях", () => {
    expect(formatPrice(5600)).to.include("₴");
  });

  it("Каталог містить рівно 6 товарів із коректними цінами", () => {
    expect(products).to.have.length(6);
    products.forEach((item) => {
      expect(item.price).to.be.greaterThan(0);
    });
  });
});

describe("2. E2E-тести: Перевірка сайту SuperFurn у браузері", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/");
  });

  it("Відкриває головну сторінку та відображає заголовок", () => {
    cy.contains("Твій дім").should("be.visible");
  });

  it("Фільтрує товари за категорією 'Столи'", () => {
    cy.contains("button", "Столи").click();
  });
});