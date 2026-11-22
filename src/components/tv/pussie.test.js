import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import { Pussie, Pussies } from "./pussie"

jest.mock("../../lib/firebase_event", () => ({
  updateEventDocument: jest.fn(),
}))

import { updateEventDocument } from "../../lib/firebase_event"

const fakePussie = {
  state: "yep",
  sex: "female",
  travel: "Train am Sa.",
  accommodation: "Wohnung",
  comment: "bringt den flugball mit",
}

const renderPussie = (overrides = {}) =>
  render(
    <Pussie
      name="anna"
      pussie={fakePussie}
      onClick={e => e.preventDefault()}
      delUser={e => e.preventDefault()}
      {...overrides}
    />
  )

describe("Pussie (single player row)", () => {
  it("renders all fields of the given pussie", () => {
    renderPussie()
    const nameInput = screen.getByDisplayValue("anna")
    expect(nameInput).toBeDisabled()
    expect(screen.getByDisplayValue("Train am Sa.")).toHaveAttribute(
      "name",
      "travel"
    )
    expect(screen.getByDisplayValue("Wohnung")).toHaveAttribute(
      "name",
      "accommodation"
    )
    expect(screen.getByDisplayValue("bringt den flugball mit")).toHaveAttribute(
      "name",
      "comment"
    )

    const select = screen.getAllByRole("combobox")[0]
    expect(select).toHaveValue("yep")
    expect(select.closest(".select")).toHaveClass("is-success")
  })

  it("reveals the save button once a field changed and submits the row data", async () => {
    const onClick = jest.fn(e => e.preventDefault())
    renderPussie({ onClick })

    expect(
      screen.queryByRole("button", { name: "Speichern" })
    ).not.toBeInTheDocument()

    fireEvent.change(screen.getByDisplayValue("Train am Sa."), {
      target: { name: "travel", value: "Flug am So." },
    })
    const saveButton = await screen.findByRole("button", { name: "Speichern" })

    fireEvent.click(saveButton)
    expect(onClick).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        name: "anna",
        entry: expect.objectContaining({
          state: "yep",
          sex: "female",
          travel: "Flug am So.",
          accommodation: "Wohnung",
          comment: "bringt den flugball mit",
        }),
      })
    )
  })

  it.each([
    ["yep", "is-success"],
    ["maybe", "is-warning"],
    ["nope", "is-danger"],
  ])("maps state %s to the color %s", (state, color) => {
    renderPussie()
    fireEvent.change(screen.getAllByRole("combobox")[0], {
      target: { name: "state", value: state },
    })
    expect(screen.getAllByRole("combobox")[0].closest(".select")).toHaveClass(
      color
    )
  })

  it("shows the comment as a tooltip on mouse over", () => {
    const longComment = "bringt den flugball und den wasserball mit"
    renderPussie({ pussie: { ...fakePussie, comment: longComment } })
    expect(
      screen.queryByText(longComment, { selector: ".notification" })
    ).not.toBeInTheDocument()

    fireEvent.mouseOver(screen.getByPlaceholderText("Kommentar"))
    expect(
      screen.getByText(longComment, { selector: ".notification" })
    ).toBeInTheDocument()

    fireEvent.mouseOut(screen.getByPlaceholderText("Kommentar"))
    expect(
      screen.queryByText(longComment, { selector: ".notification" })
    ).not.toBeInTheDocument()
  })

  it("deletes the pussie only when the confirm dialog is accepted", () => {
    const delUser = jest.fn(e => e.preventDefault())
    window.confirm = jest.fn(() => true)
    renderPussie({ delUser })

    fireEvent.click(screen.getByRole("button", { name: "Löschen anna" }))
    expect(window.confirm).toHaveBeenCalledWith(
      "Soll 'anna' wirklich gelöscht werden?"
    )
    expect(delUser).toHaveBeenCalled()
  })

  it("does not delete the pussie when the confirm dialog is rejected", () => {
    const delUser = jest.fn()
    window.confirm = jest.fn(() => false)
    renderPussie({ delUser })

    fireEvent.click(screen.getByRole("button", { name: "Löschen anna" }))
    expect(delUser).not.toHaveBeenCalled()
  })

  it("keeps the name editable for pickups", () => {
    renderPussie({ allowDisplayNameChange: true })
    expect(screen.getByDisplayValue("anna")).not.toBeDisabled()
  })
})

