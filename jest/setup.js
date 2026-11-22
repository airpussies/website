import "@testing-library/jest-dom"

// Prevent the real firebase SDK (node build requires fetch/undici) from
// loading. Test files can override with a local jest.mock(...).
jest.mock("firebase/auth", () => ({
  onAuthStateChanged: jest.fn(),
  signInWithEmailAndPassword: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  sendPasswordResetEmail: jest.fn(),
}))

jest.mock("firebase/firestore", () => {
  const { create } = require("./firestore-mock")
  return create()
})
