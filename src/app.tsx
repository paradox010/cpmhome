import { config, runApp, IAppConfig, request, history } from 'ice';
import { message } from 'antd';
// const delay = (time) => new Promise((resolve) => setTimeout(() => resolve(1), time));
import { getToken, outLogin, setToken } from './utils/auth';

const appConfig: IAppConfig = {
  app: {
    rootId: 'ice-container',
    title: '浙江省',
    getInitialData: async () => {
      const token = getToken();
      if (token) {
        try {
          const resData = await request({
            url: '/api/sys/sysUser/userInfo',
            headers: {
              Token: token,
            },
          });
          if (resData.isFirstLogin) {
            history?.push({
              pathname: '/user/newPassword',
            });
          }
          return {
            initialStates: {
              user: { ...resData, token },
            },
          };
        } catch (error) {
          // history?.push({
          //   pathname: '/user/login',
          // });
          console.log(error);
        }
      }
      // await delay(1000);
      return {
        // initialStates 是约定好的字段，会透传给 store 的初始状态
        initialStates: {
          // user: { userId: `${Math.random()}` },
        },
      };
    },
  },
  router: {
    type: 'browser',
    fallback: <div>loading....</div>,
    basename: config.basename,
  },
  request: {
    baseURL: config.baseURL,
    headers: {},
    // withFullResponse: true,
    interceptors: {
      request: {
        onConfig: (cg) => {
          // eslint-disable-next-line no-param-reassign
          const token = getToken();
          if (token) {
            cg.headers = {
              ...(cg.headers || {}),
              Token: token,
            };
          }
          return cg;
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
            message.error(response.data?.header?.message);
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