describe("Pussies (team roster)", () => {
  const team = {
    contacted: true,
    spot_confirmed: true,
    fee_payed: true,
    required_female: 2,
    required_male: 2,
    pussies: {
      bob: { state: "maybe", sex: "male", comment: "" },
      anna: { state: "yep", sex: "female", comment: "" },
      carla: { state: "nope", sex: "female", comment: "" },
    },
  }
  const evnt = { id: "e1", teams: { airpussies: team } }
  const user = { displayName: "pickup", teams: ["airpussies"], sex: "female" }

  const renderPussies = (overrides = {}) =>
    render(
      <Pussies
        evnt={evnt}
        team="airpussies"
        current_user={user}
        onEventChange={jest.fn()}
        setError={jest.fn()}
        setDetail={jest.fn()}
        {...overrides}
      />
    )

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("renders the roster sorted by state (yep first) and by name", () => {
    const { container } = renderPussies()
    const stateSelects = Array.from(
      container.querySelectorAll('select[name="state"]')
    ).slice(0, 3)
    expect(stateSelects.map(r => r.value)).toEqual(["yep", "maybe", "nope"])
  })

  it("does not offer the current user when she is already enlisted", () => {
    const { container } = renderPussies({
      current_user: { displayName: "anna", teams: ["airpussies"] },
    })
    expect(container).not.toHaveTextContent(/du bist noch nicht dabei/)
  })

  it("offers a row for the current user when she is not enlisted yet", () => {
    const { container } = renderPussies({
      current_user: { displayName: "newguy", teams: ["airpussies"] },
    })
    expect(container).toHaveTextContent(/du bist noch nicht dabei/)
    expect(screen.getByDisplayValue("newguy")).toBeInTheDocument()
  })

  it("offers an editable pickup row at the end", () => {
    renderPussies()
    const nameInputs = screen.getAllByDisplayValue("anna").length
    expect(nameInputs).toBe(1)
    const inputs = screen.getAllByPlaceholderText("name")
    const pickupRow = inputs[inputs.length - 1]
    expect(pickupRow).not.toBeDisabled()
    expect(pickupRow).toHaveValue("")
  })

  it("saves an edited row via the update event document call", async () => {
    const onEventChange = jest.fn()
    updateEventDocument.mockResolvedValue({ id: "e1" })
    renderPussies({ onEventChange })

    // find anna's row (the first one, sorted "yep" first) via its name input
    const annaField = screen.getByDisplayValue("anna").closest(".field")
    fireEvent.change(annaField.querySelector('input[name="travel"]'), {
      target: { name: "travel", value: "With a bus" },
    })
    const saveButton = annaField.querySelector('button[aria-label="Speichern"]')
    expect(saveButton).not.toHaveAttribute("hidden")
    fireEvent.click(saveButton)

    await waitFor(() => expect(updateEventDocument).toHaveBeenCalled())
    const [, payload] = updateEventDocument.mock.calls[0]
    expect(payload.airpussies.pussies.anna.travel).toBe("With a bus")
    expect(payload.airpussies.pussies.bob).toEqual(team.pussies.bob)
    expect(onEventChange).toHaveBeenCalledWith({ id: "e1" })
  })

  it("deletes a row after confirmation", async () => {
    const onEventChange = jest.fn()
    updateEventDocument.mockResolvedValue({ id: "e1" })
    window.confirm = jest.fn(() => true)
    renderPussies({ onEventChange })

    const annaField = screen.getByDisplayValue("anna").closest(".field")
    fireEvent.click(
      annaField.querySelector('button[aria-label="Löschen anna"]')
    )

    await waitFor(() => expect(updateEventDocument).toHaveBeenCalled())
    const [, payload] = updateEventDocument.mock.calls[0]
    expect(payload.airpussies.pussies.anna).toBeUndefined()
    expect(Object.keys(payload.airpussies.pussies).sort()).toEqual([
      "bob",
      "carla",
    ])
    expect(onEventChange).toHaveBeenCalledWith({ id: "e1" })
  })

  it("shows an error when deleting fails", async () => {
    const setError = jest.fn()
    const setDetail = jest.fn()
    updateEventDocument.mockRejectedValue({
      code: "permission-denied",
      message: "No permission.",
    })
    window.confirm = jest.fn(() => true)
    renderPussies({ setError, setDetail })

    const annaField = screen.getByDisplayValue("anna").closest(".field")
    fireEvent.click(
      annaField.querySelector('button[aria-label="Löschen anna"]')
    )

    await waitFor(() =>
      expect(setError).toHaveBeenCalledWith(
        "Operation fehlgeschlagen. (permission-denied)"
      )
    )
    expect(setDetail).toHaveBeenCalledWith("No permission.")
  })
})
