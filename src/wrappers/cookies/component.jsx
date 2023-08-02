import { useState, useEffect } from "react";
import Head from "next/head";

import CookiesBanner from "@/components/cookies-banner";

import { trackEvent, initAnalytics, trackPage } from "@/utils/analytics";
import { getAgreedCookies, setAgreedCookies } from "@/utils/cookies";

import "./styles.scss";

const Cookies = () => {
  const [accepted, setAccepted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const agreedCookies = getAgreedCookies();
    setAccepted(agreedCookies);
    setOpen(!agreedCookies);
  }, []);

  const acceptCookies = () => {
    setAccepted(true);
    setOpen(false);
    setAgreedCookies();
    initAnalytics();
    trackPage();
    trackEvent({
      category: "Cookies banner",
      action: "User accepts cookies",
      label: "cookies",
    });
  };
  return (
    <>
      {open && (
        <div className="c-cookies">
          <CookiesBanner onAccept={acceptCookies} />
        </div>
      )}
      {accepted && <Head></Head>}
    </>
  );
};

export default Cookies;
