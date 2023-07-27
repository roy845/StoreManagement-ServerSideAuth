import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  purchases: [],
};

export const purchasesSlice = createSlice({
  name: "purchases",
  initialState,

  reducers: {
    setPurchases: (state, action) => {
      state.purchases = action.payload;
    },
    addPurchase: (state, action) => {
      state.purchases.push(action.payload);
    },
  },
});

export const { setPurchases, addPurchase } = purchasesSlice.actions;

export const selectPurchases = (state) => state.purchases.purchases;

export default purchasesSlice.reducer;
