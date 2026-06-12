import { getStats } from "@/lib/actions";
import { SettingsClient } from "@/components/SettingsClient";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const stats = await getStats();
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Cài đặt</h2>
        <p className="text-gray-500">Thống kê & quản lý dữ liệu học.</p>
      </div>
      <SettingsClient stats={stats} />
    </div>
  );
}
