import { createContext, useReducer } from 'react';

export const StoreContext = createContext();

export const ACTION_TYPES = {
  SET_LAT_LONG: 'SET_LAT_LONG',
  SET_COFFEE_STORES: 'SET_COFFEE_STORES',
};

const initialState = {
  latLong: '',
  coffeeStoresNearMe: [],
};

const coffeStoreReducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case ACTION_TYPES.SET_LAT_LONG:
      return {
        ...state,
        latLong: payload,
      };
    case ACTION_TYPES.SET_COFFEE_STORES:
      return {
        ...state,
        coffeeStoresNearMe: payload,
      };
    default:
      return state;
  }
};

const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(coffeStoreReducer, initialState);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreProvider;
