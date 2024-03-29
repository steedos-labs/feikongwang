# 费控王 - SAP Concur 开源替代方案

费控王是一个开源的费控管理云服务，专为企业提供高效、易用的费用控制和报销管理解决方案。本项目基于Steedos低代码平台开发，目的是提供一个灵活、可扩展的费用管理平台。

## 特点

- **开源与自由**：项目的大部分是开源的，可以自由修改和分发。
- **易于使用**：直观的用户界面，简化费用报销流程。
- **高度可定制**：基于Steedos低代码平台，易于定制和扩展。
- **安全可靠**：采用先进的安全措施保护数据安全。

## 快速开始

```shell
# 克隆仓库
git clone https://github.com/steedos-labs/feikongwang
cd feikongwang

# 运行 Steedos 社区版
docker-compose -f steedos-platform/docker-compose.yml up

# 安装依赖
yarn

# 运行费控王
yarn dev
```

## 运行企业版平台（可选）

企业版用户可以运行企业版平台。注意，需要先停止社区版。

配置环境变量 .env.local

```shell
STEEDOS_LICENSE=...
```

```shell
docker-compose -f steedos-platform/docker-compose-ee.yml up
```

## 文档

费控王基于 Steedos 低代码平台开发，更多关于安装、配置和使用的详细信息，请参阅[文档链接](https://docs.steedos.cn)。

## 功能

- 发票录入与查重
- 费用报销审批
- 收入管理
- 支出管理
- 审批流程管理
- 数据分析和报告
- 集成企业现有系统

## 企业版特性

`ee_` 开头的文件夹是费控王的企业版特性，使用这些特性需要购买企业版许可证。这包括但不限于：

- 电子发票验真
- 电子发票扫描与识别
- 高级数据分析和报告
- 增强的安全性和合规性特性
- 优先级技术支持

如需获取企业版的更多信息和购买许可，请访问我们的[官方网站](https://feikongwang.com)。

## 在线试用

请访问[费控王云服务](https://feikongwang.com/)，点击右上角登录可以在线试用。

## 支持

如果您遇到任何问题或需要帮助，请通过[Issues](https://github.com/steedos-labs/feikongwang/issues)提交。

## 许可证

本项目根据[MIT 许可证](LICENSE.md)授权。企业版特性受单独的许可证协议约束。
