import { createStore } from 'ice';

interface User {
  userId?: string;
  userName?: string;
  token?: string;
}
const initState = {} as any as User;
const store = createStore({
  user: {
    state: initState,
    reducers: {
      update(prevState, payload) {
        return {
          ...prevState,
          ...payload,
        };
      },
      cover(prevState, payload) {
        return payload;
      },
    },
  },
});

export default store;
