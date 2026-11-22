import { fireEvent, render, screen } from "@testing-library/react"
import { CreateTeam } from "./teams"

describe("CreateTeam", () => {
  it("is hidden when there are no missing teams", () => {
    render(<CreateTeam missingTeams={[]} addTeam={() => {}} />)
    expect(
      screen.queryByText("Eines deiner Teams ist nicht dabei?")
    ).not.toBeInTheDocument()
  })

  it("lists the missing teams in the picker", () => {
    render(
      <CreateTeam
        missingTeams={["berlin falcons", "hamburger haie"]}
        addTeam={() => {}}
      />
    )
    expect(
      screen.getByText("Eines deiner Teams ist nicht dabei?")
    ).toBeInTheDocument()

    const select = screen.getByRole("combobox", { name: "Wähle dein Team" })
    expect(
      screen.getByRole("option", { name: "berlin falcons" })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("option", { name: "hamburger haie" })
    ).toBeInTheDocument()
    expect(select).toHaveValue("placeholder")
  })

  it("adds the selected team to the event", () => {
    const addTeam = jest.fn()
    render(<CreateTeam missingTeams={["berlin falcons"]} addTeam={addTeam} />)

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "berlin falcons" },
    })
    fireEvent.click(screen.getByRole("button", { name: /Team hinzufügen/ }))

    expect(addTeam).toHaveBeenCalledWith("berlin falcons")
  })
})
