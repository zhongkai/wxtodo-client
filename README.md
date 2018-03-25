# wxtodo-client

这是结合腾讯云开发小程序的Client端代码.

分为两个分支：master 和 online。

master分支时一款本地离线运行的todo应用，而online分支时在线版的Client端代码，需结合[小程序服务端代码](https://github.com/zhongkai/wxtodo-server)的master分支使用。

目录结构：

```
小程序项目
|-- wxtodo-client（online分支）
|-- wxtodo-server（master分支）
|-- project.config.json
```

project.config.json配置为：

```json
{
	"client": "./wxtodo-client",
	"qcloudRoot": "./wxtodo-server",
	"setting": {
		"urlCheck": true,
		"es6": false,
		"postcss": true,
		"minified": true,
		"newFeature": true
	},
	"appid": "your appid",
	"projectname": "you project name",
	"condition": {}
}
```
