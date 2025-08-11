// normalize string for searching special characters like '
export const normalizeText = (text: string) => {
  return text
    .toLowerCase()
    .normalize('NFD') // split accented chars into base + diacritic
    .replace(/[\u2018\u2019\u201A\u201B\u2032\u2035]/g, "'") // curly/smart quotes to '
    .replace(/[\u201C\u201D\u201E\u201F\u2033\u2036]/g, '"') // curly double quotes to "
    .replace(/[\u0300-\u036f]/g, ''); // remove diacritics
};
