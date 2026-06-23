# Chrome 网上应用店上架指南

本文档帮助你将「二维码生成器」扩展提交到 Chrome Web Store。

## 一、上架前准备

### 1. 开发者账号

1. 访问 [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. 使用 Google 账号登录
3. 支付 **一次性 $5 USD** 开发者注册费
4. 完成开发者身份验证（可能需要 1–3 个工作日）

### 2. 托管隐私政策

Chrome 要求提供可公开访问的隐私政策 URL。

**推荐方式：GitHub Pages**

1. 将 `store/privacy-policy.html` 推送到 GitHub 仓库
2. 在仓库 Settings → Pages 中启用 GitHub Pages
3. 获得 URL：`https://corle-bell.github.io/QR_Code_Creator/store/privacy-policy.html`
4. 在 `manifest.json` 中可选添加 `"homepage_url"` 指向你的仓库

### 3. 准备宣传素材

| 素材 | 尺寸 | 数量 | 说明 |
|------|------|------|------|
| 扩展图标 | 128×128 | 1 | 已包含在 `icons/icon128.png` |
| 截图 | 1280×800 或 640×400 | 至少 1 张，建议 3–5 张 | 展示右键菜单、模态框、下载功能 |
| 小型宣传图块 | 440×280 | 可选 | 商店推荐位使用 |
| 顶部宣传图块 | 1400×560 | 可选 | 精选推荐位使用 |

**截图建议内容：**

1. 在网页上右键，显示「生成选中文字二维码」菜单
2. 模态框展示二维码（含复制、下载按钮）
3. 点击工具栏图标生成当前页面二维码

可用 Windows 截图工具或浏览器开发者模式调整窗口尺寸后截图。

---

## 二、打包扩展

在项目根目录运行：

```powershell
.\store\package.ps1
```

将在 `dist/` 目录生成 `qrcode-extension-v1.0.0.zip`，用于上传。

**zip 包内应只包含：**

- manifest.json
- background.js
- content.js
- qrcode.min.js
- modal.css
- icons/

不要包含 README、store 文档、.git 等文件。

---

## 三、开发者控制台填表

### Store listing（商店信息）

**中文**

| 字段 | 建议内容 |
|------|----------|
| 扩展程序名称 | 二维码生成器 |
| 简短说明（132 字符内） | 右键快速生成二维码，支持页面链接、选中文字、图片地址，纯本地生成，保护隐私。 |
| 详细说明 | 见下方「详细说明模板」 |
| 类别 | Productivity（生产力） |
| 语言 | 中文（简体） |

**详细说明模板：**

```
二维码生成器是一款轻量级浏览器扩展，帮助您快速将网页内容转换为二维码。

主要功能：
• 右键菜单：在页面、选中文字、链接、图片上右键即可生成二维码
• 工具栏图标：一键生成当前页面 URL 的二维码
• 模态框展示：清晰预览二维码，支持复制内容与下载 PNG 图片
• 纯本地生成：所有二维码在您的设备上生成，不上传任何数据
• 支持中文：完整支持 UTF-8 字符

使用方法：
1. 安装扩展后，在任意网页上右键选择相应菜单项
2. 或点击浏览器工具栏上的扩展图标
3. 在弹出的模态框中复制内容或下载二维码图片

隐私承诺：
本扩展不收集、不存储、不上传任何用户数据。所有处理均在本地完成。

适用于 Chrome、Edge、Brave 等 Chromium 内核浏览器。
```

**英文（可选，扩大受众）**

| 字段 | 建议内容 |
|------|----------|
| Name | QR Code Generator |
| Short description | Generate QR codes from pages, selected text, links & images. 100% local, privacy-first. |
| Category | Productivity |

### Privacy practices（隐私做法）

在 Developer Dashboard 的 Privacy 标签页填写：

| 问题 | 选择 |
|------|------|
| 是否收集用户数据 | **否** / 不收集 |
| 隐私政策 URL | 你的 GitHub Pages 链接 |
| 数据用途 | 不适用（不收集数据） |
| 是否与第三方共享 | **否** |
| 是否用于无关目的 | **否** |
| Limited Use 认证 | 勾选确认符合 Limited Use 要求 |

**权限理由（审核可能询问）：**

- `contextMenus`：添加右键「生成二维码」菜单
- `activeTab`：仅在用户点击菜单或图标时访问当前标签页
- `scripting`：在用户操作的页面上注入二维码显示界面

### Distribution（分发）

- **可见性**：Public（公开）
- **地区**：所有地区，或选择目标市场
- **定价**：Free（免费）

---

## 四、提交流程

1. 登录 [Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. 点击 **New item** → 上传 `dist/qrcode-extension-v1.0.0.zip`
3. 填写 Store listing、Privacy、Distribution
4. 上传至少 1 张截图
5. 点击 **Submit for review**

审核通常需要 **1–3 个工作日**，复杂情况可能更长。

---

## 五、常见拒审原因与对策

| 拒审原因 | 本扩展状态 |
|----------|------------|
| 权限过宽（`<all_urls>` 预注入） | ✅ 已改为按需注入，仅 `activeTab` + `scripting` |
| 远程代码 / eval | ✅ 所有代码打包在扩展内 |
| 缺少隐私政策 | ⚠️ 需托管 `privacy-policy.html` 并填写 URL |
| 功能与描述不符 | ⚠️ 确保截图与描述一致 |
| 图标质量差 | ✅ 已更新正式图标 |
| 单用途政策 | ✅ 扩展仅做二维码生成 |

---

## 六、版本更新

1. 修改 `manifest.json` 中的 `version`（如 `1.0.1`）
2. 运行 `.\store\package.ps1` 重新打包
3. 在 Developer Dashboard 上传新 zip
4. 填写更新说明后提交审核

---

## 七、补充文档

| 文档 | 说明 |
|------|------|
| [GITHUB_PAGES.md](GITHUB_PAGES.md) | 隐私政策 GitHub Pages 部署步骤 |
| [listing-en.md](listing-en.md) | 英文商店描述（可直接复制） |
| [SCREENSHOTS.md](SCREENSHOTS.md) | 截图尺寸与拍摄指南 |

---

## 八、Brave / Edge 商店（可选）

- **Microsoft Edge Add-ons**：可复用同一 zip，提交至 [Partner Center](https://partner.microsoft.com/dashboard/microsoftedge/overview)
- **Brave**：目前主要通过 Chrome Web Store 安装，或用户手动加载

---

## 检查清单

- [ ] 开发者账号已注册并验证
- [ ] 隐私政策已托管并可公开访问
- [ ] 截图已准备（至少 1 张）
- [ ] 运行 `package.ps1` 生成 zip
- [ ] Store listing 中英文描述已填写
- [ ] Privacy 标签页已正确声明「不收集数据」
- [ ] 本地测试：右键菜单、图标点击、复制、下载均正常
