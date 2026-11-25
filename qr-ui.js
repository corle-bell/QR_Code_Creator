// qr-ui.js - 二维码界面共用逻辑（弹窗 / 页面内模态框）

(function (root) {
  'use strict';

  var DEFAULT_SIZE = 256;
  var DEFAULT_DEBOUNCE_MS = 300;
  var QR_MAX_BYTES = 2953;

  function debounce(fn, wait) {
    var timer = null;
    return function () {
      var ctx = this;
      var args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(ctx, args);
      }, wait);
    };
  }

  function escapeHtml(text) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(text == null ? '' : String(text)));
    return div.innerHTML;
  }

  function byteLength(text) {
    if (typeof getUtf8ByteLength === 'function') {
      return getUtf8ByteLength(text);
    }
    return unescape(encodeURIComponent(text || '')).length;
  }

  function formatCharCount(text) {
    var value = text == null ? '' : String(text);
    return value.length + ' 字 / ' + byteLength(value) + ' 字节';
  }

  function renderQRImage(container, text, size) {
    size = size || DEFAULT_SIZE;
    if (!container) {
      return { ok: false, reason: 'missing-container' };
    }

    var value = text == null ? '' : String(text);
    if (!value.trim()) {
      container.innerHTML = '<p class="qrcode-placeholder">请输入或粘贴内容，即可生成二维码</p>';
      return { ok: false, reason: 'empty' };
    }

    if (typeof generateQRCode !== 'function') {
      container.innerHTML = '<p class="qrcode-error">二维码生成库未加载</p>';
      return { ok: false, reason: 'no-library' };
    }

    try {
      var qrDataUrl = generateQRCode(value, size);
      var img = document.createElement('img');
      img.src = qrDataUrl;
      img.alt = '二维码';
      img.className = 'qrcode-image';
      container.innerHTML = '';
      container.appendChild(img);
      return { ok: true, dataUrl: qrDataUrl };
    } catch (e) {
      var message = (e && e.message) ? e.message : '二维码生成失败';
      container.innerHTML = '<p class="qrcode-error">' + escapeHtml(message) + '</p>';
      return { ok: false, reason: 'error', message: message };
    }
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }

    return new Promise(function (resolve, reject) {
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

  function downloadQRFrom(container, filename) {
    if (!container) return false;
    var img = container.querySelector('.qrcode-image');
    if (!img || !img.src) return false;

    var link = document.createElement('a');
    link.download = filename || 'qrcode.png';
    link.href = img.src;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  }

  function showToast(host, message) {
    var parent = host || document.body;
    var toast = document.createElement('div');
    toast.className = 'qrcode-toast';
    toast.textContent = message;
    parent.appendChild(toast);

    setTimeout(function () {
      toast.classList.add('show');
    }, 10);

    setTimeout(function () {
      toast.classList.remove('show');
      setTimeout(function () {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 1500);
  }

  function bindGenerator(root, options) {
    options = options || {};
    var input = root.querySelector('.qrcode-content-input');
    var container = root.querySelector('.qrcode-image-container');
    var generateBtn = root.querySelector('.qrcode-btn-generate');
    var copyBtn = root.querySelector('.qrcode-btn-copy');
    var downloadBtn = root.querySelector('.qrcode-btn-download');
    var countEl = root.querySelector('.qrcode-char-count');
    var toastHost = options.toastHost || document.body;

    function getContent() {
      return input ? input.value : '';
    }

    function updateCount() {
      if (!countEl) return;
      var value = getContent();
      countEl.textContent = formatCharCount(value);
      if (byteLength(value) > QR_MAX_BYTES) {
        countEl.classList.add('is-over');
      } else {
        countEl.classList.remove('is-over');
      }
    }

    function refresh() {
      updateCount();
      var result = renderQRImage(container, getContent(), options.size || DEFAULT_SIZE);
      if (downloadBtn) {
        downloadBtn.disabled = !result.ok;
      }
      if (typeof options.onRefresh === 'function') {
        options.onRefresh(result, getContent());
      }
      return result;
    }

    var debouncedRefresh = debounce(refresh, options.debounceMs || DEFAULT_DEBOUNCE_MS);

    if (input) {
      if (options.initialContent != null) {
        input.value = options.initialContent;
      }
      input.addEventListener('input', debouncedRefresh);
      input.addEventListener('change', refresh);
    }

    if (generateBtn) {
      generateBtn.addEventListener('click', function () {
        refresh();
        if (input) input.focus();
      });
    }

    if (copyBtn) {
      copyBtn.addEventListener('click', function () {
        var text = getContent();
        if (!text) {
          showToast(toastHost, '请先输入内容');
          return;
        }
        copyText(text).then(function () {
          showToast(toastHost, '已复制到剪贴板');
        }).catch(function () {
          showToast(toastHost, '复制失败，请手动复制');
        });
      });
    }

    if (downloadBtn) {
      downloadBtn.addEventListener('click', function () {
        if (downloadBtn.disabled) return;
        if (!downloadQRFrom(container)) {
          showToast(toastHost, '请先生成二维码');
        }
      });
    }

    refresh();

    return {
      refresh: refresh,
      getContent: getContent,
      setContent: function (text) {
        if (input) {
          input.value = text == null ? '' : String(text);
        }
        refresh();
      },
      focus: function () {
        if (!input) return;
        input.focus();
        if (options.selectAllOnFocus && input.value) {
          input.select();
        }
      }
    };
  }

  root.QRCodeUI = {
    QR_MAX_BYTES: QR_MAX_BYTES,
    renderQRImage: renderQRImage,
    bindGenerator: bindGenerator,
    copyText: copyText,
    escapeHtml: escapeHtml,
    showToast: showToast,
    formatCharCount: formatCharCount,
    byteLength: byteLength
  };
})(typeof window !== 'undefined' ? window : this);
