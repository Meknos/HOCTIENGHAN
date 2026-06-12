import Link from "next/link";
import { UNITS } from "@/lib/units";
import type { UnitMeta } from "@/lib/units";

const UNIT_COLORS = [
  "from-primary/15 to-primary/5 text-primary",
  "from-secondary/15 to-secondary/5 text-secondary",
  "from-accent/20 to-accent/5 text-accent",
  "from-success/15 to-success/5 text-success",
  "from-primary/15 to-secondary/5 text-primary",
  "from-secondary/15 to-accent/5 text-secondary",
  "from-accent/20 to-primary/5 text-accent",
  "from-success/15 to-secondary/5 text-success",
];

interface Props {
  base: string;
  units?: UnitMeta[];
}

/** Lưới chọn bài, link tới `${base}/${number}`. */
export function UnitGrid({ base, units: unitsProp }: Props) {
  const units = unitsProp ?? UNITS;
  return (
    <div className="stagger-children grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {units.map((u) => (
        <Link
          key={u.number}
          href={`${base}/${u.number}`}
          className="card-cute group p-5"
        >
          <div className="flex items-center justify-between">
            <span
              className={`grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br text-sm font-extrabold transition-transform group-hover:scale-110 group-hover:rotate-3 ${UNIT_COLORS[(u.number - 1) % UNIT_COLORS.length]}`}
            >
              {u.number}
            </span>
            <span className="tag-cute group-hover:bg-primary/10 group-hover:text-primary">
              Bài {u.number}
            </span>
          </div>
          <p className="mt-3 font-kr text-lg font-bold">{u.titleKr}</p>
          <p className="text-sm text-fg/60">{u.titleVn}</p>
          <p className="mt-1 text-xs text-fg/40">{u.topic}</p>
        </Link>
      ))}
    </div>
  );
}
