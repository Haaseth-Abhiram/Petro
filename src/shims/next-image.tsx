import React from "react";

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fill?: boolean;
  priority?: boolean;
  quality?: number;
  unoptimized?: boolean;
}

export const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  ({ fill, priority, quality, unoptimized, className, style, alt, src, ...props }, ref) => {
    const fillStyle: React.CSSProperties = fill
      ? {
          position: "absolute",
          height: "100%",
          width: "100%",
          left: 0,
          top: 0,
          right: 0,
          bottom: 0,
          objectFit: "cover",
          ...style,
        }
      : style || {};

    return (
      <img
        ref={ref}
        src={src}
        alt={alt || ""}
        className={className}
        style={fillStyle}
        loading={priority ? "eager" : "lazy"}
        {...props}
      />
    );
  }
);

Image.displayName = "Image";
export default Image;
