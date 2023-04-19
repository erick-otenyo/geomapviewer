import Head from "next/head";
import PropTypes from "prop-types";

const SearchBoxSeo = ({ description }) => {
  const NAME = "";
  const IMAGE = "";
  const LOGO = "";
  const URL = "";
  const SEARCH_TARGET = "";
  const TWITTER = "";

  const ADDRESS = {
    "@type": "PostalAddress",
    streetAddress: "",
    addressLocality: "",
    addressCountry: "",
  };

  const SCHEMA = {
    "@context": "http://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: NAME,
        description,
        image: IMAGE,
        logo: LOGO,
        url: URL,
        telephone: "+12027297600",
        sameAs: [TWITTER],
        address: ADDRESS,
      },
      {
        "@context": "https://schema.org",
        "@type": "WebSite",
        url: URL,
        potentialAction: {
          "@type": "SearchAction",
          target: SEARCH_TARGET,
          "query-input": "required name=search_term_string",
        },
      },
    ],
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
    </Head>
  );
};

SearchBoxSeo.propTypes = {
  description: PropTypes.string,
};

export default SearchBoxSeo;
