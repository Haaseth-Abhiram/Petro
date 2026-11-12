import React from "react";
import { Link as RouterLink } from "react-router-dom";

export interface LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string | { pathname?: string; query?: Record<string, string> };
  replace?: boolean;
  scroll?: boolean;
  prefetch?: boolean;
  children?: React.ReactNode;
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ href, replace, scroll, prefetch, children, ...rest }, ref) => {
    let to = "/";
    if (typeof href === "string") {
      to = href;
    } else if (href && href.pathname) {
      to = href.pathname;
      if (href.query) {
        const qs = new URLSearchParams(href.query).toString();
        if (qs) to += `?${qs}`;
      }
    }

    // External link
    if (to.startsWith("http://") || to.startsWith("https://") || to.startsWith("mailto:") || to.startsWith("tel:")) {
      return (
        <a ref={ref} href={to} {...rest}>
          {children}
        </a>
      );
    }

    return (
      <RouterLink ref={ref} to={to} replace={replace} {...rest}>
        {children}
      </RouterLink>
    );
  }
);

Link.displayName = "Link";
export default Link;
