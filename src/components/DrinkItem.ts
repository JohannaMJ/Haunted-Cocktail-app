import { html, component } from 'haunted';
import { Ingredient } from '../app';
import './PrimaryButton';

interface DrinkProps {
  name: string;
  thumb: string;
  instructions: string;
  ingredients: Ingredient[];
  onAddIngredients: (ingredients: Ingredient[]) => void;
}

function DrinkItem({
  name,
  thumb,
  instructions,
  ingredients,
  onAddIngredients,
}: DrinkProps) {
  const handleClick = () => {
    onAddIngredients(ingredients);
  };

  return html`
    <li class="drink-item">
      <img src="${thumb}" width="100" />
      <div class="drink-info">
        <strong>${name}</strong>
        <p>${instructions}</p>
      </div>
      <primary-button
        .text=${'+'}
        @click=${handleClick}
        .backgroundColor=${'#22aa91'}
        .hoverColor=${'#358e7e'}
      ></primary-button>
    </li>

    <style>
      .drink-item {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 12px;
        list-style: none;
        border-radius: 8px;
        background-color: #f9f9f9;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
        transition: box-shadow 0.1s ease;
      }

      .drink-item:hover {
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      }

      .drink-item img {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: 4px;
      }

      .drink-info {
        display: flex;
        flex-direction: column;
        flex: 1;
        gap: 4px;
        max-height: 100px;
        overflow-y: auto;
      }

      .drink-info strong {
        font-size: 16px;
        margin-bottom: 4px;
      }

      .drink-info p {
        font-size: 14px;
        color: #555;
        margin: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
      }
    </style>
  `;
}

customElements.define(
  'drink-item',
  component<HTMLElement & DrinkProps>(DrinkItem)
);
