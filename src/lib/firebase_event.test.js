jest.mock("../lib/firebase", () => ({ auth: {}, db: {}, default: {} }))
jest.mock("firebase/firestore", () => {
  const { create, createStore } = require("../../jest/firestore-mock")
  const store = createStore()
  const fs = create(store)
  return { ...fs, mock: { store } }
})

import {
  generateEventDocument,
  getEventDocument,
  updateEventDocument,
} from "../lib/firebase_event"
import { setDoc, updateDoc } from "firebase/firestore"
import { mock } from "firebase/firestore"

describe("generateEventDocument", () => {
  beforeEach(() => {
    mock.store.docs.clear()
    jest.clearAllMocks()
  })

  it("creates the event document with the given data", async () => {
    const result = await generateEventDocument("2025_mixed", {
      name: "Mixed Berlin",
    })

    expect(setDoc).toHaveBeenCalledTimes(1)
    expect(mock.store.docs.get("events/2025_mixed")).toEqual({
      id: "2025_mixed",
      name: "Mixed Berlin",
    })
    expect(result).toMatchObject({ id: "2025_mixed", name: "Mixed Berlin" })
  })

  it("does not overwrite an existing event document", async () => {
    mock.store.docs.set("events/e1", { id: "e1", name: "old" })

    const result = await generateEventDocument("e1", { name: "new" })

    expect(setDoc).not.toHaveBeenCalled()
    expect(result).toEqual({ id: "e1", name: "old" })
  })

  it("does nothing for a missing id", async () => {
    await expect(generateEventDocument(null, {})).resolves.toBeUndefined()
    expect(setDoc).not.toHaveBeenCalled()
  })

  it("swallows firestore errors on creation", async () => {
    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {})
    setDoc.mockRejectedValueOnce(new Error("boom"))

    await expect(generateEventDocument("e1", {})).resolves.not.toThrow()
    consoleError.mockRestore()
  })
})

describe("updateEventDocument", () => {
  beforeEach(() => {
    mock.store.docs.clear()
    jest.clearAllMocks()
  })

  it("merges the team data into the existing event document", async () => {
    mock.store.docs.set("events/e1", {
      id: "e1",
      teams: { old: { contacted: true } },
    })

    const result = await updateEventDocument("e1", {
      new: { contacted: false },
    })

    expect(updateDoc).toHaveBeenCalledTimes(1)
    expect(result.teams).toEqual({
      old: { contacted: true },
      new: { contacted: false },
    })
  })

  it("does nothing for a missing id or team", async () => {
    await expect(updateEventDocument(null, { a: {} })).resolves.toBeUndefined()
    await expect(updateEventDocument("e1", null)).resolves.toBeUndefined()
    expect(setDoc).not.toHaveBeenCalled()
    expect(updateDoc).not.toHaveBeenCalled()
  })
})

describe("getEventDocument", () => {
  beforeEach(() => {
    mock.store.docs.clear()
    jest.clearAllMocks()
  })

  it("returns the event document merged with its id", async () => {
    mock.store.docs.set("events/e1", { name: "Berlin Open" })
    await expect(getEventDocument("e1")).resolves.toEqual({
      id: "e1",
      name: "Berlin Open",
    })
  })

  it("does nothing for a missing id", async () => {
    await expect(getEventDocument(null)).resolves.toBeNull()
  })
})
