import { configureStore } from "@reduxjs/toolkit";
import ui from "@/store/uiSlice";
import invoiceDraft from "@/store/invoiceDraftSlice"

export const makeStore = () => configureStore({ reducer: { ui, invoiceDraft } });