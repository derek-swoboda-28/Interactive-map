export const parseDateString = (dateString: string) => {
  // Remove leading/trailing whitespace
  dateString = dateString.trim();

  // Regular expressions for different formats
  const formats = [
    {
      regex: /^(0[1-9]|1[0-2])\/(\d{4})$/,
      parse: (match: any) => new Date(match[2], match[1] - 1, 1),
    }, // MM/YYYY
    {
      regex: /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(\d{4})$/,
      parse: (match: any) => new Date(match[3], match[2] - 1, match[1]),
    }, // MM/DD/YYYY
    { regex: /^(\d{4})$/, parse: (match: any) => new Date(match[1], 0, 1) }, // YYYY
    {
      regex: /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{4})$/,
      parse: (match: any) =>
        new Date(match[2], new Date(match[1] + " 1").getMonth(), 1),
    }, // Mon YYYY
    {
      regex:
        /^(January|February|March|April|May|June|July|August|September|October|November|December) (\d{4})$/,
      parse: (match: any) =>
        new Date(match[2], new Date(match[1] + " 1").getMonth(), 1),
    }, // Month YYYY
    {
      regex:
        /^(January|February|March|April|May|June|July|August|September|October|November|December) (\d{1,2}), (\d{4})$/,
      parse: (match: any) =>
        new Date(match[3], new Date(match[1] + " 1").getMonth(), match[2]),
    }, // Month DD, YYYY
  ];

  for (const { regex, parse } of formats) {
    const match = dateString.match(regex);
    if (match) {
      return parse(match);
    }
  }

  // If no format matched, return null or throw an error
  return null;
};
