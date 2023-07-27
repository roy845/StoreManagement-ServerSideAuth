import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  totalPurchased: localStorage.getItem("totalPurchases") || 0,
};

export const productsSlice = createSlice({
  name: "products",
  initialState,

  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    incrementTotalPurchases: (state, action) => {
      state.totalPurchased += 1;
      localStorage.setItem("totalPurchases", state.totalPurchased);
    },
    decrementQuantity: (state, action) => {
      // Find the index of the product that matches the ID in the action payload
      const index = state.products.findIndex(
        (product) => product.id === action.payload
      );

      // If the product was found and its quantity is greater than 0
      if (index !== -1 && state.products[index].Quantity > 0) {
        // Decrement the product's quantity
        state.products[index].Quantity -= 1;
      }
    },
    resetTotalPurchases: (state, action) => {
      state.totalPurchased = 0;
      localStorage.removeItem("totalPurchases");
    },
    addProductToCustomer: (state, action) => {},
  },
});

export const {
  setProducts,
  incrementTotalPurchases,
  addProductToCustomer,
  decrementQuantity,
  resetTotalPurchases,
} = productsSlice.actions;

export const selectProducts = (state) => state.products.products;
export const selectTotalProductsPurchased = (state) =>
  state.products.totalPurchased;

export default productsSlice.reducer;
