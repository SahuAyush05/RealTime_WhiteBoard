import { createSlice } from "@reduxjs/toolkit";

const initialState ={
    texts:[],
};

const textSlice = createSlice({
  name: "texts",
  initialState,
  reducers: {
    addText: (state, action) => {
      state.push(action.payload);
    },
    updateText: (state, action) => {
      const { id, newText } = action.payload;
      const textItem = state.find((text) => text.id === id);
      if (textItem) {
        textItem.text = newText;
        textItem.isEditing = false;
      }
    },
    startEditing: (state, action) => {
      const { id } = action.payload;
      state.forEach((text) => {
        text.isEditing = text.id === id;
      });
    },
    setEditingOff: (state) => {
      state.forEach((text) => (text.isEditing = false));
    },
  },
});

export const { addText, updateText, startEditing, setEditingOff } = textSlice.actions;
export default textSlice.reducer;
