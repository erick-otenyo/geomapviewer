const AFRICA_COUNTRIES = [
  {
    name: "Algeria",
    iso: "DZA",
    bbox: [-8.6739, 18.96, 11.9889, 37.0951],
  },
  {
    name: "Angola",
    iso: "AGO",
    bbox: [11.6685, -18.0421, 24.0821, -4.3726],
  },
  {
    name: "Benin",
    iso: "BEN",
    bbox: [0.7746, 6.2351, 3.8517, 12.4184],
  },
  {
    name: "Botswana",
    iso: "BWA",
    bbox: [19.9995, -26.9074, 29.3683, -17.7808],
  },
  {
    name: "Burkina Faso",
    iso: "BFA",
    bbox: [-5.5189, 9.4011, 2.4054, 15.0826],
  },
  {
    name: "Burundi",
    iso: "BDI",
    bbox: [29.0003, -4.47, 30.8502, -2.3098],
  },
  {
    name: "Cameroon",
    iso: "CMR",
    bbox: [8.4995, 1.6523, 16.191, 13.0774],
  },
  {
    name: "Cape Verde",
    iso: "CPV",
    bbox: [-25.3618, 14.8018, -22.6568, 17.2054],
  },
  {
    name: "Central African Republic",
    iso: "CAF",
    bbox: [14.4177, 2.2205, 27.4634, 11.0076],
  },
  {
    name: "Chad",
    iso: "TCD",
    bbox: [13.4735, 7.4411, 24.0027, 23.4504],
  },
  {
    name: "Comoros",
    iso: "COM",
    bbox: [43.2287, -12.4226, 44.541, -11.3649],
  },
  {
    name: "Republic of Congo",
    iso: "COG",
    bbox: [11.2009, -5.0307, 18.65, 3.7031],
  },
  {
    name: "Côte d'Ivoire",
    iso: "CIV",
    bbox: [-8.5993, 4.3618, -2.4949, 10.7366],
  },
  {
    name: "Democratic Republic of the Congo",
    iso: "COD",
    bbox: [12.2066, -13.4557, 31.3057, 5.3861],
  },
  {
    name: "Djibouti",
    iso: "DJI",
    bbox: [41.7605, 10.9524, 43.4176, 12.7068],
  },
  {
    name: "Egypt",
    iso: "EGY",
    bbox: [24.6981, 21.7254, 36.2487, 31.6679],
  },
  {
    name: "Equatorial Guinea",
    iso: "GNQ",
    bbox: [5.6164, -1.4676, 11.3374, 3.7887],
  },
  {
    name: "Eritrea",
    iso: "ERI",
    bbox: [36.4388, 12.357, 43.1376, 18.0067],
  },
  {
    name: "Ethiopia",
    iso: "ETH",
    bbox: [33.0015, 3.3988, 47.9582, 14.8455],
  },
  {
    name: "Gabon",
    iso: "GAB",
    bbox: [8.699, -3.9907, 14.5023, 2.3156],
  },
  {
    name: "Gambia",
    iso: "GMB",
    bbox: [-16.8174, 13.0647, -13.7909, 13.8269],
  },
  {
    name: "Ghana",
    iso: "GHA",
    bbox: [-3.2554, 4.7388, 1.1918, 11.1733],
  },
  {
    name: "Guinea",
    iso: "GIN",
    bbox: [-15.0763, 7.1936, -7.6411, 12.6915],
  },
  {
    name: "Guinea-Bissau",
    iso: "GNB",
    bbox: [-16.7149, 10.8643, -13.6365, 12.6854],
  },
  {
    name: "Kenya",
    iso: "KEN",
    bbox: [33.9096, -4.7204, 41.9262, 5.0612],
  },
  {
    name: "Lesotho",
    iso: "LSO",
    bbox: [27.0112, -30.6756, 29.4557, -28.5708],
  },
  {
    name: "Liberia",
    iso: "LBR",
    bbox: [-11.4857, 4.3529, -7.3651, 8.5518],
  },
  {
    name: "Libya",
    iso: "LBY",
    bbox: [9.3917, 19.5082, 25.1485, 33.1654],
  },
  {
    name: "Madagascar",
    iso: "MDG",
    bbox: [43.1882, -25.6063, 50.4865, -11.9487],
  },
  {
    name: "Malawi",
    iso: "MWI",
    bbox: [32.6715, -17.1272, 35.915, -9.3638],
  },
  {
    name: "Mali",
    iso: "MLI",
    bbox: [-12.2389, 10.1595, 4.245, 25],
  },
  {
    name: "Mauritania",
    iso: "MRT",
    bbox: [-17.0665, 14.7156, -4.8277, 27.2981],
  },
  {
    name: "Mauritius",
    iso: "MUS",
    bbox: [56.5857, -20.5257, 63.5035, -10.3371],
  },
  {
    name: "Mayotte",
    iso: "MYT",
    bbox: [45.0179, -13.0063, 45.3001, -12.6357],
  },
  {
    name: "Morocco",
    iso: "MAR",
    bbox: [-13.1679, 27.6701, -0.9974, 35.9226],
  },
  {
    name: "Mozambique",
    iso: "MOZ",
    bbox: [30.2174, -26.8687, 40.8393, -10.4712],
  },
  {
    name: "Namibia",
    iso: "NAM",
    bbox: [11.7349, -28.9694, 25.2567, -16.9599],
  },
  {
    name: "Niger",
    iso: "NER",
    bbox: [0.1663, 11.697, 15.9956, 23.525],
  },
  {
    name: "Nigeria",
    iso: "NGA",
    bbox: [2.6684, 4.2704, 14.6764, 13.892],
  },
  {
    name: "Reunion",
    iso: "REU",
    bbox: [55.2163, -21.3899, 55.8374, -20.8718],
  },
  {
    name: "Rwanda",
    iso: "RWA",
    bbox: [28.8617, -2.84, 30.8991, -1.0475],
  },
  {
    name: "São Tomé and Príncipe",
    iso: "STP",
    bbox: [6.4599, -0.014, 7.4626, 1.7015],
  },
  {
    name: "Senegal",
    iso: "SEN",
    bbox: [-17.5432, 12.3079, -11.3425, 16.6921],
  },
  {
    name: "Seychelles",
    iso: "SYC",
    bbox: [46.2037, -10.2274, 56.2957, -3.7126],
  },
  {
    name: "Sierra Leone",
    iso: "SLE",
    bbox: [-13.3035, 6.9176, -10.2658, 10.0004],
  },
  {
    name: "Somalia",
    iso: "SOM",
    bbox: [40.9785, -1.6471, 51.4157, 11.9893],
  },
  {
    name: "South Africa",
    iso: "ZAF",
    bbox: [16.4519, -34.8351, 32.8913, -22.125],
  },
  {
    name: "South Sudan",
    iso: "SSD",
    bbox: [24.1519, 3.481, 35.8699, 12.219],
  },
  {
    name: "Sudan",
    iso: "SDN",
    bbox: [21.8389, 8.6791, 38.8493, 23.1451],
  },
  {
    name: "Swaziland",
    iso: "SWZ",
    bbox: [30.7908, -27.3175, 32.1367, -25.7188],
  },
  {
    name: "Tanzania",
    iso: "TZA",
    bbox: [29.3272, -11.7457, 40.4451, -0.9858],
  },
  {
    name: "Togo",
    iso: "TGO",
    bbox: [-0.1473, 6.1096, 1.8067, 11.139],
  },
  {
    name: "Tunisia",
    iso: "TUN",
    bbox: [7.5301, 30.2368, 11.5983, 37.5599],
  },
  {
    name: "Uganda",
    iso: "UGA",
    bbox: [29.5715, -1.4821, 35.0003, 4.2345],
  },
  {
    name: "Western Sahara",
    iso: "ESH",
    bbox: [-17.1054, 20.7696, -8.67, 27.6831],
  },
  {
    name: "Zambia",
    iso: "ZMB",
    bbox: [21.9994, -18.0795, 33.7057, -8.2709],
  },
  {
    name: "Zimbabwe",
    iso: "ZWE",
    bbox: [25.237, -22.4203, 33.0563, -15.6088],
  },
];

export default AFRICA_COUNTRIES;