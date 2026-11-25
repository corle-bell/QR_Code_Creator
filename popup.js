// popup.js - 工具栏弹窗 / 独立生成窗口

(function () {
  'use strict';

  function isPrefillableUrl(url) {
    if (!url) return false;
    try {
      var parsed = new URL(url);
      var protocol = parsed.protocol.toLowerCase();
      if (protocol !== 'http:' && protocol !== 'https:' && protocol !== 'ftp:' && protocol !== 'file:') {
        return false;
      }
      var host = (parsed.hostname || '').toLowerCase();
      if (host === 'chromewebstore.google.com') return false;
      if (host === 'chrome.google.com' && parsed.pathname.indexOf('/webstore') === 0) return false;
      return true;
    } catch (e) {
      return false;
    }
  }

  function closeWindow() {
    window.close();
  }

  document.addEventListener('DOMContentLoaded', function () {
    var params = new URLSearchParams(location.search);
    var isWindow = params.get('source') === 'window';
    if (isWindow) {
      document.documentElement.classList.add('qrcode-standalone');
    }

    var closeBtn = document.querySelector('.qrcode-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeWindow);
    }
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        closeWindow();
      }
    });

    var start = isWindow ? loadDraftContent() : loadTabUrl();
    start.then(function (state) {
      var titleEl = document.querySelector('.qrcode-modal-title');
      if (titleEl) {
        titleEl.textContent = state.label ? ('二维码 - ' + state.label) : '二维码生成器';
      }

      var ui = window.QRCodeUI.bindGenerator(document, {
        initialContent: state.content,
        size: 256
      });

      ui.focus();
    }).catch(function () {
      window.QRCodeUI.bindGenerator(document, { initialContent: '', size: 256 }).focus();
    });
  });

  function loadDraftContent() {
    return chrome.storage.session.get('qrDraft').then(function (data) {
      var draft = data && data.qrDraft;
      var content = draft && draft.content ? draft.content : '';
      var label = draft && draft.label ? draft.label : '自定义内容';
      if (draft) {
        return chrome.storage.session.remove('qrDraft').then(function () {
          return { content: content, label: label };
        });
      }
      return { content: '', label: '自定义内容' };
    }).catch(function () {
      return { content: '', label: '自定义内容' };
    });
  }

  function loadTabUrl() {
    return chrome.tabs.query({ active: true, currentWindow: true }).then(function (tabs) {
      var tab = tabs && tabs[0];
      var url = tab && tab.url;
      if (isPrefillableUrl(url)) {
        return { content: url, label: '当前页面' };
      }
      return { content: '', label: '自定义内容' };
    }).catch(function () {
      return { content: '', label: '自定义内容' };
    });
  }
})();
