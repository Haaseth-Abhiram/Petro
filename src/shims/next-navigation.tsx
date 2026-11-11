import {
  useNavigate as useRouterNavigate,
  useLocation as useRouterLocation,
  useParams as useRouterParams,
  useSearchParams as useRouterSearchParams,
} from "react-router-dom";

export function useRouter() {
  const navigate = useRouterNavigate();
  return {
    push: (url: string) => navigate(url),
    replace: (url: string) => navigate(url, { replace: true }),
    back: () => navigate(-1),
    forward: () => navigate(1),
    prefetch: () => {},
    refresh: () => window.location.reload(),
  };
}

export function usePathname() {
  const location = useRouterLocation();
  return location.pathname;
}

export function useSearchParams() {
  const [params] = useRouterSearchParams();
  return params;
}

export function useParams() {
  return useRouterParams();
}

export function redirect(url: string) {
  if (typeof window !== "undefined") {
    window.location.href = url;
  }
}

export function notFound() {
  if (typeof window !== "undefined") {
    window.location.href = "/404";
  }
}
