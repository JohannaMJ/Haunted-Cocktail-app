import { html, component } from "haunted";
import { Ingredient } from "../app";
import "./PrimaryButton";

interface IngredientItemProps {
  ingredient: Ingredient;
  onRemove: (name: string) => void;
}

function IngredientItem({ ingredient, onRemove }: IngredientItemProps) {
  return html`
    <li class="shopping-item" id="item-${ingredient.name}">
      <span class="ingredient-name">${ingredient.name}</span>
      <primary-button
        .text=${"Remove"}
        .onClick=${() => onRemove(ingredient.name)}
      ></primary-button>
    </li>

    <style>
      .shopping-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 16px;
        margin-bottom: 8px;
        border-radius: 8px;
        list-style: none;
        background-color: #ff98002e;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12), 0 1px 3px rgba(0, 0, 0, 0.08);
        transition: transform 0.1s ease, box-shadow 0.1s ease;
      }

      .ingredient-name {
        flex: 1;
        font-size: 16px;
      }
    </style>
  `;
}

customElements.define(
  "ingredient-item",
  component<IngredientItemProps>(IngredientItem)
);
