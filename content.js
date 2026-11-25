// content.js - 内容脚本，负责显示二维码模态框

(function() {
  'use strict';

  if (window.__QRCODE_EXTENSION_LOADED__) {
    return;
  }
  window.__QRCODE_EXTENSION_LOADED__ = true;

  var MODAL_ID = 'qrcode-extension-modal';
  var modalElement = null;
  var generator = null;

  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'showQRCode') {
      showModal(request.content, request.label);
      sendResponse({ success: true });
    }
    return true;
  });

  function showModal(content, label) {
    if (modalElement) {
      removeModal(true);
    }

    modalElement = document.createElement('div');
    modalElement.id = MODAL_ID;
    modalElement.className = 'qrcode-modal-overlay';
    modalElement.innerHTML = createModalHTML(label);
    document.body.appendChild(modalElement);

    generator = window.QRCodeUI.bindGenerator(modalElement, {
      initialContent: content || '',
      size: 256,
      toastHost: document.body
    });

    bindEvents();

    setTimeout(function() {
      if (modalElement) {
        modalElement.classList.add('show');
        generator.focus();
      }
    }, 10);
  }

  function createModalHTML(label) {
    return '\
      <div class="qrcode-modal-content">\
        <div class="qrcode-modal-header">\
          <h3 class="qrcode-modal-title">二维码 - ' + window.QRCodeUI.escapeHtml(label || '内容') + '</h3>\
          <button class="qrcode-close-btn" type="button" title="关闭" aria-label="关闭">&times;</button>\
        </div>\
        <div class="qrcode-modal-body">\
          <div class="qrcode-image-container">\
            <div class="qrcode-loading">生成中...</div>\
          </div>\
          <div class="qrcode-content-info">\
            <label class="qrcode-content-label" for="qrcode-extension-content-input">内容:</label>\
            <textarea \
              id="qrcode-extension-content-input" \
              class="qrcode-content-input" \
              rows="4" \
              spellcheck="false" \
              autocomplete="off" \
              placeholder="输入或粘贴任意文字、链接，即可生成二维码" \
              aria-label="二维码内容"\
            ></textarea>\
            <div class="qrcode-content-meta">\
              <span class="qrcode-char-count"></span>\
              <button class="qrcode-btn qrcode-btn-generate" type="button">生成二维码</button>\
            </div>\
          </div>\
        </div>\
        <div class="qrcode-modal-footer">\
          <button class="qrcode-btn qrcode-btn-copy" type="button">复制内容</button>\
          <button class="qrcode-btn qrcode-btn-download" type="button">下载二维码</button>\
        </div>\
      </div>\
    ';
  }

  function bindEvents() {
    if (!modalElement) return;

    var closeBtn = modalElement.querySelector('.qrcode-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', function() {
        removeModal(false);
      });
    }

    modalElement.addEventListener('click', function(e) {
      if (e.target === modalElement) {
        removeModal(false);
      }
    });

    document.addEventListener('keydown', handleKeydown);
  }

  function handleKeydown(e) {
    if (e.key === 'Escape') {
      removeModal(false);
    }
  }

  function removeModal(immediate) {
    document.removeEventListener('keydown', handleKeydown);
    if (!modalElement) {
      generator = null;
      return;
    }

    var el = modalElement;
    modalElement = null;
    generator = null;

    if (immediate) {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
      return;
    }

    el.classList.remove('show');
    setTimeout(function() {
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    }, 200);
  }

})();
