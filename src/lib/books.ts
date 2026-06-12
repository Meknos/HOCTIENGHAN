// Danh mục bộ sách 서울대 한국어. Mỗi cấp gồm 2 quyển A/B.
// `available` = đã có PDF + dữ liệu được extract vào app.

export interface BookMeta {
  slug: string; // "snu-1a"
  code: string; // "1A"
  nameKr: string; // "서울대 한국어 1A"
  level: string; // tiếng Việt
  levelKr: string; // 초급/중급/고급
  units: number; // số bài (tham khảo)
  cover: string; // màu bìa (CSS color)
  available: boolean;
}

export const BOOKS: BookMeta[] = [
  { slug: "snu-1a", code: "1A", nameKr: "서울대 한국어 1A", level: "Sơ cấp 1", levelKr: "초급 1", units: 8,  cover: "#F5A623", available: true },
  { slug: "snu-1b", code: "1B", nameKr: "서울대 한국어 1B", level: "Sơ cấp 1", levelKr: "초급 1", units: 9,  cover: "#F2C94C", available: true },
  { slug: "snu-2a", code: "2A", nameKr: "서울대 한국어 2A", level: "Sơ cấp 2", levelKr: "초급 2", units: 8,  cover: "#27AE60", available: true },
  { slug: "snu-2b", code: "2B", nameKr: "서울대 한국어 2B", level: "Sơ cấp 2", levelKr: "초급 2", units: 7,  cover: "#6FCF97", available: true },
  { slug: "snu-3a", code: "3A", nameKr: "서울대 한국어 3A", level: "Trung cấp 1", levelKr: "중급 1", units: 7, cover: "#2D9CDB", available: true },
  { slug: "snu-3b", code: "3B", nameKr: "서울대 한국어 3B", level: "Trung cấp 1", levelKr: "중급 1", units: 7, cover: "#56CCF2", available: true },
  { slug: "snu-4a", code: "4A", nameKr: "서울대 한국어 4A", level: "Trung cấp 2", levelKr: "중급 2", units: 7, cover: "#9B51E0", available: false },
  { slug: "snu-4b", code: "4B", nameKr: "서울대 한국어 4B", level: "Trung cấp 2", levelKr: "중급 2", units: 7, cover: "#BB6BD9", available: false },
  { slug: "snu-5a", code: "5A", nameKr: "서울대 한국어 5A", level: "Cao cấp 1", levelKr: "고급 1", units: 7,  cover: "#EB5757", available: false },
  { slug: "snu-5b", code: "5B", nameKr: "서울대 한국어 5B", level: "Cao cấp 1", levelKr: "고급 1", units: 7,  cover: "#F2785C", available: false },
  { slug: "snu-6a", code: "6A", nameKr: "서울대 한국어 6A", level: "Cao cấp 2", levelKr: "고급 2", units: 7,  cover: "#4F4F4F", available: false },
  { slug: "snu-6b", code: "6B", nameKr: "서울대 한국어 6B", level: "Cao cấp 2", levelKr: "고급 2", units: 7,  cover: "#828282", available: false },
];

export const CURRENT_BOOK = BOOKS[0]; // sách đang học mặc định
