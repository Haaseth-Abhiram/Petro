import FlameLoader from "@/components/common/FlameLoader";

export default function AdminLoading() {
  return (
    <div className="w-full min-h-[60vh] flex items-center justify-center">
      <FlameLoader
        message="Loading workspace data..."
        fullScreen={false}
        theme="light"
      />
    </div>
  );
}
