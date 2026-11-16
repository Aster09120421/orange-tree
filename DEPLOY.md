# 橘树公网部署说明

不同网络中的设备要互相看到留言和回复，必须有一个公开可访问的后端。直接发送 `index.html` 只能在自己的浏览器中保存留言。

项目后端已经放在 `orange_server.py`，并提供 `Dockerfile`。部署时最关键的是给 `/data` 挂载持久化磁盘。

## 方案一：Render

1. 把整个项目上传到 GitHub 仓库。
2. 登录 Render，选择 **New > Web Service**。
3. 连接该 GitHub 仓库。
4. Runtime 选择 **Docker**，Render 会自动读取 `Dockerfile`。
5. 环境变量增加：

   ```text
   ORANGE_DATA_PATH=/data/orange-data.json
   ```

6. 添加 Persistent Disk，挂载路径填写 `/data`，容量 1 GB 即可。
7. Health Check Path 填写 `/api/health`。
8. 部署完成后，Render 会给出类似下面的公网地址：

   ```text
   https://orange-tree.onrender.com
   ```

9. 将这个地址发给其他人即可。

如果使用免费实例，请确认平台是否允许持久化磁盘以及实例休眠规则。没有持久化磁盘时，平台重新部署可能清空留言。

## 方案二：Railway

1. 将项目推送到 GitHub。
2. 在 Railway 中选择 **Deploy from GitHub Repo**。
3. Railway 会通过 `Dockerfile` 自动构建。
4. 创建一个 Volume，并挂载到 `/data`。
5. 添加环境变量：

   ```text
   ORANGE_DATA_PATH=/data/orange-data.json
   ```

6. 在 Networking 中生成公开域名。

## 方案三：自己的云服务器

服务器安装 Docker 后，将项目上传并执行：

```bash
docker build -t orange-tree .
docker run -d \
  --name orange-tree \
  --restart unless-stopped \
  -p 8080:8080 \
  -v orange-tree-data:/data \
  orange-tree
```

然后：

1. 在云服务器安全组中开放 8080 端口。
2. 使用 `http://服务器公网IP:8080` 访问。
3. 正式分享前建议安装 Caddy 或 Nginx，把站点反向代理到 8080，并配置域名与 HTTPS。

查看运行状态：

```bash
docker logs -f orange-tree
```

备份留言数据：

```bash
docker cp orange-tree:/data/orange-data.json ./orange-data-backup.json
```

## 临时公网演示

不想立刻购买服务器，可以先运行：

```bash
python3 orange_server.py --host 0.0.0.0 --port 8080
```

再用 Cloudflare Tunnel：

```bash
cloudflared tunnel --url http://localhost:8080
```

或 ngrok：

```bash
ngrok http 8080
```

工具会生成一个 HTTPS 地址。电脑关闭后，这个临时地址也会失效。

## 静态页面连接远程后端

如果 HTML 放在 GitHub Pages，而 API 部署在 Render，首次打开时使用：

```text
https://你的静态站点/index.html?api=https%3A%2F%2Forange-tree.onrender.com
```

页面会记住这个 API 地址。后端已经允许跨域请求。

## 正式开放前

当前版本没有账号、验证码、敏感词过滤和管理员审核，适合朋友间的小范围使用。公开给大量陌生人之前，应增加：

- 登录或匿名访问令牌
- 删除与举报权限
- 发布频率限制
- 内容审核和备份
- 域名、HTTPS 与隐私说明
