import FlameLoader from "@/components/common/FlameLoader";

export default function RootLoading() {
  return (
    <FlameLoader
      message="Loading page..."
      fullScreen={true}
      theme="light"
    />
  );
}
