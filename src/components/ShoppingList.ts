import { html, component, useCallback, useMemo } from 'haunted';
import { Ingredient } from '../app';
import './IngredientItem';
import './PrimaryButton';

interface ShoppingListProps {
  ingredients: Ingredient[];
  setIngredients: (updater: (prev: Ingredient[]) => Ingredient[]) => void;
  clearList: () => void;
  showToast: (message: string) => void;
}

function ShoppingList({
  ingredients,
  setIngredients,
  clearList,
  showToast,
}: ShoppingListProps) {
  const clearItem = useCallback(
    (name: string) => {
      setIngredients((prev) => prev.filter((item) => item.name !== name));
      showToast('Item removed!');
    },
    [setIngredients]
  );

  const printList = () => window.print();

  return html`
    <div class="shopping-list">
      <h2>What to buy:</h2>
      <div class="list-wrapper">
        <ul>
          ${ingredients.map(
            (ingredient) => html`
              <ingredient-item
                key=${ingredient.name}
                .ingredient=${ingredient}
                .onRemove=${clearItem}
              ></ingredient-item>
            `
          )}
        </ul>
      </div>
      ${ingredients.length > 0
        ? html`
            <div class="button-container">
              <primary-button
                .text=${'Clear list'}
                @click=${clearList}
              ></primary-button>
              <primary-button
                .text=${'Print list'}
                .backgroundColor=${'#747373'}
                .hoverColor=${'#5a6167'}
                @click=${printList}
              ></primary-button>
            </div>
          `
        : null}
    </div>

    <style>
      .shopping-list {
        display: grid;
        grid-template-rows: auto 1fr auto;
        align-content: space-between;
        gap: 12px;
        height: 100%;
        margin: 0;
        padding: 0 10px;
        overflow: hidden;
      }

      h2 {
        margin-bottom: 0;
      }

      .list-wrapper {
        max-height: 300px;
        overflow-y: auto;
        position: relative;
      }

      @media (max-width: 768px) {
        .list-wrapper {
          max-height: 150px;
        }
      }

      .list-wrapper::after {
        content: '';
        display: block;
        position: sticky;
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

      ul {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 0;
        overflow: auto;
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
  'shopping-list',
  component<ShoppingListProps>(ShoppingList, { useShadowDOM: false })
);
