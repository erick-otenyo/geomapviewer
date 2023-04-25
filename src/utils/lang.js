import { useEffect } from "react";
import { useRouter } from "next/router";

const isServer = typeof window === "undefined";

export const languages = [
  {
    label: "English",
    value: "en",
  },
  {
    label: "Français",
    value: "fr",
  },
];

export const googleLangCodes = {
  en: "en",
  fr: "fr",
};

export const getGoogleLangCode = (lang) => googleLangCodes[lang || "en"];

export const momentLangCodes = {
  en: "en",
  fr: "fr",
};

export const getMomentLangCode = (lang) => momentLangCodes[lang || "en"];

export const mapboxLangCodes = {
  en: "en",
  fr: "fr",
};

export const getMapboxLang = (lang) => mapboxLangCodes[lang || "en"];

export function translateText(str, params) {
  if (!str || typeof str !== "string") {
    return str;
  }

  if (typeof window !== "undefined") {
    const { Transifex } = window;
    if (typeof Transifex !== "undefined") {
      return Transifex.live.translateText(str, params);
    }
  }

  return str;
}

export const useSetLanguage = (lang) => {
  const { query } = useRouter();
  const langCode = lang || query?.lang;
  const canSetLanguage = !isServer && langCode && window?.Transifex;

  useEffect(
    () => canSetLanguage && window?.Transifex?.live.translateTo(langCode),
    []
  );
};

export const selectActiveLang = (state) =>
  !isServer &&
  (state?.location?.query?.lang ||
    JSON.parse(localStorage.getItem("txlive:selectedlang")) ||
    "en");
