// Brand mark from docs/design/logo.png: a solid green map pin with a light window
// holding an amber mushroom. Colors come from tokens via fill- utilities.
interface RunoLogoProps {
  size?: number;
}

export function RunoLogo({ size = 30 }: RunoLogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 1.5C6.9 1.5 2.8 5.6 2.8 10.6c0 5.9 7.6 11.4 8.5 12.1.4.3 1 .3 1.4 0 .9-.7 8.5-6.2 8.5-12.1C21.2 5.6 17.1 1.5 12 1.5Z"
        className="fill-content"
      />
      <circle cx="12" cy="10.4" r="5.4" className="fill-surface" />
      <path
        d="M7.9 11C7.9 7.9 9.7 6.1 12 6.1s4.1 1.8 4.1 4.9Z"
        className="fill-action"
      />
      <path
        d="M10.4 11h3.2l-.32 3.2c-.05.75-2.51.75-2.56 0Z"
        className="fill-action"
      />
    </svg>
  );
}
