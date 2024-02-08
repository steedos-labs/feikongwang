// 获取第三方应用凭证
const qywx_api = require('../router');
const fetch = require('node-fetch');
module.exports = {
    handler: async function (ctx) {
        let { access_token } = ctx.params;
        let qyapi = qywx_api.getAllUserList + "?access_token=" + access_token + "&department_id=1&fetch_child=1";
        let allUserListInfo = await fetch(qyapi, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json());
        return allUserListInfo;
    }
}