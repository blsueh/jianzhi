export type Zodiac = {
  /** 文件名（不含扩展名），图片请放到 public/zodiac/<key>.png */
  key: string;
  num: string;
  han: string;
  branch: string;
  en: string;
  pinyin: string;
  year: number;
  trait: string;
};

/** 十二生肖，按地支顺序排列 */
export const ZODIAC: Zodiac[] = [
  { key: "shu", num: "01", han: "鼠", branch: "子", en: "Rat", pinyin: "Zǐ", year: 2020, trait: "机敏·多智" },
  { key: "niu", num: "02", han: "牛", branch: "丑", en: "Ox", pinyin: "Chǒu", year: 2021, trait: "勤勉·笃实" },
  { key: "hu", num: "03", han: "虎", branch: "寅", en: "Tiger", pinyin: "Yín", year: 2022, trait: "威猛·果敢" },
  { key: "tu", num: "04", han: "兔", branch: "卯", en: "Rabbit", pinyin: "Mǎo", year: 2023, trait: "温良·敏捷" },
  { key: "long", num: "05", han: "龙", branch: "辰", en: "Dragon", pinyin: "Chén", year: 2024, trait: "尊贵·腾跃" },
  { key: "she", num: "06", han: "蛇", branch: "巳", en: "Snake", pinyin: "Sì", year: 2025, trait: "沉静·灵慧" },
  { key: "ma", num: "07", han: "马", branch: "午", en: "Horse", pinyin: "Wǔ", year: 2026, trait: "奔腾·致远" },
  { key: "yang", num: "08", han: "羊", branch: "未", en: "Goat", pinyin: "Wèi", year: 2027, trait: "和顺·仁爱" },
  { key: "hou", num: "09", han: "猴", branch: "申", en: "Monkey", pinyin: "Shēn", year: 2028, trait: "聪慧·灵动" },
  { key: "ji", num: "10", han: "鸡", branch: "酉", en: "Rooster", pinyin: "Yǒu", year: 2029, trait: "守信·司晨" },
  { key: "gou", num: "11", han: "狗", branch: "戌", en: "Dog", pinyin: "Xū", year: 2030, trait: "忠贞·守义" },
  { key: "zhu", num: "12", han: "猪", branch: "亥", en: "Pig", pinyin: "Hài", year: 2031, trait: "敦厚·丰足" },
];
