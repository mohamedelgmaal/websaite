import { createContext, useEffect, useMemo, useState } from "react"

export const LanguageContext = createContext({
  language: "en",
  toggleLanguage: () => {},
})

const getSavedLanguage = () => {
  try {
    const savedLanguage = localStorage.getItem("storeLanguage")

    return savedLanguage === "ar" || savedLanguage === "en"
      ? savedLanguage
      : "en"
  } catch (error) {
    console.error("Failed to load saved language:", error)
    return "en"
  }
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(getSavedLanguage)

  useEffect(() => {
    try {
      localStorage.setItem("storeLanguage", language)
    } catch (error) {
      console.error("Failed to save language:", error)
    }

    document.documentElement.lang = language
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr"
  }, [language])

  const toggleLanguage = () => {
    setLanguage((current) => (current === "en" ? "ar" : "en"))
  }

  const value = useMemo(
    () => ({
      language,
      toggleLanguage,
    }),
    [language]
  )

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}