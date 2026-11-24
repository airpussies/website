import { count, dayAndMonth, formatDate, removeKeyFromObj, toDescription } from "./helpers"

describe("count", () => {
  it("counts the occurrences of a term", () => {
    expect(count(["female", "male", "female"], "female")).toBe(2)
    expect(count(["female", "male"], "none")).toBe(0)
  })

  it("returns 0 for missing data", () => {
    expect(count(null, "female")).toBe(0)
    expect(count(undefined, "female")).toBe(0)
  })
})

describe("removeKeyFromObj", () => {
  it("keeps only the entries matching the predicate", () => {
    const raw = { anne: 1, bob: 2, carla: 3 }
    expect(removeKeyFromObj(raw, key => key !== "bob")).toEqual({
      anne: 1,
      carla: 3,
    })
  })

  it("returns an empty object when nothing matches", () => {
    expect(removeKeyFromObj({ a: 1 }, () => false)).toEqual({})
  })
})

describe("formatDate", () => {
  it("formats the calendar date as entered, whatever the offset", () => {
    expect(formatDate("2026-11-07T00:00+02:00")).toBe("7. November 2026")
    expect(formatDate("2026-07-11T00:00+01:00")).toBe("11. Juli 2026")
    expect(formatDate("2019-02-01T00:00:00Z")).toBe("1. Februar 2019")
    expect(formatDate("2026-03-14T23:00+01:00")).toBe("14. März 2026")
  })
})

describe("toDescription", () => {
  it("strips tags, collapses whitespace and cuts at a word boundary", () => {
    expect(toDescription("<p>Das Fackel Up\n in  Braunschweig</p>")).toBe("Das Fackel Up in Braunschweig")
    const long = toDescription("<p>" + "wort ".repeat(50) + "</p>")
    expect(long.length).toBeLessThanOrEqual(156)
    expect(long.endsWith("wort…")).toBe(true)
  })
})

describe("dayAndMonth", () => {
  it("splits the calendar date as entered into day and short month", () => {
    expect(dayAndMonth("2026-11-07T00:00+02:00")).toEqual({ day: "7", month: "Nov" })
    expect(dayAndMonth("2026-03-14T23:00+01:00")).toEqual({ day: "14", month: "Mär" })
  })
})
