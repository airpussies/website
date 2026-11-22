import { act, render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import PasswordResetForm from "./password_reset_form"

jest.mock("../../lib/firebase", () => ({ auth: {}, db: {}, default: {} }))
jest.mock("firebase/auth", () => ({
  sendPasswordResetEmail: jest.fn(),
}))

import { sendPasswordResetEmail } from "firebase/auth"

describe("PasswordResetForm", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders the password reset form", () => {
    render(<PasswordResetForm />)
    expect(
      screen.getByRole("heading", { name: "Passwort zurücksetzen" })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("link", { name: "← Zurück zum Login" })
    ).toHaveAttribute("href", "/users/signin")
  })

  it("sends the reset email and shows the success message", async () => {
    sendPasswordResetEmail.mockResolvedValue(undefined)
    const user = userEvent.setup()
    render(<PasswordResetForm />)

    await user.type(
      screen.getByPlaceholderText("pickup@example.com"),
      "pickup@example.com"
    )
    await user.click(
      screen.getByRole("button", { name: "Send me a reset link" })
    )

    expect(sendPasswordResetEmail).toHaveBeenCalledWith(
      expect.anything(),
      "pickup@example.com"
    )
    expect(
      await screen.findByText(
        "An email has been sent to you! Check your inbox and/or spam folder."
      )
    ).toBeInTheDocument()
  })

  it("shows an error when sending fails", async () => {
    sendPasswordResetEmail.mockRejectedValue(new Error("invalid email"))
    const user = userEvent.setup()
    render(<PasswordResetForm />)

    await user.type(
      screen.getByPlaceholderText("pickup@example.com"),
      "pickup@example.com"
    )
    await user.click(
      screen.getByRole("button", { name: "Send me a reset link" })
    )

    expect(
      await screen.findByText("Error resetting password.")
    ).toBeInTheDocument()
    expect(
      screen.queryByText(/an email has been sent/i)
    ).not.toBeInTheDocument()
  })

  it("hides the success message after a few seconds", async () => {
    jest.useFakeTimers()
    try {
      sendPasswordResetEmail.mockResolvedValue(undefined)
      render(<PasswordResetForm />)

      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      await user.type(
        screen.getByPlaceholderText("pickup@example.com"),
        "pickup@example.com"
      )
      await user.click(
        screen.getByRole("button", { name: "Send me a reset link" })
      )

      expect(
        await screen.findByText(/an email has been sent/i)
      ).toBeInTheDocument()
      act(() => jest.advanceTimersByTime(5100))
      expect(
        screen.queryByText(/an email has been sent/i)
      ).not.toBeInTheDocument()
    } finally {
      jest.useRealTimers()
    }
  })
})
