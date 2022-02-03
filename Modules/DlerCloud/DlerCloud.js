async function request(url, params) {
  return new Promise((resolve, reject) => {
    $httpClient.post(
      {
        url: `https://dler.cloud${url}`,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
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
    return await request('/api/v1/login', {
      email,
      passwd,
    });
  },
  Logout: async function (access_token) {
    return await request('/api/v1/logout', { access_token });
  },
  Checkin: async function (access_token, multiple = 50) {
    return await request('/api/v1/checkin', {
      access_token,
      multiple,
    });
  },
};

function getOptions() {
  const options = {};
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
      console.error(`$argument 解析失败，$argument: + ${argument}`);
    }
  }

  return options;
}

(async () => {
  const { email, password, multiple } = getOptions();

  const user = await API.Login(email, password);
  console.log('登入成功');
  console.log(`套餐: ${user.plan}`);
  console.log(`到期时间: ${user.plan_time}`);
  console.log(`已用流量: ${user.used}`);
  console.log(`剩余流量: ${user.unused}`);

  const log = await API.Checkin(user.token, multiple);
  console.log('------------');
  console.log(log.checkin);
  console.log('------------');
  console.log(`剩余流量: ${log.unused}`);

  await API.Logout(user.token);
  console.log('登出成功');

  $done();
})();
