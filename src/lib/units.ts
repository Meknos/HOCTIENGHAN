// Metadata các bài học — dùng cho sidebar/navigation, không cần query DB.

export interface UnitMeta {
  number: number;
  titleKr: string;
  titleVn: string;
  topic: string;
}

export const HANGEUL: UnitMeta = {
  number: 0,
  titleKr: "한글 배우기",
  titleVn: "Học bảng chữ cái",
  topic: "자음 · 모음 · 받침",
};

// ─── 서울대 1A ────────────────────────────────────────────────────────────────
export const UNITS_1A: UnitMeta[] = [
  { number: 1, titleKr: "안녕하세요?",           titleVn: "Xin chào",              topic: "Quốc tịch, Nghề nghiệp" },
  { number: 2, titleKr: "이게 뭐예요?",           titleVn: "Cái này là gì?",        topic: "Đồ dùng học tập" },
  { number: 3, titleKr: "여기가 어디예요?",        titleVn: "Đây là đâu?",           topic: "Động từ, Địa điểm" },
  { number: 4, titleKr: "전화번호가 뭐예요?",      titleVn: "Số điện thoại?",        topic: "Vị trí, Địa điểm" },
  { number: 5, titleKr: "주말에 친구를 만났어요",  titleVn: "Gặp bạn cuối tuần",    topic: "Số đếm, Ngày trong tuần" },
  { number: 6, titleKr: "얼마예요?",              titleVn: "Bao nhiêu tiền?",       topic: "Đồ ăn, Tiền" },
  { number: 7, titleKr: "날씨가 어떻습니까?",      titleVn: "Thời tiết thế nào?",   topic: "Thời tiết, Mùa" },
  { number: 8, titleKr: "영화 볼까요?",            titleVn: "Xem phim nhé?",        topic: "Giải trí" },
];

// ─── 서울대 1B ────────────────────────────────────────────────────────────────
export const UNITS_1B: UnitMeta[] = [
  { number: 1, titleKr: "어디에 살아요?",          titleVn: "Bạn sống ở đâu?",           topic: "Nhà cửa, Địa chỉ" },
  { number: 2, titleKr: "몇 시에 일어나요?",        titleVn: "Mấy giờ bạn thức dậy?",    topic: "Thói quen, Giờ giấc" },
  { number: 3, titleKr: "지난 주말에 뭐 했어요?",   titleVn: "Cuối tuần trước làm gì?",  topic: "Hoạt động cuối tuần" },
  { number: 4, titleKr: "어떤 음식을 좋아해요?",    titleVn: "Bạn thích món ăn gì?",     topic: "Ẩm thực Hàn Quốc" },
  { number: 5, titleKr: "오늘 어디에 가요?",        titleVn: "Hôm nay bạn đi đâu?",      topic: "Phương tiện, Hướng đi" },
  { number: 6, titleKr: "가족이 몇 명이에요?",      titleVn: "Gia đình có mấy người?",   topic: "Gia đình" },
  { number: 7, titleKr: "생일이 언제예요?",          titleVn: "Sinh nhật khi nào?",       topic: "Ngày tháng, Lịch" },
  { number: 8, titleKr: "쇼핑하러 같이 가요",       titleVn: "Cùng đi mua sắm nhé",      topic: "Mua sắm, Quần áo" },
  { number: 9, titleKr: "감기에 걸렸어요",           titleVn: "Bị cảm rồi",              topic: "Sức khoẻ, Bệnh viện" },
];

// ─── 서울대 2A ────────────────────────────────────────────────────────────────
export const UNITS_2A: UnitMeta[] = [
  { number: 1, titleKr: "방학 계획이 있어요?",       titleVn: "Bạn có kế hoạch nghỉ không?", topic: "Kế hoạch, Dự định" },
  { number: 2, titleKr: "한국 생활이 어때요?",        titleVn: "Cuộc sống ở Hàn thế nào?",   topic: "Cuộc sống hàng ngày" },
  { number: 3, titleKr: "여행을 좋아해요?",           titleVn: "Bạn có thích du lịch không?", topic: "Du lịch" },
  { number: 4, titleKr: "주문하시겠어요?",            titleVn: "Bạn muốn gọi món không?",    topic: "Nhà hàng, Gọi món" },
  { number: 5, titleKr: "어디가 아파요?",             titleVn: "Bạn đau ở đâu?",             topic: "Sức khoẻ, Triệu chứng" },
  { number: 6, titleKr: "어떤 집을 찾으세요?",        titleVn: "Bạn tìm loại nhà nào?",      topic: "Nhà ở, Thuê nhà" },
  { number: 7, titleKr: "취미가 뭐예요?",             titleVn: "Sở thích của bạn là gì?",    topic: "Sở thích, Giải trí" },
  { number: 8, titleKr: "어떻게 오셨어요?",           titleVn: "Bạn đến đây thế nào?",       topic: "Giao thông, Chỉ đường" },
];

