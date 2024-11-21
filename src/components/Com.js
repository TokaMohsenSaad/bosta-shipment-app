import React from "react";
import { useTranslation } from "react-i18next";

const Com = () => {
  const [t, i18l] = useTranslation();
  return <div>{t("title")}</div>;
};

export default Com;
