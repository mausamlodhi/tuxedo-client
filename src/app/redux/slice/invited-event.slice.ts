import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState } from "../type";

interface Outfit {
  [key: string]: any;
}

interface InvitedEventState {
  id: number;
  eventName: string;
  firstName: string;
  lastName: string;
  eventDate: string;
  role: string;
  userId: number;
  eventType: string;
  outfits: Outfit[];
  selectedOutfit: Outfit | null;
}

const initialState: InvitedEventState = {
  id: 0,
  eventName: "",
  firstName: "",
  lastName: "",
  eventDate: "",
  role: "",
  userId: 0,
  eventType: "",
  outfits: [],
  selectedOutfit: null,
};

const InvitedEventSlice = createSlice({
  name: "invitedEvent",
  initialState,
  reducers: {
    addInvitedEventDetails: (state, action: PayloadAction<Partial<InvitedEventState>>) => {
      Object.assign(state, action.payload);
    },

    updateSelectedOutfit: (state, action: PayloadAction<Outfit>) => {
      state.selectedOutfit = action.payload;
    },

    addOutfit: (state, action: PayloadAction<Outfit>) => {
      state.outfits.push(action.payload);
    },
    resetInvitedEvent: () => initialState,
  },
});

export const {
  addInvitedEventDetails,
  updateSelectedOutfit,
  addOutfit,
  resetInvitedEvent,
} = InvitedEventSlice.actions;

export const getInvitedEventDetails = (state: any) => state?.invitedEvent;
export const getInvitedEventOutfits = (state: any) => state?.invitedEvent?.outfits;
export const getSelectedOutfit = (state: any) => state?.invitedEvent?.selectedOutfit;

export default InvitedEventSlice.reducer;
