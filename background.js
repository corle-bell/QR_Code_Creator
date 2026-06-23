// background.js - 服务工作线程

const CONTENT_FILES = ["qrcode.min.js", "content.js"];
const STYLE_FILES = ["modal.css"];

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "qrcode-page",
    title: "生成当前页面二维码",
    contexts: ["page"]
  });

  chrome.contextMenus.create({
    id: "qrcode-selection",
    title: "生成选中文字二维码",
    contexts: ["selection"]
  });

  chrome.contextMenus.create({
    id: "qrcode-link",
    title: "生成此链接二维码",
    contexts: ["link"]
  });

  chrome.contextMenus.create({
    id: "qrcode-image",
    title: "生成此图片地址二维码",
    contexts: ["image"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  const payload = getPayloadFromMenu(info, tab);
  if (!payload) {
    return;
  }
  showQRCodeInTab(tab.id, payload.content, payload.label);
});

chrome.action.onClicked.addListener((tab) => {
  if (!tab.id || !tab.url) {
    return;
  }
  showQRCodeInTab(tab.id, tab.url, "当前页面");
});

function getPayloadFromMenu(info, tab) {
  let content = "";
  let label = "";

  switch (info.menuItemId) {
    case "qrcode-page":
      content = info.pageUrl || tab.url;
      label = "当前页面";
      break;
    case "qrcode-selection":
      content = info.selectionText || "";
      label = "选中文字";
      break;
    case "qrcode-link":
      content = info.linkUrl || "";
      label = "链接地址";
      break;
    case "qrcode-image":
      content = info.srcUrl || "";
      label = "图片地址";
      break;
    default:
      return null;
  }

  if (!content) {
    return null;
  }

  return { content, label };
}

async function showQRCodeInTab(tabId, content, label) {
  const message = {
    action: "showQRCode",
    content,
    label
  };

  try {
    await chrome.tabs.sendMessage(tabId, message);
    return;
  } catch (err) {
    // 内容脚本尚未注入，按需注入后再发送
  }

  try {
    await chrome.scripting.executeScript({
      target: { tabId },
      files: CONTENT_FILES
    });
    await chrome.scripting.insertCSS({
      target: { tabId },
      files: STYLE_FILES
    });
    await chrome.tabs.sendMessage(tabId, message);
  } catch (err) {
    console.error("无法在此页面生成二维码:", err);
  }
}
