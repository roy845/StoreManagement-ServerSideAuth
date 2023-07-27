import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  customers: [],
};

export const customersSlice = createSlice({
  name: "customers",
  initialState,

  reducers: {
    setCustomers: (state, action) => {
      state.customers = action.payload;
    },
  },
});

export const { setCustomers } = customersSlice.actions;

export const selectCustomers = (state) => state.customers.customers;

export default customersSlice.reducer;
