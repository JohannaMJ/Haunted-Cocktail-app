import { html, component } from "haunted";

interface PrimaryButtonProps {
  text: string;
  onClick?: () => void;
  backgroundColor?: string;
  hoverColor?: string;
}

function PrimaryButton({
  text,
  onClick,
  backgroundColor = "#ff4d4d",
  hoverColor = "#cc0000",
}: PrimaryButtonProps) {
  return html`
    <button
      @click=${onClick}
      style="
      --bg-color: ${backgroundColor};
      --hover-color: ${hoverColor};
    "
    >
      <span class="button-text"> ${text}</span>
    </button>

    <style>
      button {
        display: flex;
        align-items: center;
        padding: 6px 10px;
        border: none;
        border-radius: 6px;
        background-color: var(--bg-color);
        color: #fff;
        font-weight: bold;
        cursor: pointer;
        transition: background-color 0.2s ease;
      }

      button:hover {
        background-color: var(--hover-color);
      }

      .button-text {
        font-size: 14px;
      }
    </style>
  `;
}

customElements.define(
  "primary-button",
  component<PrimaryButtonProps>(PrimaryButton)
);
