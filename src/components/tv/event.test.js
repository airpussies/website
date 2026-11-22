import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import React from "react"
import { Event } from "./event"
import { UserContext } from "../../context/UserProvider"

jest.mock("../../lib/firebase", () => ({ auth: {}, db: {}, default: {} }))
jest.mock("../../lib/firebase_event", () => ({
  generateEventDocument: jest.fn(),
  updateEventDocument: jest.fn(),
  getEventDocument: jest.fn(),
}))

import { updateEventDocument } from "../../lib/firebase_event"

const renderEvent = (
  evnt,
  user = { displayName: "pickup", teams: ["air pussies"] },
  isLoading = false
) =>
  render(
    <UserContext.Provider value={{ user, isLoading }}>
      <Event evnt={evnt} onEventChange={() => {}} />
    </UserContext.Provider>
  )

const teamA = {
  contacted: true,
  spot_confirmed: false,
  fee_payed: false,
  required_female: 2,
  required_male: 3,
  pussies: {
    anna: { state: "yep", sex: "female" },
    bob: { state: "maybe", sex: "male" },
    carla: { state: "yep", sex: "female" },
  },
}
const teamB = {
  ...teamA,
  contacted: false,
  pussies: { dora: { state: "nope", sex: "none" } },
}

describe("Event", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("shows a loading indicator before the user data arrived", () => {
    renderEvent({ id: "e1", teams: { teamA, teamB } }, undefined, true)
    expect(screen.getByText("Loading")).toBeInTheDocument()
    expect(screen.queryByText("teamA")).not.toBeInTheDocument()
  })

  it("renders the teams sorted by name with their status", () => {
    renderEvent({ id: "e1", teams: { teamB, teamA } })

    const headings = screen.getAllByRole("heading")
    const teamHeadings = headings.map(h => h.textContent)
    expect(teamHeadings.indexOf("teamA")).toBeLessThan(
      teamHeadings.indexOf("teamB")
    )

    expect(screen.getByText("yep")).toBeInTheDocument()
    expect(screen.getAllByText("nope").length).toBeGreaterThan(0)
  })

  it("toggles a team status via the checkbox and propagates the updated event", async () => {
    const onUpdate = jest.fn()
    updateEventDocument.mockResolvedValue({ id: "e1", updated: true })
    render(
      <UserContext.Provider
        value={{ user: { displayName: "pickup", teams: [] }, isLoading: false }}
      >
        <Event evnt={{ id: "e1", teams: { teamA } }} onEventChange={onUpdate} />
      </UserContext.Provider>
    )

    const checkboxes = screen.getAllByRole("checkbox")
    fireEvent.click(checkboxes[0])

    await waitFor(() => expect(updateEventDocument).toHaveBeenCalled())
    expect(updateEventDocument).toHaveBeenCalledWith("e1", {
      teamA: { ...teamA, contacted: false },
    })
    expect(onUpdate).toHaveBeenCalledWith({ id: "e1", updated: true })
  })

  it("shows an error when a status toggle fails", async () => {
    updateEventDocument.mockRejectedValue({
      code: "permission-denied",
      message: "No permission.",
    })
    render(
      <UserContext.Provider
        value={{ user: { displayName: "pickup", teams: [] }, isLoading: false }}
      >
        <Event evnt={{ id: "e1", teams: { teamA } }} onEventChange={() => {}} />
      </UserContext.Provider>
    )

    const checkboxes = screen.getAllByRole("checkbox")
    fireEvent.click(checkboxes[0])

    expect(
      await screen.findByText(
        "Event konnte nicht gespeichert werden. (permission-denied)"
      )
    ).toBeInTheDocument()
    expect(screen.getByText("No permission.")).toBeInTheDocument()
  })

  it("counts confirmed players per sex and allows adjusting the requirement", async () => {
    const onUpdate = jest.fn()
    updateEventDocument.mockResolvedValue({ id: "e1" })
    render(
      <UserContext.Provider
        value={{ user: { displayName: "pickup", teams: [] }, isLoading: false }}
      >
        <Event evnt={{ id: "e1", teams: { teamA } }} onEventChange={onUpdate} />
      </UserContext.Provider>
    )

    // 2 confirmed female (anna, carla) and 1 confirmed male (bob is only "maybe" -> 0)
    expect(screen.getByText(/2\/2/)).toBeInTheDocument()
    expect(screen.getByText(/0\/3/)).toBeInTheDocument()

    // female + increases required_female, - decreases but never below ...
    const plusButtons = screen.getAllByRole("button", { name: "+" })
    fireEvent.click(plusButtons[0])
    await waitFor(() =>
      expect(updateEventDocument).toHaveBeenCalledWith("e1", {
        teamA: { ...teamA, required_female: 3 },
      })
    )

    const minusButtons = screen.getAllByRole("button", { name: "-" })
    fireEvent.click(minusButtons[0])
    await waitFor(() =>
      expect(updateEventDocument).toHaveBeenLastCalledWith("e1", {
        teamA: { ...teamA, required_female: 1 },
      })
    )
  })

  it("colors the count green when nearly full, orange when partially, red when low", () => {
    renderEvent({
      id: "e1",
      teams: {
        a: makeTeam({
          required_female: 5,
          required_male: 1,
          confirmed_female: 5,
          confirmed_male: 0,
        }),
      },
    })

    const femaleTag = screen.getByText(/5\/5/).closest(".tag")
    expect(femaleTag).toHaveClass("is-success")
    const maleTag = screen.getByText(/0\/1/).closest(".tag")
    expect(maleTag).toHaveClass("is-danger")
  })

  it("colors the count orange above 65 percent", () => {
    renderEvent({
      id: "e1",
      teams: {
        a: makeTeam({
          required_female: 4,
          required_male: 1,
          confirmed_female: 3,
          confirmed_male: 1,
        }),
      },
    })

    const femaleTag = screen.getByText(/3\/4/).closest(".tag")
    expect(femaleTag).toHaveClass("is-warning")
  })
})

const makeTeam = ({
  required_female,
  required_male,
  confirmed_female,
  confirmed_male,
}) => {
  const pussies = {}
  for (let i = 0; i < confirmed_female; i++)
    pussies[`f${i}`] = { state: "yep", sex: "female" }
  for (let i = 0; i < confirmed_male; i++)
    pussies[`m${i}`] = { state: "yep", sex: "male" }
  return {
    contacted: false,
    spot_confirmed: false,
    fee_payed: false,
    required_female,
    required_male,
    pussies,
  }
}
