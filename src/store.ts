import { createStore } from 'ice';

const store = createStore({
  user: {
    state: {
      userId: '',
    },
    reducers: {
      update(prevState, payload) {
        return {
          ...prevState,
          ...payload,
        };
      },
    },
  },
});

export default store;
