import { MAX_HISTORY } from "@/utils/env";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Layer {
  id: number;
  src: string;
  alt: string;
  className: string;
  z: number;
  rental_price?: string
}

export interface LayerCategories {
  [key: string]: Layer[];
}

export interface LookBuilderState {
  past: LayerCategories[];
  present: {};
  future: LayerCategories[];
}

const initialCategories: LayerCategories = {};

const initialState: LookBuilderState = {
  past: [],
  present: {},
  future: [],
};

const lookBuilderSlice = createSlice({
  name: "lookBuilder",
  initialState,
  reducers: {
    updateCategory: (
      state,
      action: PayloadAction<{ category: string; layers: Layer[] }>
    ) => {
      state.past.push(state.present);
      state.present = {
        ...state.present,
        [action.payload.category]: action.payload.layers,
      };
      state.future = [];
    },
    updateLayerInCategory: (
      state,
      action: PayloadAction<{ category: string; layer: any }>
    ) => {
      state.past.push(state.present);
      state.present = action.payload.layer;
      state.future = [];
    },

    updateAllLayerInCategory: (
      state,
      action: PayloadAction<{ data:any }>
    ) => {
      state.past = [];
      state.present = action.payload;
      state.future = [];
    },

    undo: (state) => {
      if (state.past.length > 0) {
        const previous = state.past[state.past.length - 1];
        state.future.unshift(state.present);
        state.present = previous;
        state.past = state.past.slice(0, -1);
      }
    },

    redo: (state) => {
      if (state.future.length > 0) {
        const next = state.future[0];
        state.past.push(state.present);

        // ✅ If history exceeds 90, remove the oldest (first) entry
        if (state.past.length > MAX_HISTORY) {
          state.past.shift();
        }

        state.present = next;
        state.future = state.future.slice(1);
      }
    },

    resetBuilder: () => initialState,
  },
});

export const {
  updateCategory,
  updateLayerInCategory,
  updateAllLayerInCategory,
  undo,
  redo,
  resetBuilder,
} = lookBuilderSlice.actions;

export default lookBuilderSlice.reducer;
