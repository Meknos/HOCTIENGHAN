import { Suspense } from "react";
import { ChatClient } from "@/components/ChatClient";

export default function ChatPage() {
  return (
    <Suspense fallback={<p className="text-gray-500">Đang tải...</p>}>
      <ChatClient />
    </Suspense>
  );
}
