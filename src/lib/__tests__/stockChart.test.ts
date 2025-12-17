import { describe, expect, it } from "vitest";
import {
  buildSeriesData,
  parseDatetimeToMs,
  sampleValues,
} from "../stockChart";
import type { IValuesStockData } from "../../types";

describe("stockChart utils", () => {
  describe("parseDatetimeToMs", () => {
    it("parses ISO datetime strings", () => {
      // Arrange
      const iso = "2025-01-01T10:05:00.000Z";

      // Act
      const ms = parseDatetimeToMs(iso);

      // Assert
      expect(Number.isNaN(ms)).toBe(false);
      expect(ms).toBe(Date.parse(iso));
    });

    it("parses 'YYYY-MM-DD HH:mm:ss' datetimes", () => {
      // Arrange
      const datetime = "2025-01-01 10:05:00";

      // Act
      const ms = parseDatetimeToMs(datetime);

      // Assert
      expect(ms).toBe(new Date(2025, 0, 1, 10, 5, 0).getTime());
    });

    it("returns NaN for invalid datetimes", () => {
      // Arrange
      const datetime = "not-a-date";

      // Act
      const ms = parseDatetimeToMs(datetime);

      // Assert
      expect(Number.isNaN(ms)).toBe(true);
    });
  });

  describe("sampleValues", () => {
    it("returns the same array when values length is <= maxPoints", () => {
      // Arrange
      const values = [1, 2, 3];

      // Act
      const sampled = sampleValues(values, 3);

      // Assert
      expect(sampled).toEqual([1, 2, 3]);
    });

    it("samples values and keeps the last point", () => {
      // Arrange
      const values = Array.from({ length: 11 }, (_, i) => i);

      // Act
      const sampled = sampleValues(values, 5);

      // Assert
      expect(sampled.at(-1)).toBe(10);
      expect(sampled.length).toBeLessThanOrEqual(6);
    });
  });

  describe("buildSeriesData", () => {
    it("builds sorted series data and filters invalid points", () => {
      // Arrange
      const values: IValuesStockData[] = [
        {
          datetime: "2025-01-01 10:10:00",
          open: "1",
          high: "1",
          low: "1",
          close: "2",
          volume: "1",
        },
        {
          datetime: "invalid",
          open: "1",
          high: "1",
          low: "1",
          close: "3",
          volume: "1",
        },
        {
          datetime: "2025-01-01 10:05:00",
          open: "1",
          high: "1",
          low: "1",
          close: "not-a-number",
          volume: "1",
        },
        {
          datetime: "2025-01-01 10:05:00",
          open: "1",
          high: "1",
          low: "1",
          close: "1",
          volume: "1",
        },
      ];

      // Act
      const series = buildSeriesData(values, 5000);

      // Assert
      expect(series).toEqual([
        [new Date(2025, 0, 1, 10, 5, 0).getTime(), 1],
        [new Date(2025, 0, 1, 10, 10, 0).getTime(), 2],
      ]);
    });
  });
});
