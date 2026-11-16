# ORANGE_TREE_07

一个无需安装依赖的参数化数字橘树。打开后即可看到由枝干网络、叶簇数据点和金橘节点实时构成的主画面。

## 运行

直接双击 `index.html`，或在当前目录启动任意静态文件服务：

```bash
python3 -m http.server 8080
```

然后访问 `http://localhost:8080`。

如果要让同一网络里的其他设备看到同一批橘子和回复，请使用随附的共享服务：

```bash
python3 orange_server.py --host 0.0.0.0 --port 8080
```

同一 Wi-Fi 下的其他设备访问 `http://你的电脑局域网IP:8080`。种橘子、回复和署名都会保存到 `orange-data.json`。直接打开单文件时，功能仍然可用，但留言与回复只保存在当前浏览器。

### 公网共享

要让不同网络中的设备互相访问，必须把 `orange_server.py` 部署到一台公网可访问的服务器。单纯发送 HTML 文件无法共享写入数据。

项目已附带 `Dockerfile`，可将整个目录部署到支持 Docker 和持久化磁盘的平台，例如 Render、Railway 或自己的云服务器：

完整的 Render、Railway、云服务器和临时隧道步骤见 [DEPLOY.md](./DEPLOY.md)。第一次部署建议直接阅读 [PUBLIC_DEPLOY_GUIDE.md](./PUBLIC_DEPLOY_GUIDE.md)。

```bash
docker build -t orange-tree .
docker run -d -p 8080:8080 -v orange-tree-data:/data orange-tree
```

后端取得公网地址后，可以直接通过该地址访问。如果使用另一处静态托管的 `index.html`，在网址后添加一次远程服务地址：

```text
index.html?api=https://your-orange-server.example.com
```

地址会保存在当前浏览器，以后不需要重复填写。请给持久化磁盘挂载到 `/data`，否则平台重新部署时可能清空数据。公网版本目前没有账号和审核系统，正式开放前应增加登录、删除权限与管理机制。

如果只想临时让远方朋友访问，也可以在电脑运行服务后使用 `cloudflared` 或 `ngrok` 建立 HTTPS 隧道，并将生成的公网地址分享给对方。电脑关闭后，隧道和访问会随之停止。

`index.html` 是自包含版本，CSS、JavaScript 与诗歌数据库都已内嵌，可直接通过微信、QQ 或安卓文件管理器打开。修改 `styles.css`、`app.js` 或 `poetry-db.js` 后，运行以下命令重新生成：

```bash
python3 build_single_file.py
```

## 交互

- 点击或键盘选择金橘：完成一次采集调用。
- 每摘下一颗金橘，会出现一条与该果实对应的含蓄短诗。
- 诗歌来自本地 [poetry-db.js](./poetry-db.js) 数据库，目前共 357 条，包含中国古典诗词、中国近现代公版诗作、外国诗歌双语摘句和原创批注。
- 页面刷新或点击 `REGENERATE` 后，整棵树的诗句会重新洗牌。
- 点击 `PLANT` 可以种下一颗带个人留言的橘子；留言保存在当前浏览器，刷新或重建树后仍会保留。
- 点击 `我的橘树` 可以创建一棵带名称和六位编号的独立橘树；输入别人的编号可以进入对应空间查看留言并回复。
- 创建私密树时无需填写编号，系统会自动生成随机六位编号；有朋友分享编号时，可通过“进入朋友的橘树”展开入口。
- 私密树创建者可以在“我的橘树”面板中销毁自己的树；连续点击两次确认后，该树及全部留言、回复会被永久删除。
- 主树与私密树使用独立数据空间：切换视图不会删除主树留言、私密树或已创建的六位编号。
- 六位编号相当于访问密码，拿到编号的人都可以进入该树空间；当前版本不是端到端加密。
- 点击个人橘子上的 `REPLY / 回复`，可以查看完整回复线程并继续回复。
- 通过 `orange_server.py` 运行时，个人橘子和回复会跨设备共享。
- 自己的橘子点开后会出现 `HARVEST / 摘下`，连续点击两次即可移除。
- 全树最多保留 28 颗个人橘子；摘下自己的那一颗会立即释放名额。
- `APPLY WIND`：执行一次风场脉冲。
- `REGENERATE`：使用新种子重建枝干、叶簇和果实节点。
- 右上角 `AUDIO`：开启或关闭维瓦尔第《四季·春》第一乐章主题的舒缓合成改编；刮风时只播放轻柔风声。
- 右上角 `MODE`：切换明暗图纸模式。
- 右上角 `GUIDE`：打开页面内使用说明。
- 右上角 `LANG`：切换简体中文、English、日本語、한국어、Español、Français、Deutsch、Русский 八种界面语言。
- 快捷键：`W` 风场，`R` 重新生成。

页面已适配桌面与手机，并支持 `prefers-reduced-motion`。

## Cloudflare 免费部署

免费长期在线方案使用 Cloudflare Worker、Static Assets 和 D1。完整的数据库初始化、Worker 配置和部署步骤见 [CLOUDFLARE_DEPLOY.md](./CLOUDFLARE_DEPLOY.md)。

应用层限流、CSP、同源写入保护和 D1 安全说明见 [SECURITY.md](./SECURITY.md)。

## 不部署公网服务器时如何跨网络

纯静态 HTML 无法让不同设备共享写入数据。如果不购买云服务器，可以使用以下方式：

1. **临时公网隧道**：在本机运行 `python3 orange_server.py`，再用 `cloudflared tunnel --url http://localhost:8080` 或 `ngrok http 8080` 生成临时 HTTPS 地址。不同网络中的设备可以访问，但你的电脑必须保持开机。
2. **现成托管数据库**：使用 Supabase、Firebase 等云数据服务代替自建服务器。仍然需要注册服务和配置 API，但不需要自己维护服务器。
3. **纯 P2P WebRTC**：理论上可以直连，但需要额外的信令服务，而且双方必须同时在线，聊天记录也不适合长期保存。

最简单、不需要部署服务器的演示方式是临时公网隧道。详细命令见 [PUBLIC_DEPLOY_GUIDE.md](./PUBLIC_DEPLOY_GUIDE.md)。
