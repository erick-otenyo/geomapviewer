export const getAdmId = (country, region, subRegion) =>
  `${country}${region ? `.${region}` : ""}${
    subRegion ? `.${subRegion}_1` : "_1"
  }`;

export const parseAdmId = (admData, boundaryDataSource) => {
  if (!admData) return null;

  let dataSource = boundaryDataSource;

  const { level, gid_0, gid_1, gid_2 } = admData;

  let adm0 = gid_0;
  let adm1;
  let adm2;

  if (level === 0) {
    return {
      adm0,
      adm1,
      adm2,
    };
  }

  if (!dataSource) {
    if (gid_1 && gid_1.split(".").length > 1) {
      dataSource = "gadm41";
    } else {
      dataSource = "codabs";
    }
  }

  if (dataSource === "codabs") {
    switch (level) {
      case 1:
        adm1 = gid_1;
        break;
      case 2:
        adm1 = gid_1;
        adm2 = gid_2;
        break;
      default:
        break;
    }

    return {
      adm0,
      adm1,
      adm2,
    };
  } else if (dataSource === "gadm41") {
    const gid = admData[`gid_${level || "0"}`];

    const ids = gid.split(".");
    const adm0 = ids?.[0] || null;
    const adm1 = ids[1]?.split("_")?.[0];
    const adm2 = ids[2]?.split("_")?.[0];

    return {
      adm0,
      adm1: adm1 ? parseInt(adm1, 10) : undefined,
      adm2: adm2 ? parseInt(adm2, 10) : undefined,
    };
  }

  return null;
};

export const getAdmLocationByLevel = ({ level, ...location }, dataSource) => {
  const admData = { ...location, level };

  return {
    type: "country",
    ...(location?.gid_0 && {
      ...parseAdmId(admData, dataSource),
    }),
  };
};