// ─── 서울대 2B ────────────────────────────────────────────────────────────────
export const UNITS_2B: UnitMeta[] = [
  { number: 1, titleKr: "무슨 일을 해요?",           titleVn: "Bạn làm công việc gì?",           topic: "Nghề nghiệp, Công việc" },
  { number: 2, titleKr: "음식을 만들 수 있어요?",    titleVn: "Bạn có thể nấu ăn không?",        topic: "Nấu ăn, Công thức" },
  { number: 3, titleKr: "옷이 마음에 들어요?",       titleVn: "Bạn có thích bộ đồ này không?",   topic: "Thời trang, Mua sắm" },
  { number: 4, titleKr: "한국 문화를 알아요?",       titleVn: "Bạn biết văn hoá Hàn không?",     topic: "Văn hoá Hàn Quốc" },
  { number: 5, titleKr: "축하해요!",                 titleVn: "Chúc mừng!",                      topic: "Lễ hội, Chúc mừng" },
  { number: 6, titleKr: "환경을 보호해야 해요",      titleVn: "Phải bảo vệ môi trường",          topic: "Môi trường, Nghĩa vụ" },
  { number: 7, titleKr: "한국어를 잘 하고 싶어요",  titleVn: "Tôi muốn giỏi tiếng Hàn",         topic: "Học tập, Nguyện vọng" },
];

// ─── 서울대 3A ────────────────────────────────────────────────────────────────
export const UNITS_3A: UnitMeta[] = [
  { number: 1, titleKr: "저는 이 일이 적성에 맞아요",         titleVn: "Công việc này hợp với tôi",          topic: "Sở trường, Nghề nghiệp" },
  { number: 2, titleKr: "한국의 교육열은 높아요",              titleVn: "Nhiệt tình giáo dục Hàn Quốc cao",  topic: "Giáo dục, Xã hội" },
  { number: 3, titleKr: "가족의 의미가 달라지고 있어요",       titleVn: "Ý nghĩa gia đình đang thay đổi",    topic: "Gia đình, Xã hội hiện đại" },
  { number: 4, titleKr: "운동을 꾸준히 해야겠어요",            titleVn: "Tôi phải tập thể dục đều đặn",      topic: "Sức khoẻ, Thể dục" },
  { number: 5, titleKr: "한국의 음식 문화",                    titleVn: "Văn hoá ẩm thực Hàn Quốc",         topic: "Ẩm thực, Văn hoá" },
  { number: 6, titleKr: "여행을 통해 세상을 배워요",           titleVn: "Học hỏi thế giới qua du lịch",      topic: "Du lịch, Trải nghiệm" },
  { number: 7, titleKr: "환경 문제와 해결 방안",               titleVn: "Vấn đề môi trường và giải pháp",    topic: "Môi trường, Xã hội" },
];

// ─── 서울대 3B ────────────────────────────────────────────────────────────────
export const UNITS_3B: UnitMeta[] = [
  { number: 1, titleKr: "현대인의 생활 방식",          titleVn: "Phong cách sống người hiện đại",        topic: "Lối sống, Xã hội" },
  { number: 2, titleKr: "한국의 역사와 문화유산",      titleVn: "Lịch sử và di sản văn hoá Hàn Quốc",   topic: "Lịch sử, Di sản" },
  { number: 3, titleKr: "인터넷과 현대 사회",          titleVn: "Internet và xã hội hiện đại",           topic: "Công nghệ, Truyền thông" },
  { number: 4, titleKr: "경제와 소비 생활",            titleVn: "Kinh tế và đời sống tiêu dùng",         topic: "Kinh tế, Tiêu dùng" },
  { number: 5, titleKr: "다문화 사회",                 titleVn: "Xã hội đa văn hoá",                    topic: "Đa văn hoá, Hội nhập" },
  { number: 6, titleKr: "예술과 문화",                 titleVn: "Nghệ thuật và văn hoá",                 topic: "Nghệ thuật, Sáng tạo" },
  { number: 7, titleKr: "미래 사회의 변화",            titleVn: "Những thay đổi xã hội tương lai",       topic: "Tương lai, Công nghệ" },
];

// Map slug -> danh sách bài (dùng cho seed và navigation)
export const UNITS_BY_SLUG: Record<string, UnitMeta[]> = {
  "snu-1a": UNITS_1A,
  "snu-1b": UNITS_1B,
  "snu-2a": UNITS_2A,
  "snu-2b": UNITS_2B,
  "snu-3a": UNITS_3A,
  "snu-3b": UNITS_3B,
};

// Alias giữ tương thích với code cũ dùng UNITS (trỏ vào 1A)
export const UNITS = UNITS_1A;
export const ALL_UNITS = [HANGEUL, ...UNITS_1A];
