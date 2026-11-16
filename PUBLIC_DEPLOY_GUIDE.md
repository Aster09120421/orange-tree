# 橘树小程序公网部署：手把手教程

这份教程面向第一次部署网站的人。照着做，可以让不同城市、不同手机、不同 Wi-Fi 和不同运营商网络中的用户，看到同一批橘子、留言和回复。

## 一、先理解需要部署什么

这个项目由两部分组成：

1. **网页前端**：`index.html`、树木动画、音乐、交互界面。
2. **共享后端**：`orange_server.py`，负责保存橘子、留言与回复。

只把 `index.html` 发给朋友时，页面可以打开，但每台手机的数据各自独立。要让远方的人互相看到留言，必须把整个项目部署到一个有公网域名的服务器上。

最终你会得到一个类似下面的地址：

```text
https://orange.example.com
```

把这个地址发给朋友，所有人访问的都是同一棵树。

---

## 二、部署前的检查

项目根目录应至少包含：

```text
index.html
orange-tree-standalone.html
orange_server.py
Dockerfile
docker-compose.yml
DEPLOY.md
PUBLIC_DEPLOY_GUIDE.md
```

`index.html` 是已经内嵌 CSS、JavaScript 和诗歌数据库的单文件版本。不要发送 `src/index.template.tpl`，它是构建源模板，手机直接打开时无法加载外部资源。

### 1. 本地测试后端

在项目目录运行：

```bash
python3 orange_server.py --host 0.0.0.0 --port 8080
```

浏览器打开：

```text
http://127.0.0.1:8080
```

检查以下内容：

- 页面、树和说明书能正常显示。
- 点击金橘能够显示诗歌。
- `PLANT` 可以种橘子。
- 个人橘子可以打开回复窗口。
- 自己的橘子连续点击两次 `HARVEST / 摘下` 可以移除。
- 点击 `AUDIO` 能听见《四季·春》改编音乐。

测试接口：

```text
http://127.0.0.1:8080/api/health
```

正常情况下会返回：

```json
{"ok": true}
```

如果本地都不正常，不要继续公网部署，先解决本地问题。

---

## 三、上传代码到 GitHub

Render 和 Railway 都可以直接从 GitHub 读取代码。

### 方法 A：网页上传

1. 注册并登录 GitHub。
2. 点击右上角 `+`，选择 `New repository`。
3. 仓库名可以填 `orange-tree`。
4. 选择 `Private` 或 `Public`。
5. 点击 `Create repository`。
6. 在新仓库页面选择 `uploading an existing file`。
7. 将整个项目目录中的文件上传。
8. 点击 `Commit changes`。

注意不要只上传 `index.html`。必须包含：

```text
orange_server.py
Dockerfile
docker-compose.yml
index.html
orange-tree-standalone.html
```

### 方法 B：命令行上传

在项目目录执行：

```bash
git init
git add .
git commit -m "deploy orange tree"
git branch -M main
git remote add origin https://github.com/你的用户名/orange-tree.git
git push -u origin main
```

如果 GitHub 提示登录，请按页面提示授权。

---

## 四、方案一：部署到 Render

Render 适合不想管理 Linux 服务器的人。它的界面以后可能调整，但整体步骤是相同的。

### 第一步：注册 Render

1. 打开 Render 官网。
2. 使用 GitHub 账号注册或登录。
3. 授权 Render 读取你的 GitHub 仓库。

### 第二步：创建 Web Service

1. 点击 `New`。
2. 选择 `Web Service`。
3. 找到刚才上传的 `orange-tree` 仓库。
4. 点击 `Connect`。

### 第三步：填写服务配置

名称可以填写：

```text
orange-tree
```

运行方式选择：

```text
Docker
```

Render 会自动发现项目根目录的 `Dockerfile`。

区域建议选择离主要用户较近的位置。例如主要用户在中国大陆时，可以选择新加坡或东京附近的区域；实际可选项以平台页面为准。

### 第四步：配置环境变量

添加：

```text
Key: ORANGE_DATA_PATH
Value: /data/orange-data.json
```

`PORT` 通常由 Render 自动提供，不需要手动填写。

### 第五步：添加持久化磁盘

这一步非常重要。如果不加磁盘，平台重新部署时可能清空留言。

添加 Persistent Disk：

```text
Mount Path: /data
Size: 1 GB
```

确认环境变量仍为：

```text
/data/orange-data.json
```

### 第六步：设置健康检查

健康检查路径填写：

```text
/api/health
```

点击创建或部署。

### 第七步：查看部署日志

