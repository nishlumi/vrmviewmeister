import * as ja from "../locales/ja.js"
import * as en from "../locales/en.js"
import * as eo from "../locales/eo.js"

export const defineSetupLang = (Quasar) => {
    Quasar.lang.ja["user"] = JSON.original(ja);
    Quasar.lang.eo["user"] = JSON.original(eo);
    Quasar.lang.enUS["user"] = JSON.original(en);
}