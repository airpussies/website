import { render, screen, waitFor } from "@testing-library/react"
import React from "react"
import Turnierverwaltung from "./turnierverwaltung"
import { CreateEvent } from "./event"
import { UserContext } from "../../context/UserProvider"

jest.mock("../../lib/firebase", () => ({ auth: {}, db: {}, default: {} }))
jest.mock("../../lib/firebase_event", () => ({
  generateEventDocument: jest.fn(),
  updateEventDocument: jest.fn(),
  getEventDocument: jest.fn(),
}))

import { generateEventDocument } from "../../lib/firebase_event"

const renderTv = (value, props = { event_id: "e1" }) =>
  render(
    <UserContext.Provider value={value}>
      <Turnierverwaltung {...props} />
    </UserContext.Provider>
  )

describe("Turnierverwaltung", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("tells anonymous/loading users that the area is for registered users only", () => {
    renderTv({ user: null, isLoading: true })
    expect(
      screen.getByText(
        /Die Turnierverwaltung steht nur registrierten Nutzern zur Verfügung/i
      )
    ).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Registrierung" })).toHaveAttribute(
      "href",
      "/users/signup/"
    )
  })

  it("shows the event editor once the event document exists", async () => {
    generateEventDocument.mockResolvedValue({
      id: "e1",
      teams: {
        "team a": {
          contacted: false,
          spot_confirmed: false,
          fee_payed: false,
          required_female: 0,
          required_male: 0,
          pussies: {},
        },
      },
    })
    renderTv({
      user: { uid: "u1", displayName: "pickup", teams: [] },
      isLoading: false,
    })

    await waitFor(() =>
      expect(generateEventDocument).toHaveBeenCalledWith("e1")
    )
    expect(
      await screen.findByRole("heading", { name: "team a" })
    ).toBeInTheDocument()
  })

  it("shows a create form when the event document could not be loaded", async () => {
    generateEventDocument.mockResolvedValue({ id: "non_existent" })
    const onEventCreated = jest.fn()

    render(
      <UserContext.Provider value={{ user: { uid: "u1" }, isLoading: false }}>
        <div data-testid="wrapper">
          <Turnierverwaltung event_id="e1" />
        </div>
      </UserContext.Provider>
    )

    await screen.findByRole("heading", { name: "CreateEvent" })
  })
})

describe("CreateEvent", () => {
  it("calls onEventCreate with the generated document", async () => {
    generateEventDocument.mockResolvedValue({ id: "e1" })
    const onEventCreate = jest.fn()
    render(<CreateEvent event_id="e1" onEventCreate={onEventCreate} />)

    screen.getByRole("button", { name: "CreateEvent" }).click()

    await waitFor(() => expect(onEventCreate).toHaveBeenCalled())
    expect(generateEventDocument).toHaveBeenCalledWith("e1", { foo: "bar" })
  })
})
