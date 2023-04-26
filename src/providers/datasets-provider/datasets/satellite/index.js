import rgb_naturalenhncd from "./rgb_naturalenhncd";
import mpe from "./mpe";
import worldcloudmap_ir108 from "./worldcloudmap_ir108";

const datasets = [
  ...rgb_naturalenhncd.datasets,
  ...mpe.datasets,
  ...worldcloudmap_ir108.datasets,
];
const updates = [
  ...rgb_naturalenhncd.updates,
  ...mpe.updates,
  ...worldcloudmap_ir108.updates,
];

export default { datasets, updates };
