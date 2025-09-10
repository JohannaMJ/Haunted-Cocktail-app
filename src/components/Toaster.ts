import { html, component, useState, useEffect } from 'haunted';

interface ToasterProps {
  message: string;
  duration?: number;
}

function Toaster({ message, duration = 1000 }: ToasterProps) {
  const [visible, setVisible] = useState(false);
  const [currentMessage, setCurrentMessage] = useState<string | undefined>();

  useEffect(() => {
    if (!message) return;

    setCurrentMessage(undefined);
    setVisible(false);

    const showMessageTimeout = setTimeout(() => {
      setCurrentMessage(message);
      setVisible(true);
    }, 50);

    const hideMessageTimeout = setTimeout(
      () => setVisible(false),
      duration + 50
    );

    return () => {
      clearTimeout(showMessageTimeout);
      clearTimeout(hideMessageTimeout);
    };
  }, [message, duration]);

  return html`
    <div class="toaster ${visible ? 'show' : ''}">${currentMessage}</div>

    <style>
      .toaster {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%) translateY(-20px);
        background: rgba(0, 0, 0, 0.85);
        color: #fff;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 14px;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease, transform 0.3s ease;
      }

      .toaster.show {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
        pointer-events: auto;
      }
    </style>
  `;
}

customElements.define('toaster-message', component<ToasterProps>(Toaster));
