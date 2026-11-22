import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { navigate } from "gatsby"
import SignupForm from "./sign_up_form"

jest.mock("../../lib/firebase", () => ({ auth: {}, db: {}, default: {} }))
jest.mock("../../lib/firebase_user", () => ({
  generateUserDocument: jest.fn(),
  updateUserDocument: jest.fn(),
}))
jest.mock("firebase/auth", () => ({
  createUserWithEmailAndPassword: jest.fn(),
}))

import { createUserWithEmailAndPassword } from "firebase/auth"
import { generateUserDocument } from "../../lib/firebase_user"

const fakeAuthError = {
  code: "auth/email-already-in-use",
  message: "The email address is already in use.",
}

const typeCredentials = async user => {
  await user.type(screen.getByPlaceholderText("pickup"), "pickup")
  await user.type(
    screen.getByPlaceholderText("pickup@example.com"),
    "pickup@example.com"
  )
  await user.type(
    screen.getByPlaceholderText("your password ••••••"),
    "password123"
  )
}

describe("SignupForm", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders the sign up form", () => {
    render(<SignupForm />)
    expect(
      screen.getByRole("heading", { name: "Registrieren" })
    ).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Einloggen" })).toHaveAttribute(
      "href",
      "/users/signin"
    )
  })

  it("creates the user, generates the user document and navigates to the profile", async () => {
    const userDoc = {
      uid: "u1",
      email: "pickup@example.com",
      displayName: "pickup",
    }
    createUserWithEmailAndPassword.mockResolvedValue({ user: userDoc })
    generateUserDocument.mockResolvedValue(userDoc)
    const user = userEvent.setup()
    render(<SignupForm />)

    await typeCredentials(user)
    await user.click(screen.getByRole("button", { name: "Sign up" }))

    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
      expect.anything(),
      "pickup@example.com",
      "password123"
    )
    await waitFor(() =>
      expect(generateUserDocument).toHaveBeenCalledWith(userDoc, {
        displayName: "pickup",
      })
    )
    await waitFor(() => expect(navigate).toHaveBeenCalledWith("/users/profile"))
    expect(
      screen.queryByText(/error/i, { selector: ".message" })
    ).not.toBeInTheDocument()
  })

  it("shows the error code and detail when signing up fails", async () => {
    createUserWithEmailAndPassword.mockRejectedValue(fakeAuthError)
    const user = userEvent.setup()
    render(<SignupForm />)

    await typeCredentials(user)
    await user.click(screen.getByRole("button", { name: "Sign up" }))

    expect(
      await screen.findByText(
        "Error signing up with email and password. (auth/email-already-in-use)"
      )
    ).toBeInTheDocument()
    expect(
      screen.getByText("The email address is already in use.")
    ).toBeInTheDocument()
    expect(navigate).not.toHaveBeenCalled()
  })

  it("clears the error with the delete button", async () => {
    createUserWithEmailAndPassword.mockRejectedValue(fakeAuthError)
    const user = userEvent.setup()
    render(<SignupForm />)

    await typeCredentials(user)
    await user.click(screen.getByRole("button", { name: "Sign up" }))
    await screen.findByText(/Error signing up/)

    await user.click(screen.getByRole("button", { name: "delete" }))
    expect(screen.queryByText(/Error signing up/)).not.toBeInTheDocument()
    expect(
      screen.queryByText("The email address is already in use.")
    ).not.toBeInTheDocument()
  })
})
