(async function initInvitePage() {
  const locale = detectLocale();
  window.localStorage.setItem("gw_lang", locale);
  await I18N.load(locale);
  applyTranslations();

  document.documentElement.lang = locale;
  document.title = I18N.t("invite.landing.title");

  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");
  const tokenFromQuery = params.get("token");
  const inviter = params.get("inviter") || params.get("from");

  const pathParts = window.location.pathname.split("/").filter(Boolean);
  const inviteIndex = pathParts.lastIndexOf("invite");
  const tokenFromPath = inviteIndex >= 0 && inviteIndex + 1 < pathParts.length
    ? pathParts[inviteIndex + 1]
    : null;
  const inviteToken = tokenFromQuery || tokenFromPath;
  const inviteCode = code || inviteToken;

  const heroTitle = document.getElementById("heroTitle");
  const heroSubtitle = document.getElementById("heroSubtitle");
  const inviteCodeCard = document.getElementById("inviteCodeCard");
  const inviteCodeElement = document.getElementById("inviteCode");
  const codeHelper = document.getElementById("codeHelper");
  const copyButton = document.getElementById("copyCodeButton");
  const openAppLink = document.getElementById("openAppLink");

  if (inviter) {
    heroSubtitle.textContent = tFormat("invite.accept.subtitle", decodeURIComponent(inviter));
  }

  if (!inviteCode) {
    heroTitle.textContent = I18N.t("invite.invalid.title");
    heroSubtitle.textContent = I18N.t("invite.invalid.subtitle");
    codeHelper.textContent = I18N.t("invite.invalid.helper");
    inviteCodeCard.classList.add("hidden");
    copyButton.textContent = I18N.t("invite.invalid.secondary");
    openAppLink.textContent = I18N.t("invite.landing.open_instead");
    openAppLink.href = "gracewell://invite/";
    copyButton.onclick = () => {
      window.location.href = locale === "es"
        ? "mailto:?subject=Invitación%20de%20Gracewell&body=¿Podría%20compartir%20de%20nuevo%20la%20invitación%20de%20Gracewell?"
        : "mailto:?subject=Gracewell%20invite&body=Please%20send%20the%20Gracewell%20invitation%20again.";
    };
    return;
  }

  inviteCodeElement.textContent = inviteCode;
  openAppLink.href = `gracewell://invite/${encodeURIComponent(inviteCode)}`;

  copyButton.onclick = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
      const original = copyButton.textContent;
      copyButton.textContent = I18N.t("common.copied");
      window.setTimeout(() => {
        copyButton.textContent = original;
      }, 1500);
    } catch {
      window.alert(I18N.t("common.copy_failed"));
    }
  };
}());
