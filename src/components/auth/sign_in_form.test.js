import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { navigate } from "gatsby"
import SignInForm from "./sign_in_form"

jest.mock("../../lib/firebase", () => ({ auth: {}, db: {}, default: {} }))
jest.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: jest.fn(),
}))

import { signInWithEmailAndPassword } from "firebase/auth"

const typeCredentials = async user => {
  await user.type(
    screen.getByPlaceholderText("pickup@example.com"),
    "pickup@example.com"
  )
  await user.type(
    screen.getByPlaceholderText("your password ••••••"),
    "password123"
  )
}

describe("SignInForm", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders the sign in form", () => {
    render(<SignInForm />)
    expect(
      screen.getByRole("heading", { name: "Einloggen" })
    ).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText("pickup@example.com")
    ).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText("your password ••••••")
    ).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument()
  })

  it("links to password reset and sign up", () => {
    render(<SignInForm />)
    expect(
      screen.getByRole("link", { name: "Passwort vergessen?" })
    ).toHaveAttribute("href", "/users/passwordreset")
    expect(screen.getByRole("link", { name: "Registrieren" })).toHaveAttribute(
      "href",
      "/users/signup"
    )
  })

  it("signs in with the entered credentials and navigates home on success", async () => {
    signInWithEmailAndPassword.mockResolvedValue({ user: { uid: "u1" } })
    const user = userEvent.setup()
    render(<SignInForm />)

    await typeCredentials(user)
    await user.click(screen.getByRole("button", { name: "Sign in" }))

    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
      expect.anything(),
      "pickup@example.com",
      "password123"
    )
    await waitFor(() => expect(navigate).toHaveBeenCalledWith("/"))
    expect(await screen.findByText("success")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("pickup@example.com")).toHaveValue("")
    expect(screen.getByPlaceholderText("your password ••••••")).toHaveValue("")
  })

  it("shows an error when signing in fails", async () => {
    signInWithEmailAndPassword.mockRejectedValue(new Error("bad credentials"))
    const user = userEvent.setup()
    render(<SignInForm />)

    expect(screen.queryByText(/error/i)).not.toBeInTheDocument()
    await typeCredentials(user)
    await user.click(screen.getByRole("button", { name: "Sign in" }))

    expect(
      await screen.findByText("Error signing in with user and password")
    ).toBeInTheDocument()
    expect(navigate).not.toHaveBeenCalled()
  })
})
