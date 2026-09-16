# Iris & Zhenzhen · Mexico & Latin America Trip

一个单文件 Cloudflare Worker,GET `/` 返回完整旅行手册页面,`/api/todos`
提供待办清单的多端同步读写(存在 Cloudflare KV 里)。

## 仓库结构

```
worker.js        ← 唯一的代码文件,HTML/CSS/JS 和行程数据全部内嵌在里面
wrangler.toml     ← Cloudflare 的配置文件,告诉它 KV 绑定叫 TRIP_KV
```

## 一次性部署步骤(你已有 GitHub 和 Cloudflare 账号,照着做一遍就行)

### 1. 建 GitHub 仓库
1. 打开 github.com → 右上角 `+` → **New repository**
2. 仓库名随便起,比如 `latam-trip`,设为 **Private**(行程细节不想被搜索引擎收录的话选私有,不影响后面访问网页)
3. 建好后,把 `worker.js` 和 `wrangler.toml` 这两个文件上传上去(网页右上角 **Add file → Upload files**,拖进去,commit)

### 2. 在 Cloudflare 建 KV 命名空间(存待办清单用)
1. 登录 dash.cloudflare.com → 左侧菜单 **Storage & Databases → KV**
2. 点 **Create namespace**,名字随便起,比如 `trip-todos`,创建后复制它的 **Namespace ID**
3. 打开 `wrangler.toml`,把 `REPLACE_WITH_YOUR_KV_NAMESPACE_ID` 换成刚才复制的 ID,存回 GitHub 仓库(网页上直接编辑该文件、commit 即可)

### 3. 把 Worker 和 GitHub 仓库连起来
1. Cloudflare 控制台 → 左侧菜单 **Workers & Pages**
2. 点 **Create → Workers → Connect to Git**(如果找不到这个入口,搜索 "Workers Builds",这是 Cloudflare 给 Workers 做的 Git 自动部署功能)
3. 选择 GitHub,授权后选中你刚才建的仓库,分支选 `main`
4. Build 配置全部留空/默认(因为没有 build 步骤,`worker.js` 直接就是产物),确认部署
5. 部署成功后 Cloudflare 会给你一个 `xxx.workers.dev` 的网址,这就是可以直接发给朋友的链接

### 4. 确认 KV 绑定生效
1. 部署完成后,回到这个 Worker 的详情页 → **Settings → Bindings**
2. 确认有一条 KV 绑定,变量名是 `TRIP_KV`,指向你在第2步建的命名空间(如果 wrangler.toml 里的 ID 填对了,这一步会自动生效;没生效的话在这个页面手动加一条也可以)

### 5. 以后怎么更新
以后想改行程内容,直接在 GitHub 上编辑 `worker.js`(或者让我改好新版本发你,你复制粘贴替换整个文件内容),commit 到 `main` 分支,Cloudflare 会自动重新部署,几十秒后刷新网页就是新版本 —— 这就是你说的"我 push 你就上线"。

## 自定义域名(可选)
如果想用自己的域名而不是 `xxx.workers.dev`:
Cloudflare 控制台 → 这个 Worker → **Settings → Domains & Routes → Add → Custom domain**,前提是这个域名已经托管在你的 Cloudflare 账号下。不需要也完全不影响使用,`workers.dev` 的链接本身就可以直接分享、手机打开。

## 关于隐私
页面公开可见,但没有放确认号、证件号、房间号——地址和入住/离店时间是公开的,这个如果你不想公开也可以告诉我改成不显示门牌号只显示城市。
