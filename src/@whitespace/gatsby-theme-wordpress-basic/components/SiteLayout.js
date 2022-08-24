import CookieConsent from "@whitespace/gatsby-plugin-cookie-consent/src/components";
import useCookieConsentSettings from "@whitespace/gatsby-plugin-cookie-consent/src/hooks/useCookieConsentSettings";
import WrappedSiteLayout from "@whitespace/gatsby-theme-wordpress-basic/src/components/SiteLayout";
import React from "react";

export default function SiteLayout({ ...restProps }) {
  const { active, strings } = useCookieConsentSettings();
  return (
    <>
      <WrappedSiteLayout {...restProps} />
      <CookieConsent cookieConsentSettings={strings} active={active} />
    </>
  );
}
