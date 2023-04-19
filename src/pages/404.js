import StaticLayout from "@/wrappers/static";
import Page404 from "@/layouts/404";

const Custom404 = () => (
  <StaticLayout
    title="Page Not Found"
    description="You may have mistyped the address or the page may have moved."
    noIndex
  >
    <Page404 />
  </StaticLayout>
);

export default Custom404;
