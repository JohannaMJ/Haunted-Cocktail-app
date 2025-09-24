import { html, component } from "haunted";

interface SearchBarProps {
  query: string;
  onInput: (e: Event) => void;
  onSubmit: (e: Event) => void;
}

function SearchBar({ query, onInput, onSubmit }: SearchBarProps) {
  return html`
    <form class="search-bar" @submit=${onSubmit}>
      <input
        type="text"
        placeholder="Search for a cocktail..."
        .value=${query}
        @input=${onInput}
      />
      <button type="submit">Search</button>
    </form>

    <style>
      .search-bar {
        display: flex;
        max-width: 600px;
        margin: 20px auto;
        gap: 8px;
      }

      .search-bar input {
        flex: 1;
        padding: 10px 14px;
        font-size: 16px;
        border: 1px solid #ccc;
        border-radius: 8px;
        outline: none;
        transition: border-color 0.2s ease, box-shadow 0.2s ease;
      }

      .search-bar input:focus {
        border-color: #0077ff;
        box-shadow: 0 0 5px rgba(0, 119, 255, 0.3);
      }

      .search-bar button {
        padding: 10px 18px;
        font-size: 16px;
        border: none;
        border-radius: 8px;
        background-color: #1d32bf;
        color: #fff;
        cursor: pointer;
        transition: background-color 0.2s ease;
      }

      .search-bar button:hover {
        background-color: #11239c;
      }
    </style>
  `;
}

customElements.define(
  "search-bar",
  component<HTMLElement & SearchBarProps>(SearchBar)
);
