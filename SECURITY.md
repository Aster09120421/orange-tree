# 橘树公网安全加固

当前已启用以下防护：

1. 所有数据库操作使用 D1 参数化查询。
2. 野生 JSON 请求体限制为 8 KB。
3. API 只接受 `application/json`。
4. 跨站浏览器写请求会被同源检查拦截。
5. 每 IP 每分钟最多创建 8 条留言或橘树。
6. 每 IP 每分钟最多回复 16 次。
7. 每 IP 每分钟最多删除 10 颗橘子。
8. 私密树编号查询限制为每 IP 每分钟 18 次，降低连续猜号风险。
9. 种植者令牌使用随机 UUID，只有种植设备能删除自己的橘子。
10. 私密树销毁限制为每 IP 每分钟 3 次，并要求有效的匿名账号恢复码或旧版主人令牌。
11. 销毁私密树时同步删除整棵树、全部橘子和回复。
12. 匿名账号恢复码具有高强度随机性，服务端只保存 SHA-256 哈希，不保存可直接使用的恢复码。
13. 匿名账号创建、恢复和旧树绑定分别执行独立限流，恢复码不会写入 URL。
14. 静态页面使用 CSP、拒绝 iframe 嵌入、限制设备权限并禁用 MIME 猜测。
15. API 响应禁止搜索引擎索引和缓存。
16. 数据库定期清理过期限流记录。

## D1 迁移

新增限流功能需要执行：

```sql
CREATE TABLE IF NOT EXISTS rate_limits (
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 1,
  expires_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_rate_limits_expires
  ON rate_limits(expires_at);
```

也可以重新执行完整的 `schema.sql`，其中全部语句均使用 `IF NOT EXISTS`。

匿名账号功能新增：

```sql
CREATE TABLE IF NOT EXISTS anonymous_accounts (
  id TEXT PRIMARY KEY,
  recovery_hash TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS tree_owner_accounts (
  tree_code INTEGER PRIMARY KEY,
  account_id TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL
);
```

## Cloudflare 层防护

绑定自定义域名后，可以在 Cloudflare Security 中继续启用：

- Bot Fight Mode
- Rate limiting rules
- WAF managed rules
- Under Attack Mode（仅在攻击期间临时启用）

`pages.dev` 子域名本身不能使用完整 WAF 自定义规则，因此应用内部限流仍然必要。

## 仍需注意

- 六位编号相当于访问密码，不是端到端加密。
- 当前没有账号体系和内容审核。
- 正式面向大量陌生人开放前，建议启用 Turnstile、管理员审核和离线备份。
- 应在 Cloudflare D1 中定期使用 Time Travel 创建恢复点。
