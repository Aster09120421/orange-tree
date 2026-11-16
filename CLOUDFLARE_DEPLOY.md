# Cloudflare Worker 免费长期部署

本项目使用 Cloudflare Worker、Static Assets 和 D1。网页、共享 API、主树留言、私密橘树和回复都由同一个 Worker 提供。

## 一、D1 数据库

数据库名称：

```text
orange-tree-db
```

在当前项目中，数据库 ID 已配置为：

```text
b2400b11-cadb-45a2-9658-686b40eff819
```

如果重新创建了数据库，需要同步修改 `wrangler.toml` 中的 `database_id`。

在 D1 Console 执行根目录 `schema.sql`，会创建：

```text
trees
oranges
replies
```

## 二、Worker 项目

Cloudflare 中已经存在的 Worker 名称应为：

```text
orange-tree
```

仓库根目录现在包含：

```text
worker/index.js
worker/api.js
public/index.html
public/orange-tree-standalone.html
wrangler.toml
package.json
```

`wrangler.toml` 已经完成：

- Worker 入口绑定
- 静态资源目录 `public`
- D1 绑定名称 `DB`
- 数据库名称和 ID

## 三、Cloudflare 构建设置

Worker 的 Build settings 应填写：

```text
Build command: npm install
Deploy command: npx wrangler deploy
Root directory: /
```

不需要设置 Build output directory。

GitHub 推送后点击：

```text
Retry build
```

## 四、验证部署

构建成功后，在 Worker 的 `Settings > Domains & Routes` 中可以看到地址，例如：

```text
https://orange-tree.你的子域.workers.dev
```

依次检查：

```text
https://orange-tree.你的子域.workers.dev/api/health
https://orange-tree.你的子域.workers.dev/api/oranges
```

正确结果：

```json
{"ok":true}
```

```json
{"oranges":[]}
```

打开 Worker 首页后测试：

1. 在主树种下一颗留言橘子。
2. 刷新后仍能看到留言。
3. 创建一棵带名称和六位编号的私密橘树。
4. 使用手机移动网络访问 Worker 地址。
5. 输入编号并回复。

## 五、绑定检查

如果接口返回：

```text
D1 binding DB is not configured
```

检查 `wrangler.toml`：

```toml
[[d1_databases]]
binding = "DB"
database_name = "orange-tree-db"
database_id = "b2400b11-cadb-45a2-9658-686b40eff819"
```

也可以在 Worker 的 `Settings > Bindings` 中添加：

```text
Type: D1 database
Variable name: DB
Database: orange-tree-db
```

## 六、自定义域名

在 Worker 的 `Settings > Domains & Routes` 中添加 Custom Domain，Cloudflare 会自动配置 HTTPS。

## 七、免费额度

Workers、Static Assets 和 D1 都有免费额度。额度与平台规则可能调整，以 Cloudflare Dashboard 当前显示为准。个人小范围使用通常足够。
