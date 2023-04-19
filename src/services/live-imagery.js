import { get } from "axios";

const QUERIES = {
  metsat: "http://20.56.94.119/sat-imagery/metsat/time",
};

export const getLatestDates = ({ fromDate, layerId }) => {
  const url = `${QUERIES.metsat}/${layerId}`;

  const params = {};

  let fromValue = fromDate;

  if (!fromValue) {
    const date = new Date();
    fromValue = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      0
    )}-01`;
  }

  if (fromValue) {
    params.fromValue = fromValue;
  }

  return get(url, { params });
};
