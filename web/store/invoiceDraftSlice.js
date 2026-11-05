import { createSelector, createSlice } from "@reduxjs/toolkit";
import { blankItem } from "@/lib/invoiceDraft";
import { invoiceTotals } from "@/lib/money";

const initialState = {
  sourceId: null, number: "", client: null, issue_date: "", due_date: "", gst_rate: 18, notes: "", items: [],
};

const invoiceDraftSlice = createSlice({
  name: "invoiceDraft",
  initialState,
  reducers: {
    loadDraft: (_state, action) => action.payload,
    resetDraft: () => initialState,
    setField: (state, { payload: { field, value } }) => {
      state[field] = value;
    },
    addItem: {
      reducer: (state, action) => {
        state.items.push(action.payload);
      },
      prepare: () => ({ payload: blankItem() }),
    },
    updateItem: (state, { payload: { key, field, value } }) => {
      const item = state.items.find((entry) => entry.key === key);
      if (item) item[field] = value;
    },
    removeItem: (state, { payload: key }) => {
      state.items = state.items.filter((item) => item.key !== key);
    },
  },
});

export const { loadDraft, resetDraft, setField, addItem, updateItem, removeItem } = invoiceDraftSlice.actions;
export default invoiceDraftSlice.reducer;

export const selectDraft = (state) => state.invoiceDraft;
export const selectDraftTotals = createSelector(
  [(state) => state.invoiceDraft.items, (state) => state.invoiceDraft.gst_rate],
  invoiceTotals,
);