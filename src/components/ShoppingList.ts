import { html, component, useCallback, useRef } from "haunted";
import { Ingredient } from "../app";

import "./IngredientItem";
import "./PrimaryButton";

interface ShoppingListProps {
  ingredients: Ingredient[];
  showToast: (message: string) => void;
}

function ShoppingList(
  this: HTMLElement,
  { ingredients, showToast }: ShoppingListProps
) {
  const clearItem = useCallback(
    (name: string) => {
      const event = new CustomEvent("remove-ingredient", {
        detail: { name },
        bubbles: true,
        composed: true,
      });

      this.dispatchEvent(event); // Dispatch from <shopping-list>

      showToast("Item removed!");
    },
    [showToast]
  );

  return html`
    <ul class="scrollable-list">
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

    <style>
      :host {
        flex: 1 1 auto; /* take remaining space */
        display: flex; /* so the child can also stretch if needed */
        flex-direction: column;
        overflow: hidden;
      }

      .scrollable-list {
        display: flex;
        flex-direction: column;
        margin: 0;
        padding: 0;
        gap: 8px;
        overflow-y: auto;
        height: 100%;
      }

      .scrollable-list::after {
        content: "";
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

      .scrollable-list::-webkit-scrollbar {
        width: 8px;
      }
      .scrollable-list::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.3);
        border-radius: 4px;
      }
    </style>
  `;
}

customElements.define(
  "shopping-list",
  component<ShoppingListProps>(ShoppingList)
);
