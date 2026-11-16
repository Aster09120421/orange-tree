# Cloudflare 免费长期部署

本项目使用 **Cloudflare Pages + Pages Functions + D1**。静态页面、共享 API 和 SQLite 数据库都在 Cloudflare 免费额度内。

## 一、创建 D1 数据库

1. 登录 Cloudflare Dashboard。
2. 打开 `Workers & Pages`。
3. 在左侧选择 `D1 SQL Database`。
4. 点击 `Create`。
5. 数据库名称填写：

   ```text
   orange-tree-db
   ```

6. 创建后打开该数据库的 `Console`。
7. 将项目根目录 [schema.sql](./schema.sql) 的全部内容粘贴进去并执行。

执行后应存在三张表：

```text
trees
oranges
replies
```

## 二、创建 Pages 项目

1. 打开 `Workers & Pages`。
2. 点击 `Create application`。
3. 选择 `Pages`。
4. 选择 `Connect to Git`。
5. 授权 Cloudflare 读取 GitHub。
6. 选择仓库：

   ```text
   Aster09120421/orange-tree
   ```

7. 项目名称填写：

   ```text
   orange-tree
   ```

8. Framework preset 选择 `None`。
9. Build command 留空。
10. Build output directory 填写：

    ```text
    /
    ```

如果控制台不接受 `/`，改为 `.`。

11. 点击 `Save and Deploy`。

## 三、绑定 D1

首次部署完成后：

1. 打开 Pages 项目的 `Settings`。
2. 找到 `Bindings` 或 `Functions > D1 database bindings`。
3. 点击 `Add binding`。
4. Variable name 必须填写：

   ```text
   DB
   ```

5. D1 database 选择：

   ```text
   orange-tree-db
   ```

6. 同时为 Production 和 Preview 环境添加该绑定。
7. 点击保存并重新部署。

## 四、验证 API

假设 Pages 地址为：

```text
https://orange-tree.pages.dev
```

先访问：

```text
https://orange-tree.pages.dev/api/health
```

正确结果为：

```json
{"ok":true}
```

再访问：

```text
https://orange-tree.pages.dev/api/oranges
```

初始结果应为：

```json
{"oranges":[]}
```

如果提示：

```text
D1 binding DB is not configured
```

说明 D1 绑定名称不是 `DB`，或尚未重新部署。

## 五、测试完整交互

1. 打开 Pages 首页。
2. 种一颗主树橘子。
3. 创建一棵私密树并记录六位编号。
4. 使用手机移动网络打开同一 Pages 地址。
5. 输入私密树编号。
6. 确认能读取树名、留言和回复。

## 六、自定义域名

1. 在 Pages 项目选择 `Custom domains`。
2. 添加自己的域名。
3. 根据 Cloudflare 提示配置 CNAME。
4. HTTPS 证书会自动签发。

## 七、免费额度注意事项

Cloudflare 的免费额度和页面名称可能更新，以 Dashboard 当前显示为准。个人小范围使用 Pages Functions 与 D1 通常足够；如果超出请求或数据库额度，Cloudflare 会限制调用，而不是自动产生服务器费用。
