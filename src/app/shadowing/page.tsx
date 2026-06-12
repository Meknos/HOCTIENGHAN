import { Suspense } from "react";
import { ShadowingClient } from "@/components/ShadowingClient";

export default function ShadowingPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Shadowing</h2>
        <p className="text-gray-500">Luyện phát âm bằng cách nghe và lặp lại theo câu.</p>
      </div>
      <Suspense fallback={<p className="text-gray-500">Đang tải...</p>}>
        <ShadowingClient />
      </Suspense>
    </div>
  );
}
