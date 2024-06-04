import { type ReactElement } from 'react';

export default function Home(): ReactElement {
  return (
    <>
      <iframe
        src="https://farfi.framer.website/"
        className="w-full h-full border-none overflow-hidden"
        style={{
          width: '100dvw',
          height: '100dvh',
          border: 'none',
          overflow: 'hidden',
        }}
      ></iframe>
    </>
  );
}
