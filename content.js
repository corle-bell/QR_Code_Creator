// content.js - 内容脚本，负责显示二维码模态框

(function() {
  'use strict';

  if (window.__QRCODE_EXTENSION_LOADED__) {
    return;
  }
  window.__QRCODE_EXTENSION_LOADED__ = true;

  var MODAL_ID = 'qrcode-extension-modal';
  var modalElement = null;

  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'showQRCode') {
      showModal(request.content, request.label);
      sendResponse({ success: true });
    }
    return true;
  });

  function showModal(content, label) {
    if (modalElement) {
      removeModal();
    }

    modalElement = document.createElement('div');
    modalElement.id = MODAL_ID;
    modalElement.className = 'qrcode-modal-overlay';
    modalElement.innerHTML = createModalHTML(content, label);
    document.body.appendChild(modalElement);

    var qrContainer = modalElement.querySelector('.qrcode-image-container');
    if (qrContainer && typeof generateQRCode === 'function') {
      try {
        var qrDataUrl = generateQRCode(content, 256);
        var img = document.createElement('img');
        img.src = qrDataUrl;
        img.alt = '二维码';
        img.className = 'qrcode-image';
        qrContainer.innerHTML = '';
        qrContainer.appendChild(img);
      } catch (e) {
        qrContainer.innerHTML = '<p class="qrcode-error">二维码生成失败: ' + escapeHtml(e.message) + '</p>';
      }
    }

    bindEvents();

    setTimeout(function() {
      modalElement.classList.add('show');
    }, 10);
  }

  function createModalHTML(content, label) {
    var displayContent = content.length > 100 ? content.substring(0, 100) + '...' : content;
    return '\
      <div class="qrcode-modal-content">\
        <div class="qrcode-modal-header">\
          <h3 class="qrcode-modal-title">二维码 - ' + escapeHtml(label || '内容') + '</h3>\
          <button class="qrcode-close-btn" type="button" title="关闭" aria-label="关闭">&times;</button>\
        </div>\
        <div class="qrcode-modal-body">\
          <div class="qrcode-image-container">\
            <div class="qrcode-loading">生成中...</div>\
          </div>\
          <div class="qrcode-content-info">\
            <div class="qrcode-content-label">内容:</div>\
            <div class="qrcode-content-text" title="' + escapeHtml(content) + '">' + escapeHtml(displayContent) + '</div>\
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
      closeBtn.addEventListener('click', removeModal);
    }

    modalElement.addEventListener('click', function(e) {
      if (e.target === modalElement) {
        removeModal();
      }
    });

    document.addEventListener('keydown', handleKeydown);

    var copyBtn = modalElement.querySelector('.qrcode-btn-copy');
    if (copyBtn) {
      copyBtn.addEventListener('click', function() {
        copyToClipboard(getCurrentContent()).then(function() {
          showToast('已复制到剪贴板');
        }).catch(function() {
          showToast('复制失败，请手动复制');
        });
      });
    }

    var downloadBtn = modalElement.querySelector('.qrcode-btn-download');
    if (downloadBtn) {
      downloadBtn.addEventListener('click', downloadQRCode);
    }
  }

  function handleKeydown(e) {
    if (e.key === 'Escape') {
      removeModal();
    }
  }

  function removeModal() {
    if (modalElement) {
      modalElement.classList.remove('show');
      setTimeout(function() {
        if (modalElement && modalElement.parentNode) {
          modalElement.parentNode.removeChild(modalElement);
        }
        modalElement = null;
      }, 200);
    }
    document.removeEventListener('keydown', handleKeydown);
  }

  function getCurrentContent() {
    if (!modalElement) return '';
    var contentText = modalElement.querySelector('.qrcode-content-text');
    return contentText ? contentText.getAttribute('title') || contentText.textContent : '';
  }

  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }

    return new Promise(function(resolve, reject) {
      var textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        var ok = document.execCommand('copy');
        document.body.removeChild(textarea);
        if (ok) {
          resolve();
        } else {
          reject(new Error('copy failed'));
        }
      } catch (e) {
        document.body.removeChild(textarea);
        reject(e);
      }
    });
  }

  function downloadQRCode() {
    if (!modalElement) return;
    var img = modalElement.querySelector('.qrcode-image');
    if (!img) return;

    var link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = img.src;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function showToast(message) {
    var toast = document.createElement('div');
    toast.className = 'qrcode-toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(function() {
      toast.classList.add('show');
    }, 10);

    setTimeout(function() {
      toast.classList.remove('show');
      setTimeout(function() {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 1500);
  }

  function escapeHtml(text) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
  }

})();
