(function () {
  async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.warn("Clipboard API failed, using fallback", err);

      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.top = "-9999px";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();

      let success = false;
      try {
        success = document.execCommand("copy");
      } catch (e) {
        console.error("execCommand error", e);
      }

      document.body.removeChild(textarea);
      return success;
    }
  }

  function setButtonCopiedState(btn) {
    const span = btn.querySelector(".btn-text");
    const originalSpanText = span ? span.innerText : "Copy";

    if (!btn.dataset.originalText) {
      btn.dataset.originalText = originalSpanText;
    }

    const finalOriginal = btn.dataset.originalText;
    span.innerText = "✓ Готово";
    btn.classList.add("copied");

    setTimeout(() => {
      if (btn) {
        span.innerText = finalOriginal;
        btn.classList.remove("copied");
      }
    }, 1800);
  }

  function flashPreElement(preEl) {
    if (!preEl) return;

    preEl.classList.add("copy-flash");
    setTimeout(() => {
      preEl.classList.remove("copy-flash");
    }, 320);
  }

  async function handleCopy(ev) {
    const btn = ev.currentTarget;
    const targetId = btn.getAttribute("data-target");
    if (!targetId) return;

    const preElement = document.getElementById(targetId);
    if (!preElement) {
      console.warn('pre element with id "' + targetId + '" not found');
      return;
    }

    let textToCopy = preElement.innerText;
    if (textToCopy === undefined) {
      textToCopy = preElement.textContent || "";
    }

    const copySuccess = await copyToClipboard(textToCopy);

    if (copySuccess) {
      setButtonCopiedState(btn);
      flashPreElement(preElement);
      return;
    }

    const span = btn.querySelector(".btn-text");
    const originalMsg = span ? span.innerText : "Copy";
    if (span) span.innerText = "ошибка";

    setTimeout(() => {
      if (span) span.innerText = originalMsg;
      btn.classList.remove("copied");
    }, 1200);

    console.error("Copy failed");
  }

  document.querySelectorAll(".copy-btn").forEach((btn) => {
    btn.addEventListener("click", handleCopy);
  });
})();
