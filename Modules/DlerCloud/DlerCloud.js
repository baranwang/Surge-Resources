const TOKEN_KEY = 'dlercloud-token';

const DEFAULT_OPTIONS = {
  multiple: 50,
};

let token = $persistentStore.read(TOKEN_KEY);

(async () => {
  const { email, password, multiple } = getOptions();

  if (!token) {
    await API.Login(email, password);
  }

  let log;
  try {
    log = await API.Checkin(multiple);
  } catch (error) {
    await API.Login(email, password);
    log = await API.Checkin(multiple);
  }
  console.log(log);
  $notification.post('DlerCloud', log.checkin, `剩余流量: ${log.unused}`);
  $done();
})();

async function request(url, params) {
  const body = JSON.stringify(params);
  return new Promise((resolve, reject) => {
    $httpClient.post(
      {
        url: `https://dler.cloud${url}`,
        headers: {
          'Content-Type': 'application/json',
        },
        body,
      },
      (error, response, res) => {
        if (error) {
          reject(error);
        } else {
          const { ret, msg, data } = JSON.parse(res);
          if (ret === 200) {
            resolve(data);
          } else {
            reject(msg);
          }
        }
      }
    );
  });
}

const API = {
  Login: async function (email, passwd) {
    const user = await request('/api/v1/login', {
      email,
      passwd,
    });
    $persistentStore.write(TOKEN_KEY, user.token);
    token = user.token;
    return user;
  },
  Logout: async function (access_token) {
    return await request('/api/v1/logout', { access_token });
  },
  Checkin: async function (multiple = 50) {
    return await request('/api/v1/checkin', {
      access_token: token,
      multiple,
    });
  },
};

function getOptions() {
  let options = Object.assign({}, DEFAULT_OPTIONS);
  if (typeof $argument != 'undefined') {
    try {
      const params = Object.fromEntries(
        $argument
          .split('&')
          .map((item) => item.split('='))
          .map(([k, v]) => [k, decodeURIComponent(v)])
      );
      Object.assign(options, params);
    } catch (error) {
      console.error(`$argument 解析失败，$argument: + ${$argument}`);
    }
  }

  return options;
}
