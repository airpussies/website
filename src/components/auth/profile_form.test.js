import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import ProfileForm from "./profile_form"
import { UserContext } from "../../context/UserProvider"

jest.mock("../../lib/firebase", () => ({ auth: {}, db: {}, default: {} }))
jest.mock("firebase/auth", () => ({
  onAuthStateChanged: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
}))
jest.mock("../../lib/firebase_user", () => ({
  generateUserDocument: jest.fn(),
  updateUserDocument: jest.fn(),
}))
jest.mock("firebase/firestore", () => {
  const { create, createStore } = require("../../../jest/firestore-mock")
  return create()
})

import { updateUserDocument } from "../../lib/firebase_user"

const renderWithUser = (user, isLoading = false) =>
  render(
    <UserContext.Provider value={{ user, isLoading }}>
      <ProfileForm />
    </UserContext.Provider>
  )
const userDoc = {
  uid: "u1",
  displayName: "pickup",
  secret: "the secret",
  sex: "female",
  teams: ["air pussies"],
}

const seedTeams = () => {
  const { docs, collections } = require("firebase/firestore")._store
  collections.set("teams", [
    { name: "air pussies" },
    { name: "berlin falcons" },
  ])
  return { docs, collections }
}

describe("ProfileForm", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    updateUserDocument.mockResolvedValue({})
  })

  it("shows a loading indicator while the user is loading", () => {
    const { container } = renderWithUser(null, true)
    expect(container).toHaveTextContent("Loading profile ...")
  })

  it("renders the profile fields of the signed in user", async () => {
    seedTeams()
    renderWithUser(userDoc)

    const nameInput = await screen.findByDisplayValue("pickup")
    expect(nameInput).toHaveAttribute("name", "displayName")
    expect(screen.getByDisplayValue("the secret")).toHaveAttribute(
      "name",
      "secret"
    )
    expect(screen.getByLabelText("Division")).toHaveValue("female")
  })

  it("shows the teams of the firestore teams collection with the user's teams checked", async () => {
    seedTeams()
    renderWithUser(userDoc)

    const airPussies = await screen.findByRole("checkbox", {
      name: "air pussies",
    })
    expect(airPussies).toBeChecked()
    expect(
      screen.getByRole("checkbox", { name: "berlin falcons" })
    ).not.toBeChecked()
  })

  it("sends the current profile values when saving and shows a success message", async () => {
    seedTeams()
    const user = userEvent.setup()
    renderWithUser(userDoc)

    const falcons = await screen.findByRole("checkbox", {
      name: "berlin falcons",
    })
    await user.click(falcons)

    await user.click(screen.getByRole("button", { name: "Update" }))

    await waitFor(() =>
      expect(updateUserDocument).toHaveBeenCalledWith(userDoc, {
        displayName: "pickup",
        secret: "the secret",
        sex: "female",
        teams: ["air pussies", "berlin falcons"],
      })
    )
    expect(
      await screen.findByText("Erfolgreich gespeichert.")
    ).toBeInTheDocument()
  })

  it("shows the error code and detail when saving fails", async () => {
    seedTeams()
    updateUserDocument.mockRejectedValue({
      code: "permission-denied",
      message: "No permission.",
    })
    const user = userEvent.setup()
    renderWithUser(userDoc)

    await user.click(await screen.findByRole("button", { name: "Update" }))

    expect(
      await screen.findByText("Operation fehlgeschlagen. (permission-denied)")
    ).toBeInTheDocument()
    expect(screen.getByText("No permission.")).toBeInTheDocument()
  })

  it("removes the error with the delete button", async () => {
    seedTeams()
    updateUserDocument.mockRejectedValue({
      code: "permission-denied",
      message: "No permission.",
    })
    const user = userEvent.setup()
    renderWithUser(userDoc)

    await user.click(await screen.findByRole("button", { name: "Update" }))
    await screen.findByText(/Operation fehlgeschlagen/)

    await user.click(screen.getByRole("button", { name: "delete" }))
    expect(
      screen.queryByText(/Operation fehlgeschlagen/)
    ).not.toBeInTheDocument()
    expect(screen.queryByText("No permission.")).not.toBeInTheDocument()
  })
})
