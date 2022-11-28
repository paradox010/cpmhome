import { runApp, IAppConfig } from 'ice';

// const delay = (time) => new Promise((resolve) => setTimeout(() => resolve(1), time));

const appConfig: IAppConfig = {
  app: {
    rootId: 'ice-container',
    title: '浙江省',
    getInitialData: async () => {
      // await delay(1000);
      return {
        // initialStates 是约定好的字段，会透传给 store 的初始状态
        initialStates: {
          user: { userId: `${Math.random()}` },
        },
      };
    },
  },
  router: {
    type: 'browser',
    fallback: <div>loading....</div>,
  },
  request: {
    baseURL: '/',
    headers: {},
    // withFullResponse: true,
    interceptors: {
      request: {
        onConfig: (config) => {
          // eslint-disable-next-line no-param-reassign
          // config.headers = { a: 1 };
          return config;
        },
        onError: (error) => {
          return Promise.reject(error);
        },
      },
      response: {
        onConfig: (response) => {
          // if (!response.data.status !== 1) {
          //   //errro
          // }
          if (response.data?.header.code !== 200) {
            return Promise.reject(response.data?.header);
          }
          response.data = response.data.body;
          return response;
        },
        onError: (error) => {
          // console.log(error);
          return Promise.reject(error);
        },
      },
    },
  },
};

runApp(appConfig);
