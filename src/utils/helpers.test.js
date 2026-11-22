import { count, removeKeyFromObj } from "./helpers"

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
