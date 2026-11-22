const React = require("react")

export const navigate = jest.fn()

export const Link = ({ to, children, ...rest }) =>
  React.createElement("a", { href: to, ...rest }, children)

export const useStaticQuery = jest.fn()
export const StaticQuery = jest.fn()
