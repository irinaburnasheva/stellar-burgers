import { createSlice, createAsyncThunk, nanoid } from '@reduxjs/toolkit';
import { TConstructorIngredient, TOrder } from '@utils-types';
import { orderBurgerApi } from '@api';

export interface orderConstructorState {
  isLoading: boolean;
  error: string | null;
  ingredients: {
    bun: TConstructorIngredient | null;
    toppings: TConstructorIngredient[];
  };
  orderRequest: boolean;
  orderModalData: TOrder | null;
}

const initialState: orderConstructorState = {
  isLoading: false,
  error: null,
  ingredients: {
    bun: null,
    toppings: []
  },
  orderRequest: false,
  orderModalData: null
};

export const createOrderThunk = createAsyncThunk(
  'orderСonstructor/createOrder',
  async (orderData: string[]) => await orderBurgerApi(orderData)
);

const orderConstructorSlice = createSlice({
  name: 'orderСonstructor',
  initialState,
  reducers: {
    addOrderConstructorIngredient: (state, action) => {
      action.payload.type === 'bun'
        ? (state.ingredients.bun = action.payload)
        : state.ingredients.toppings.push({
            id: nanoid(),
            ...action.payload
          });
    },
    deleteOrderConstructorIngredient: (state, action) => {
      state.ingredients.toppings = state.ingredients.toppings.filter(
        (topping) => topping.id != action.payload.id
      );
    },
    putUpOrderConstructorIngredient: (state, action) => {
      [
        state.ingredients.toppings[action.payload],
        state.ingredients.toppings[action.payload - 1]
      ] = [
        state.ingredients.toppings[action.payload - 1],
        state.ingredients.toppings[action.payload]
      ];
    },
    putDownOrderConstructorIngredient: (state, action) => {
      [
        state.ingredients.toppings[action.payload],
        state.ingredients.toppings[action.payload + 1]
      ] = [
        state.ingredients.toppings[action.payload + 1],
        state.ingredients.toppings[action.payload]
      ];
    },
    setOrderRequest: (state, action) => {
      state.orderRequest = action.payload;
    },
    clearOrderModalData: (state) => {
      state.orderModalData = null;
    }
  },
  selectors: {
    selectOrderConstructor: (state) => state
  },
  extraReducers: (builder) => {
    builder.addCase(createOrderThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(createOrderThunk.rejected, (state, { error }) => {
      state.isLoading = false;
      state.error = error.message as string;
    });
    builder.addCase(createOrderThunk.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.error = null;
      state.orderRequest = false;
      state.orderModalData = payload.order;
      state.ingredients = {
        bun: null,
        toppings: []
      };
    });
  }
});

export { initialState as constructorInitialState };
export const {
  addOrderConstructorIngredient,
  deleteOrderConstructorIngredient,
  putUpOrderConstructorIngredient,
  putDownOrderConstructorIngredient,
  setOrderRequest,
  clearOrderModalData
} = orderConstructorSlice.actions;

export const { selectOrderConstructor } = orderConstructorSlice.selectors;

export default orderConstructorSlice.reducer;
