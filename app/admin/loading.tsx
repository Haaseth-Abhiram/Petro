import FlameLoader from "@/components/common/FlameLoader";

export default function AdminLoading() {
  return (
    <FlameLoader
      message="Loading administrative console..."
      fullScreen={true}
      theme="light"
    />
  );
}
