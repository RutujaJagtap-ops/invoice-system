"use client";

export default function GlobalError({ reset }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, minHeight: "100dvh", display: "grid", placeItems: "center", fontFamily: "system-ui, sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <h1>Something went wrong</h1>
          <button onClick={reset}>Try again</button>
        </div>
      </body>
    </html>
  );
}