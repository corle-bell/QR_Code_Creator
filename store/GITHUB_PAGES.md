# GitHub Pages 部署隐私政策

将 `privacy-policy.html` 托管到公开 URL，供 Chrome 网上应用店审核使用。

**本仓库地址：** https://github.com/corle-bell/QR_Code_Creator

---

## 前提

- 已有 GitHub 账号（corle-bell）
- 代码已推送到上述仓库

---

## 步骤 1：推送代码

在项目根目录执行：

```bash
git add .
git commit -m "Prepare extension for Chrome Web Store"
git branch -M main
git push -u origin main
```

---

## 步骤 2：启用 GitHub Pages

打开 https://github.com/corle-bell/QR_Code_Creator/settings/pages

**推荐方式：GitHub Actions（本项目已包含工作流）**

1. **Build and deployment** → Source 选择 **GitHub Actions**
2. 推送代码后，打开 **Actions** 标签，确认 `Deploy GitHub Pages` 工作流运行成功（绿色 ✓）
3. 首次部署可能需要 2–10 分钟

**备选方式：Deploy from a branch**

1. Source 选择 **Deploy from a branch**
2. Branch 选 **`main`**，文件夹选 **`/ (root)`**（不是 `/docs`）
3. 根目录需有 `.nojekyll` 文件（已包含）

> 若访问 404，最常见原因：Source 选成了 `/docs`、分支选成了 `master`、或 Actions 工作流未运行成功。

```
https://corle-bell.github.io/QR_Code_Creator/
```

---

## 404 排查

| 检查项 | 正确设置 |
|--------|----------|
| Pages Source | **GitHub Actions** 或 Branch = `main` + `/ (root)` |
| 分支名 | 必须是 `main`（不是 `master`） |
| Actions 状态 | https://github.com/corle-bell/QR_Code_Creator/actions 显示绿色成功 |
| 等待时间 | 首次部署有时需 10 分钟 |
| 测试 URL | 先访问根路径 https://corle-bell.github.io/QR_Code_Creator/ |

若仍 404，到 Settings → Pages 确认顶部是否显示 **"Your site is live at ..."**。

浏览器打开：

| 语言 | URL |
|------|-----|
| 中文 | https://corle-bell.github.io/QR_Code_Creator/store/privacy-policy.html |
| 英文 | https://corle-bell.github.io/QR_Code_Creator/store/privacy-policy-en.html |

---

## 步骤 4：填入 Chrome 开发者控制台

1. 登录 [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. 进入扩展 → **Privacy** 标签
3. **Privacy policy URL** 填入：

```
https://corle-bell.github.io/QR_Code_Creator/store/privacy-policy.html
```

4. 勾选 **Does not collect user data**

---

## manifest 主页

`manifest.json` 已配置：

```json
"homepage_url": "https://corle-bell.github.io/QR_Code_Creator/"
```

更新 manifest 后请重新运行 `.\store\package.ps1` 打包。

---

## 常见问题

**Q: Pages 显示 404？**  
A: 确认代码已 push 到 `main`，并等待几分钟。

**Q: 仓库是空的？**  
A: 先完成步骤 1 推送代码，再启用 Pages。
