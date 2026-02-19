import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const messageSlice = createSlice({
  name: 'message',
  initialState: [
    // {
    //   id: 1,
    //   type: 'success',
    //   title: '成功',
    //   text: '這是一則成功訊息',
    // },
  ],
  reducers: {
    createMessage(state, action) {
      state.push({
        id: action.payload.id,
        type: action.payload.success ? 'success' : 'danger',
        title: action.payload.success ? '成功' : '失敗',
        text: action.payload.message,
      });
    },
    removeMessage(state, action) {
      const index = state.findIndex((item) => item.id === action.payload);
      if (index !== -1) {
        state.splice(index, 1);
      }
    },
  },
});

export const createAsyncMessage = createAsyncThunk(
  'message/createAsyncMessage',
  async (payload, { dispatch, requestId }) => {
    dispatch(
      createMessage({
        ...payload,
        id: requestId,
      }),
    );

    setTimeout(() => {
      dispatch(removeMessage(requestId));
    }, 2000);
  },
);

// Action createMessage removeMessage 自動生成
export const { createMessage, removeMessage } = messageSlice.actions;
// Reducer 匯出給 store 使用
export default messageSlice.reducer;
