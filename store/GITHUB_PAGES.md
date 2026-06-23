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

1. 打开 https://github.com/corle-bell/QR_Code_Creator/settings/pages
2. **Build and deployment** → Source 选择 **Deploy from a branch**
3. **Branch** 选择 `main`，文件夹选择 **`/ (root)`**
4. 点击 **Save**

等待 1–2 分钟，站点地址为：

```
https://corle-bell.github.io/QR_Code_Creator/
```

---

## 步骤 3：确认隐私政策可访问

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
