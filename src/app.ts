import { html } from "lit";
import { component, useState } from "haunted";
import "./components/SearchBar";
import "./components/DrinkItem";
import "./components/ShoppingList";
import "./components/Toaster";
import "./styles/main.css";

interface Drink {
  id: number;
  name: string;
  thumb: string;
  instructions: string;
  ingredients: Ingredient[];
}

export interface Ingredient {
  name: string;
}

function CocktailApp() {
  const [query, setQuery] = useState("marg");
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (message: string) => setToast(message);

  const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    setQuery(target.value);
  };

  const handleAddIngredients = (newIngredients: Ingredient[]) => {
    const existingIngredients = new Set(
      ingredients.map((i) => i.name.toLowerCase())
    );

    const uniqueNewIngredients = newIngredients.filter((i) => {
      const nameLower = i.name.toLowerCase();
      if (existingIngredients.has(nameLower)) {
        return false;
      }
      existingIngredients.add(nameLower);
      return true;
    });

    setIngredients((prev) => [...prev, ...uniqueNewIngredients]);
    showToast("Ingredients added to shopping list!");
  };

  const printList = () => window.print();

  const handleSubmit = async (event: Event) => {
    event.preventDefault();
    if (!query) return;
    showToast("Searching...");
    setHasSearched(true);

    try {
      const res = await fetch(
        `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${encodeURIComponent(
          query
        )}`
      );
      const data = await res.json();

      const mappedDrinks: Drink[] = (data.drinks || []).map((drink: any) => {
        const ingredients: Ingredient[] = [];

        let i = 1;

        while (true) {
          const ingredient = drink[`strIngredient${i}`];
          if (!ingredient) break;
          ingredients.push({
            name: ingredient,
          });
          i++;
        }

        return {
          id: drink.idDrink,
          name: drink.strDrink,
          thumb: drink.strDrinkThumb,
          instructions: drink.strInstructions,
          ingredients,
        };
      });

      setDrinks(mappedDrinks);
    } catch (err) {
      console.error("Fetch error:", err);
      setDrinks([]);
    } finally {
      setQuery("");
    }
  };

  const clearList = () => {
    setIngredients([]);
    showToast("List cleared!");
  };

  return html`
    <div class="app-container">
      <header>
        <search-bar
          .query=${query}
          .onInput=${handleInput}
          .onSubmit=${handleSubmit}
        />
      </header>
      <main class="content">
        <section class="main-section">
          <h2>Drinkz</h2>
          <div class="content-container">
            ${hasSearched && drinks.length === 0
              ? html`<p>No results found :(</p>`
              : html`
                  <ul class="scrollable-list">
                    ${drinks.map(
                      (drink) =>
                        html`
                          <drink-item
                            key=${drink.id}
                            .name=${drink.name}
                            .thumb=${drink.thumb}
                            .instructions=${drink.instructions}
                            .ingredients=${drink.ingredients}
                            .onAddIngredients=${handleAddIngredients}
                          />
                        `
                    )}
                  </ul>
                `}
          </div>
        </section>

        <aside class="main-section">
          <h2>Shopping list</h2>
          <div class="content-container">
            <shopping-list
              .ingredients=${ingredients}
              @remove-ingredient=${(e: CustomEvent) => {
                const name = e.detail.name;
                setIngredients((prev) =>
                  prev.filter((item) => item.name !== name)
                );
              }}
              .clearList=${clearList}
              .showToast=${showToast}
            >
            </shopping-list>
          </div>
          ${ingredients.length > 0
            ? html`
                <div class="button-container">
                  <primary-button
                    .text=${"Clear list"}
                    @click=${clearList}
                  ></primary-button>
                  <primary-button
                    .text=${"Print list"}
                    .backgroundColor=${"#1d32bf"}
                    .hoverColor=${"#11239c"}
                    @click=${printList}
                  ></primary-button>
                </div>
              `
            : null}
        </aside>
      </main>
      ${toast && html`<toaster-message .message=${toast}></toaster-message>`}
    </div>

    <style>
      .main-section {
        display: flex;
        flex-direction: column;
        height: 100%;
        overflow: hidden;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
        border-radius: 8px;
        background-color: #fff;
        padding-inline: 12px;
      }

      h2 {
        flex: 0 0 auto;
      }

      .content-container {
        flex: 1 1 auto;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        position: relative;
      }

      .button-container {
        display: flex;
        gap: 12px;
        margin: 12px;
      }
    </style>
  `;
}

customElements.define(
  "cocktail-app",
  component(CocktailApp, { useShadowDOM: false })
);
