export const svgStringToImage = (svgString, width = 26, height = 26) => {
  const path = "data:image/svg+xml;charset=utf-8;base64," + btoa(svgString);

  return new Promise((resolve, reject) => {
    const image = new Image(width, height);
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (err) => reject(err));
    image.src = path;
  });
};
