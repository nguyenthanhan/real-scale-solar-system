import fc from "fast-check";
import { formatTransitionDate } from "../components/date-picker/transition-progress";

/**
 * Property-based tests for date format consistency
 * **Feature: date-transition-animation, Property 7: Date format consistency**
 * **Validates: Requirements 6.2**
 */
describe("Date Format Consistency - Property Tests", () => {
  // Date generator for reasonable date range
  const dateArb = fc
    .integer({
      min: new Date("1700-01-01").getTime(),
      max: new Date("2300-12-31").getTime(),
    })
    .map((ts) => new Date(ts));

  describe("Property 7: Date format consistency", () => {
    /**
     * **Property 7: Date format consistency**
     * For any date displayed during animation, the format should match
     * the date picker format ("Month Day, Year").
     * **Validates: Requirements 6.2**
     */
    test("formatted date matches expected pattern", () => {
      // Pattern: "Mon DD, YYYY" e.g., "Jan 15, 2024"
      const datePattern = /^[A-Z][a-z]{2} \d{1,2}, \d{4}$/;

      fc.assert(
        fc.property(dateArb, (date) => {
          const formatted = formatTransitionDate(date);
          return datePattern.test(formatted);
        }),
        { numRuns: 100 },
      );
    });

    test("formatted date contains valid month abbreviation", () => {
      const validMonths = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      fc.assert(
        fc.property(dateArb, (date) => {
          const formatted = formatTransitionDate(date);
          const month = formatted.split(" ")[0];
          return validMonths.includes(month);
        }),
        { numRuns: 100 },
      );
    });

    test("formatted date contains valid day number", () => {
      fc.assert(
        fc.property(dateArb, (date) => {
          const formatted = formatTransitionDate(date);
          // Extract day number (between month and comma)
          const dayMatch = formatted.match(/\s(\d{1,2}),/);
          if (!dayMatch) return false;

          const day = parseInt(dayMatch[1], 10);
          return day >= 1 && day <= 31;
        }),
        { numRuns: 100 },
      );
    });

    test("formatted date contains valid year", () => {
      fc.assert(
        fc.property(dateArb, (date) => {
          const formatted = formatTransitionDate(date);
          // Extract year (after comma)
          const yearMatch = formatted.match(/, (\d{4})$/);
          if (!yearMatch) return false;

          const year = parseInt(yearMatch[1], 10);
          return year >= 1700 && year <= 2300;
        }),
        { numRuns: 100 },
      );
    });

    test("same date always produces same formatted string", () => {
      fc.assert(
        fc.property(dateArb, (date) => {
          const formatted1 = formatTransitionDate(date);
          const formatted2 = formatTransitionDate(new Date(date.getTime()));
          return formatted1 === formatted2;
        }),
        { numRuns: 100 },
      );
    });
  });

  describe("Year boundary handling", () => {
    test("year changes are clearly visible in format", () => {
      fc.assert(
        fc.property(
          fc.integer({ min: 1700, max: 2299 }),
          fc.integer({ min: 1, max: 12 }),
          fc.integer({ min: 1, max: 28 }),
          (year, month, day) => {
            const date1 = new Date(year, month - 1, day);
            const date2 = new Date(year + 1, month - 1, day);

            const formatted1 = formatTransitionDate(date1);
            const formatted2 = formatTransitionDate(date2);

            // Year should be different in the formatted strings
            const year1Match = formatted1.match(/, (\d{4})$/);
            const year2Match = formatted2.match(/, (\d{4})$/);

            if (!year1Match || !year2Match) return false;

            return parseInt(year1Match[1], 10) !== parseInt(year2Match[1], 10);
          },
        ),
        { numRuns: 100 },
      );
    });
  });
});
