/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { translations, RTL_LANGS } from "../i18n/translations.js";
import { userAPI } from "../../utils/Api.js";

const LanguageContext = createContext(null);

const applyDir = (lang) => {
  const dir = RTL_LANGS.includes(lang) ? "rtl" : "ltr";
  document.documentElement.setAttribute("lang", lang);
  document.documentElement.setAttribute("dir", dir);
};

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(localStorage.getItem("app_language") || "en");

  useEffect(() => { applyDir(lang); }, [lang]);

  const setLang = useCallback((next, { sync = true } = {}) => {
    setLangState(next);
    localStorage.setItem("app_language", next);
    applyDir(next);
    if (sync && localStorage.getItem("auth_token")) {
      userAPI.updatePreferences({ language: next }).catch(() => {});
    }
  }, []);

  // t("some.key", { name: "John" }) → translated string with {placeholders} filled.
  const t = useCallback(
    (key, vars) => {
      const dict = translations[lang] || translations.en;
      let str = dict[key] ?? translations.en[key] ?? key;
      if (vars) for (const k of Object.keys(vars)) str = str.replaceAll(`{${k}}`, vars[k]);
      return str;
    },
    [lang]
  );

  const dir = RTL_LANGS.includes(lang) ? "rtl" : "ltr";

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used within <LanguageProvider>");
  return ctx;
}
