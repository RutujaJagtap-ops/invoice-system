"use client";

import { useState } from "react";
import { Provider } from "react-redux";
import { makeStore } from "@/store";

export default function StoreProvider({ children }) {
  const [store] = useState(makeStore); // one store per mount, never a shared module singleton
  return <Provider store={store}>{children}</Provider>;
}