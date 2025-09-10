import { html } from 'lit';
import { component, useState } from 'haunted';
import './components/SearchBar';
import './components/DrinkItem';
import './components/ShoppingList';
import './components/Toaster';
import './styles/main.css';

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
  const [query, setQuery] = useState('');
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [toast, setToast] = useState('');

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
    showToast('Ingredients added to shopping list!');
  };

  const handleSubmit = async (event: Event) => {
    event.preventDefault();
    if (!query) return;
    showToast('Searching...');
    setHasSearched(true);

    console.log('hallå', query);
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
      console.error('Fetch error:', err);
      setDrinks([]);
    } finally {
      setQuery('');
    }
  };

  const clearList = () => {
    setIngredients([]);
    showToast('List cleared!');
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
        <section class="content-container">
          ${hasSearched && drinks.length === 0
            ? html`<p>No results found :(</p>`
            : html`
                <ul class="drink-list">
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
        </section>

        <aside class="content-container">
          <shopping-list
            .ingredients=${ingredients}
            .setIngredients=${setIngredients}
            .clearList=${clearList}
            .showToast=${showToast}
          >
          </shopping-list>
        </aside>
      </main>
      ${toast && html`<toaster-message .message=${toast}></toaster-message>`}
    </div>

    <style>
      .content-container {
        display: grid;
        grid-template-rows: 1fr;
        overflow: hidden;
        border: 1px solid #ccc;
        border-radius: 8px;
        background-color: #fff;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
        position: relative;
      }

      .drink-list {
        display: flex;
        flex-direction: column;
        margin: 0;
        padding: 10px;
        gap: 8px;
        overflow-y: auto;
      }

      .drink-list::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 30px;
        pointer-events: none;
        background: linear-gradient(
          to bottom,
          rgba(255, 255, 255, 0),
          rgba(255, 255, 255, 1)
        );
      }

      .drink-list::-webkit-scrollbar {
        width: 8px;
      }
      .drink-list::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.3);
        border-radius: 4px;
      }
    </style>
  `;
}

customElements.define(
  'cocktail-app',
  component(CocktailApp, { useShadowDOM: false })
);
