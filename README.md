# 二维码生成器 - Brave浏览器扩展

一个轻量级的Brave/Chrome浏览器扩展，支持右键快速生成二维码，模态框显示。

## 功能特性

- 🖱️ **右键菜单**：在页面、选中文字、链接、图片上右键生成二维码
- 🪟 **模态框显示**：优雅的模态框展示二维码，支持动画效果
- 📋 **复制内容**：一键复制二维码对应的文本内容
- 💾 **下载二维码**：支持将二维码保存为PNG图片
- ⌨️ **快捷键支持**：按ESC键快速关闭模态框
- 🎨 **精美UI**：渐变紫色主题，现代化设计风格
- 🔒 **纯本地生成**：所有二维码在本地生成，不上传任何数据

## 安装方法

### 方法一：开发者模式加载（推荐）

1. 打开Brave浏览器，在地址栏输入 `brave://extensions/` 并回车
2. 开启右上角的 **"开发者模式"** 开关
3. 点击 **"加载已解压的扩展程序"** 按钮
4. 选择本扩展所在的文件夹（包含 manifest.json 的目录）
5. 安装完成！扩展图标会出现在浏览器工具栏

### 方法二：Chrome网上应用店

（如需发布到应用商店，可打包为 .crx 文件）

## 使用方法

### 方式一：右键菜单

1. **生成当前页面二维码**：在页面空白处右键 → 选择"生成当前页面二维码"
2. **生成选中文字二维码**：选中一段文字 → 右键 → 选择"生成选中文字二维码"
3. **生成链接二维码**：在链接上右键 → 选择"生成此链接二维码"
4. **生成图片地址二维码**：在图片上右键 → 选择"生成此图片地址二维码"

### 方式二：点击扩展图标

点击浏览器工具栏上的扩展图标，直接生成当前页面的二维码。

## 模态框操作

- **关闭**：点击右上角 × 按钮、点击遮罩层、或按 ESC 键
- **复制内容**：点击"复制内容"按钮，将二维码内容复制到剪贴板
- **下载二维码**：点击"下载二维码"按钮，保存为 PNG 图片

## 文件结构

```
qrcode-extension/
├── manifest.json       # 扩展配置文件（Manifest V3）
├── background.js       # 后台服务，处理右键菜单与按需注入
├── content.js          # 内容脚本，显示模态框
├── qrcode.min.js       # QR码生成库（纯本地）
├── modal.css           # 模态框样式
├── icons/              # 扩展图标
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
├── store/              # 上架相关
│   ├── STORE_SUBMISSION.md   # 上架指南
│   ├── privacy-policy.html   # 隐私政策
│   └── package.ps1           # 打包脚本
└── README.md           # 说明文档
```

## 技术说明

- 使用 **Manifest V3** 标准，兼容 Chrome/Edge/Brave 等 Chromium 内核浏览器
- QR码生成基于开源库 qrcode-generator（Kazuhiko Arase）
- 纯前端实现，无需网络请求，保护隐私
- 支持中文等 UTF-8 字符
- 按需注入内容脚本（`activeTab` + `scripting`），不预加载到所有页面

## 上架 Chrome 网上应用店

完整上架步骤见 [store/STORE_SUBMISSION.md](store/STORE_SUBMISSION.md)。

仓库地址：https://github.com/corle-bell/QR_Code_Creator

快速打包：

```powershell
.\store\package.ps1
```

生成 `dist/qrcode-extension-v1.0.0.zip` 后，上传至 [Chrome 开发者控制台](https://chrome.google.com/webstore/devconsole)。

隐私政策模板：`store/privacy-policy.html`（需托管到 GitHub Pages 等公开 URL）。

## 常见问题

**Q: 为什么右键菜单不显示？**
A: 请确认扩展已正确加载，并且刷新了页面。新安装的扩展需要刷新页面才能注入内容脚本。

**Q: 二维码能生成多长的内容？**
A: 支持最多约 500 个汉字或 1200 个英文字符，超过会自动选择更大的二维码版本。

**Q: 会收集我的数据吗？**
A: 不会。所有二维码都在本地生成，不会上传任何数据到服务器。

## 许可证

MIT License
