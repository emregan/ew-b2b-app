import * as is from "is_js";
interface PictureTransformI {
  url?: string;
  size?: number;
  show?: string;
}

interface PictureSrcI {
 src: string;
 transforms?: PictureTransformI[];
}

interface TransformI {
  [key: string]: string;
  small?: string;
  small2x?: string;
  medium?: string;
  medium2x?: string;
  large?: string;
  large2x?: string;
}

interface BreakpointsI {
  name: string;
  name2x: string;
  size: number;
  show: string;
}

interface ImageI {
  id: string;
  extension: string;
  url: string;
  filename: string;
  kind: string;
  width: number;
  height: number;
  size: number;
  transforms: TransformI;
}

const breakpoints: BreakpointsI[] = [{
  name: "large",
  name2x: "large2x",
  size: 1024,
  show: "show-for-large"
}, {
  name: "medium",
  name2x: "medium2x",
  size: 640,
  show: "show-for-medium-only"
}, {
  name: "small",
  name2x: "small2x",
  size: 0,
  show: "show-for-small-only",
}];

const isImage = (image: ImageI): boolean => {
  return typeof image === "object" && image !== null && image.hasOwnProperty("url");
};

export const url = (image: any): string => {
  return isImage(image) ? image.url : "";
};

/**
 * Return any because twig function interface expects a string
 * @type {[type]}
 */
export const transforms = (image: ImageI): any => {
  const picture: PictureSrcI = { src: "" };

  if (!isImage(image)) {
    return picture;
  }

  picture.src = image.url;

  if ( is.undefined(image.transforms) ) {
    return picture;
  }

  breakpoints.forEach((breakpoint: BreakpointsI) => {
    const src1x = image.transforms[breakpoint.name];
    const src2x = image.transforms[breakpoint.name2x];
    const urls: string[] = [];
    const context: PictureTransformI = {};

    if (src1x) {
      urls.push(src1x);
    }

    if (src2x) {
      urls.push(src2x);
    }

    // fallback to medium for small size if not present
    if (!src1x && !src2x && breakpoint.name === "small") {
      if (typeof image.transforms["medium"] !== "undefined") {
        urls.push(image.transforms["medium"]);
      }

      if (typeof image.transforms["medium2x"] !== "undefined") {
        urls.push(image.transforms["medium2x"]);
      }
    }

    if (urls.length > 0) {
      picture.transforms = picture.transforms || [];
      context.size = breakpoint.size;
      context.show = breakpoint.show;

      // this can be passed on now.
      // Since we still have reference to the object it will also update the array
      picture.transforms.push(context);
    }

    // Assumes there is only one image for this breakpoint
    if (urls.length == 1) {
      context.url = urls.join();
    }

    // has both regular and 2x image
    if (urls.length == 2) {
      context.url = `${urls.join(", ")} 2x`;
    }
  });

  return picture;
};

export const width = (image: ImageI): string => {
  return isImage(image) ? String(image.width) : "";
};

export const height = (image: any): string => {
  return isImage(image) ? String(image.height) : "";
};