部署过程中重点观察：

```text
Orange Tree running at http://0.0.0.0:PORT
```

如果日志显示：

```text
Address already in use
```

通常是环境中重复设置了端口，删除自定义 `PORT` 环境变量即可。

### 第八步：检查公网地址

部署完成后，Render 会提供一个地址，例如：

```text
https://orange-tree.onrender.com
```

依次测试：

```text
https://orange-tree.onrender.com/api/health
https://orange-tree.onrender.com/api/oranges
```

第一个应返回 `{"ok": true}`，第二个应返回 JSON 数据。

然后打开：

```text
https://orange-tree.onrender.com
```

确认页面样式、树、诗歌和说明书都正常。

---

## 五、做一次真正的跨网络测试

不要只在同一台电脑上开两个窗口测试。建议：

1. 手机 A 连接家里 Wi-Fi。
2. 手机 B 关闭 Wi-Fi，只使用移动数据。
3. 两台手机都打开公网地址。
4. 手机 A 点击 `PLANT`，种下一颗橘子。
5. 手机 B 刷新页面，找到这颗橘子。
6. 手机 B 点击 `REPLY / 回复`，写一句回复。
7. 手机 A 再次刷新，确认能看见回复。

如果两台手机使用不同网络仍能看到相同内容，就说明公网共享成功。

---

## 六、绑定自己的域名

平台提供的随机地址可以直接使用。如果希望更正式，可以绑定自己的域名。

### 第一步：购买域名

可以在域名注册商购买，例如：

- Cloudflare Registrar
- Namecheap
- 阿里云
- 腾讯云

### 第二步：在 Render 添加域名

1. 打开 Render 服务设置。
2. 找到 `Custom Domains`。
3. 添加域名，例如：

```text
orange.example.com
```

### 第三步：配置 DNS

Render 会显示需要添加的 DNS 记录。通常在域名服务商处添加：

```text
Type: CNAME
Name: orange
Value: Render 提供的目标地址
```

如果使用根域名，例如 `example.com`，平台可能会要求设置 ALIAS 或 A 记录。以 Render 页面显示为准。

DNS 生效可能需要几分钟到数小时。生效后，Render 会自动签发 HTTPS 证书。

### 中国大陆服务器备案提示

如果 VPS 位于中国大陆，公开使用域名和 80/443 端口通常涉及 ICP 备案。没有备案时可以选择中国香港或其他境外区域，但访问速度、平台政策和合规要求需要自行确认。

---

## 七、把静态页面连接到另一个远程 API

如果你把 `index.html` 放在 GitHub Pages，而后端部署在 Render，需要让前端知道 API 地址。

第一次打开：

```text
https://你的静态站点地址/index.html?api=https%3A%2F%2Forange-tree.onrender.com
```

注意 `?api=` 后面的地址最好进行 URL 编码。也可以使用浏览器地址栏直接打开未编码形式：

```text
?api=https://orange-tree.onrender.com
```

前端会把 API 地址保存到浏览器。以后重新打开同一页面时会继续使用该地址。

如果 API 地址更换，可以重新带一次新的 `?api=` 参数。

---

## 八、临时公网演示

暂时不想购买服务器，可以用 Cloudflare Tunnel。

### 第一步：运行后端

```bash
python3 orange_server.py --host 0.0.0.0 --port 8080
```

### 第二步：安装并运行 cloudflared

安装方法以 Cloudflare 官方文档为准。安装后运行：

```bash
cloudflared tunnel --url http://localhost:8080
```

终端会生成一个 HTTPS 地址，把它发给朋友即可。

这种模式适合演示和测试：

- 不需要服务器。
- 你的电脑必须保持开机。
- 终端关闭后，朋友将无法访问。
- 留言仍写入项目目录附近的 `orange-data.json`。

---

## 九、方案二：部署到自己的云服务器

以 Ubuntu 云服务器为例。建议至少 1 核 CPU、1 GB 内存、10 GB 磁盘。

可选择阿里云、腾讯云、华为云或其他云服务商。购买时注意地区、备案和公网 IP 规则。

### 第一步：连接服务器

```bash
ssh root@你的服务器公网IP
```

Windows 可以使用 PowerShell 或 Termius。Mac 可以直接打开终端。

### 第二步：更新系统

```bash
apt update
apt upgrade -y
```

### 第三步：安装 Docker

使用 Docker 官方安装方式，或执行：

```bash
apt install -y docker.io docker-compose-plugin git
systemctl enable --now docker
docker --version
docker compose version
```

### 第四步：拉取项目

