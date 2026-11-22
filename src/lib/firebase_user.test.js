jest.mock("../lib/firebase", () => ({ auth: {}, db: {}, default: {} }))
jest.mock("firebase/firestore", () => {
  const { create, createStore } = require("../../jest/firestore-mock")
  const store = createStore()
  const fs = create(store)
  return { ...fs, mock: { store } }
})

import { generateUserDocument, updateUserDocument } from "../lib/firebase_user"
import { getDoc, setDoc, updateDoc } from "firebase/firestore"
import { mock } from "firebase/firestore"

const user = { uid: "u1", email: "pickup@example.com", displayName: "pickup" }

describe("generateUserDocument", () => {
  beforeEach(() => {
    mock.store.docs.clear()
    jest.clearAllMocks()
  })

  it("creates the user document when it does not exist yet", async () => {
    await generateUserDocument(user, { sex: "female", teams: ["air pussies"] })

    expect(setDoc).toHaveBeenCalledTimes(1)
    const stored = mock.store.docs.get("users/u1")
    expect(stored).toEqual({
      displayName: "pickup",
      email: "pickup@example.com",
      sex: "female",
      teams: ["air pussies"],
    })
  })

  it("does not overwrite an existing document", async () => {
    mock.store.docs.set("users/u1", {
      displayName: "old",
      email: "old@example.com",
    })

    await generateUserDocument(user, { sex: "female" })

    expect(setDoc).not.toHaveBeenCalled()
    expect(mock.store.docs.get("users/u1")).toEqual({
      displayName: "old",
      email: "old@example.com",
    })
  })

  it("returns the user document merged with its uid", async () => {
    const result = await generateUserDocument(user, {})
    expect(result).toEqual({
      uid: "u1",
      displayName: "pickup",
      email: "pickup@example.com",
    })
  })

  it("does nothing for a missing user", async () => {
    await expect(generateUserDocument(null)).resolves.toBeUndefined()
    expect(getDoc).not.toHaveBeenCalled()
  })

  it("rethrows firestore errors on creation", async () => {
    setDoc.mockRejectedValueOnce(new Error("boom"))
    await expect(generateUserDocument(user, {})).rejects.toThrow("boom")
  })
})

describe("updateUserDocument", () => {
  beforeEach(() => {
    mock.store.docs.clear()
    jest.clearAllMocks()
  })

  it("merges the additional data into the existing document", async () => {
    mock.store.docs.set("users/u1", {
      email: "pickup@example.com",
      displayName: "pickup",
      sex: "none",
    })

    const result = await updateUserDocument(user, {
      sex: "female",
      teams: ["air pussies"],
    })

    expect(updateDoc).toHaveBeenCalledTimes(1)
    expect(mock.store.docs.get("users/u1")).toEqual({
      uid: "u1",
      email: "pickup@example.com",
      displayName: "pickup",
      sex: "female",
      teams: ["air pussies"],
    })
    expect(result).toMatchObject({ uid: "u1", sex: "female" })
  })

  it("does nothing for a missing user", async () => {
    await expect(
      updateUserDocument(null, { sex: "female" })
    ).resolves.toBeUndefined()
    expect(getDoc).not.toHaveBeenCalled()
    expect(updateDoc).not.toHaveBeenCalled()
  })
})
