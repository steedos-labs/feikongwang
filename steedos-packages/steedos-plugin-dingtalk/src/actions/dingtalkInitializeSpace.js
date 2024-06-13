// 初始化space（授权组织时，就初始化space,同时定义space的管理员）
const fetch = require('node-fetch');
module.exports = {
    handler: async function (ctx) {
        const { authinfo, authCorpId, suiteTicket } = ctx.params;
        console.log("初始化space", ctx.params);
        console.log("biz_data.auth_info[0].agentid", authinfo.auth_info)
        let suiteKey = process.env.STEEDOS_DD_SAAS_SUITEKEY;
        let suiteSecret = process.env.STEEDOS_DD_SAAS_SUITESECRET;
        let corpId = process.env.STEEDOD_DD_SAAS_CORPID
        const spaceObj = this.getObject('spaces');
        const usersObj = this.getObject('users');
        const spaceUsersObj = this.getObject("space_users");
        const organizationsObj = this.getObject("organizations");

        var conf = await this.getObject('dingtalk_suite_configurations').findOne(corpId);
        console.log("应用配置", conf)
        if (conf) {
            // 获取用户详情
            let adminUserDoc = await this.broker.call('@steedos/plugin-dingtalk.dingtalkGetUserInfo', {
                "access_token": conf.suite_access_token,
                "userid": authinfo.auth_user_info.userId
            });
            try {
                // 创建user
                let adminId = []
                const user = await usersObj.directInsert({
                    name: adminUserDoc.name,
                    dingtalk_id: adminUserDoc.userid,
                    created: new Date(),
                    modified: new Date(),
                    locale: "zh-cn"
                })
                adminId.push(user._id);

                // 初始化工作区
                let space = await spaceObj.findOne({ filters: [['dingtalk_corp_id', '=', authinfo.auth_corp_info.corpid]] })
                if (space) {
                    // 更新工作区
                    await spaceObj.directUpdate(space._id, {
                        name: authinfo.auth_corp_info.full_corp_name,
                        modified_by: space.owner,
                        modified: new Date(),
                        dingtalk_corp_id: authinfo.auth_corp_info.corpid,
                        dingtalk_agent_id: authinfo.auth_info.agent[0].agentid
                    })
                } else {
                    // 创建space
                    space = await spaceObj.insert({
                        name: authinfo.auth_corp_info.full_corp_name,
                        owner: adminId[0],
                        dingtalk_corp_id: authinfo.auth_corp_info.corpid,
                        dingtalk_agent_id: authinfo.auth_info.agent[0].agentid
                    })
                }

                // 初始化根部门
                let organizationDoc = await organizationsObj.findOne({ filters: [['space', '=', space._id], ["is_company", '=', true]] })
                if (organizationDoc) {
                    await organizationsObj.directUpdate(organizationDoc._id, {
                        name: space.name,
                        fullname: space.name,
                        modified_by: space.owner,
                        dingtalk_id: "1",
                        dingtalk_space: authinfo.auth_corp_info.corpid,
                        modified: new Date()
                    })
                }

                // 根据钉钉userid查询space_user
                let spaceUser = await spaceUsersObj.findOne({ filters: [['space', '=', space._id], ['user', '=', space.owner]] });
                if (spaceUser) {
                    await spaceUsersObj.directUpdate(spaceUser._id, {
                        modified_by: space.owner,
                        modified: new Date(),
                        dingtalk_id: adminUserDoc.userid,
                    })
                }

            } catch (error) {
                console.log("InitializeSpace error: ", error);
            }
        }
        // // 获取第三方应用授权企业的accessToken
        // let accessTokenInfo = await this.broker.call('@steedos/plugin-dingtalk.dingtalkGetAccessToken', {
        //     "suiteKey": suiteKey,
        //     "suiteSecret": suiteSecret,
        //     "authCorpId": authCorpId,
        //     "suiteTicket": suiteTicket
        // });
        // // 获取用户详情
        // let adminUserDoc = await this.broker.call('@steedos/plugin-dingtalk.dingtalkGetUserInfo', {
        //     "access_token": accessTokenInfo.accessToken,
        //     "userid": authinfo.auth_user_info.userId
        // });
        // try {
        //     // 创建user
        //     let adminId = []
        //     const user = await usersObj.directInsert({
        //         name: adminUserDoc.name,
        //         dingtalk_id: adminUserDoc.userid,
        //         created: new Date(),
        //         modified: new Date(),
        //         locale: "zh-cn"
        //     })
        //     adminId.push(user._id);

        //     // 初始化工作区
        //     let space = await spaceObj.findOne({ filters: [['dingtalk_corp_id', '=', authinfo.auth_corp_info.corpid]] })
        //     if (space) {
        //         // 更新工作区
        //         await spaceObj.directUpdate(space._id, {
        //             name: authinfo.auth_corp_info.full_corp_name,
        //             modified_by: space.owner,
        //             modified: new Date(),
        //             dingtalk_corp_id: authinfo.auth_corp_info.corpid,
        //             dingtalk_agent_id: auth_info.agent[0].agentid
        //         })
        //     } else {
        //         // 创建space
        //         space = await spaceObj.insert({
        //             name: authinfo.auth_corp_info.full_corp_name,
        //             owner: adminId[0],
        //             dingtalk_corp_id: authinfo.auth_corp_info.corpid,
        //             dingtalk_agent_id: authinfo.auth_info.agent[0].agentid
        //         })
        //     }

        //     // 初始化根部门
        //     let organizationDoc = await organizationsObj.findOne({ filters: [['space', '=', space._id], ["is_company", '=', true]] })
        //     if (organizationDoc) {
        //         await organizationsObj.directUpdate(organizationDoc._id, {
        //             name: space.name,
        //             fullname: space.name,
        //             modified_by: space.owner,
        //             dingtalk_id: "1",
        //             dingtalk_space: authinfo.auth_corp_info.corpid,
        //             modified: new Date()
        //         })
        //     }

        //     // 根据钉钉userid查询space_user
        //     let spaceUser = await spaceUsersObj.findOne({ filters: [['space', '=', space._id], ['user', '=', space.owner]] });
        //     if (spaceUser) {
        //         await spaceUsersObj.directUpdate(spaceUser._id, {
        //             modified_by: space.owner,
        //             modified: new Date(),
        //             dingtalk_id: adminUserDoc.userid,
        //         })
        //     }

        // } catch (error) {
        //     console.log("InitializeSpace error: ", error);
        // }

    }
}