```bash
cd /opt
git clone https://github.com/你的用户名/orange-tree.git
cd orange-tree
```

如果仓库是私有的，需要配置 GitHub 访问权限，或使用其他方式上传代码。

### 第五步：启动服务

```bash
docker compose up -d --build
```

检查状态：

```bash
docker compose ps
docker compose logs -f
```

看到服务持续运行即可按 `Ctrl+C` 退出日志查看。

### 第六步：开放测试端口

在云服务器安全组中临时开放 TCP 8080，然后访问：

```text
http://服务器公网IP:8080/api/health
```

成功后再继续配置域名与 HTTPS。

### 第七步：安装 Caddy 并配置 HTTPS

先在 `/opt/orange-tree` 创建 `Caddyfile`：

```text
orange.example.com {
    reverse_proxy 127.0.0.1:8080
}
```

安装 Caddy 后启动：

```bash
caddy run --config /opt/orange-tree/Caddyfile
```

确认正常后，以服务方式运行：

```bash
caddy start --config /opt/orange-tree/Caddyfile
```

此时需要：

1. 域名 DNS 的 A 记录指向服务器公网 IP。
2. 安全组开放 80 和 443。
3. 将 Docker Compose 中 8080 的端口映射改为：

   ```yaml
   ports:
     - "127.0.0.1:8080:8080"
   ```

4. 重新启动：

   ```bash
   docker compose up -d
   ```

5. 在安全组中关闭公网 8080，只保留 80 和 443。

访问：

```text
https://orange.example.com
```

Caddy 会自动申请并续期 HTTPS 证书。

---

## 十、数据备份与恢复

### 使用 Docker Compose

将数据复制出来：

```bash
docker run --rm \
  -v orange-tree-data:/volume \
  -v "$PWD":/backup \
  alpine sh -c "cp /volume/orange-data.json /backup/orange-data-backup.json"
```

恢复时：

```bash
docker run --rm \
  -v orange-tree-data:/volume \
  -v "$PWD":/backup \
  alpine sh -c "cp /backup/orange-data-backup.json /volume/orange-data.json"
```

### 直接查看 Render 数据

Render 不一定会开放磁盘文件浏览。建议：

1. 定期使用平台备份功能。
2. 或增加一个带管理员密码的导出接口。
3. 不要在公开页面直接暴露完整数据库。

---

## 十一、更新网站

如果修改了 `app.js`、`styles.css` 或 `src/index.template.tpl`：

```bash
python3 build_single_file.py
```

确认根目录的 `index.html` 已重新生成，然后提交：

```bash
git add .
git commit -m "update orange tree"
git push
```

Render 会自动重新部署。使用云服务器时：

```bash
cd /opt/orange-tree
git pull
python3 build_single_file.py
docker compose up -d --build
```

---

## 十二、常见问题排查

### 页面只有原始 HTML

原因通常是打开了 `src/index.template.tpl`。

解决：

```text
只打开 index.html 或 orange-tree-standalone.html
```

### 页面正常，但刷新后只有自己的留言

说明当前是本地模式，没有成功连接共享 API。

检查：

```text
/api/health
```

并在静态页面地址后添加正确的：

```text
?api=https://你的后端地址
```

### 部署后留言消失

通常是没挂载持久化磁盘，或磁盘没有挂载到 `/data`。

确认环境变量：

```text
ORANGE_DATA_PATH=/data/orange-data.json
```

确认磁盘：

```text
/data
```

### 自己的橘子无法摘下

浏览器丢失了种植者令牌。可能原因是换了设备、清除了浏览器数据或使用了隐私模式。

种植者令牌只保存在种植设备的浏览器中。其他访客可以回复，但不能删除别人种下的橘子。

### 点击 AUDIO 没有声音

先检查：

- 手机是否静音。
- 浏览器是否点击了 AUDIO。
- 页面是否被其他应用占用音频。
- 是否使用的是支持 Web Audio 的现代浏览器。

音乐和风声都由浏览器实时合成，不依赖外部音频文件。

### 端口被占用

修改本地端口：

```bash
python3 orange_server.py --port 8090
```

Docker 则修改 Compose 中右侧的 8080。

---

## 十三、正式公开前的安全建议

当前后端适合朋友、小范围社群或课程演示。面向大量陌生人开放前，建议增加：

- 用户登录或匿名访问令牌
- 发布频率限制
- 回复举报与删除入口
- 敏感词或人工审核
- 管理后台
- 数据自动备份
- 访问日志与异常监控
- 隐私政策

没有这些措施时，不要把它直接开放为大型公共留言平台。
