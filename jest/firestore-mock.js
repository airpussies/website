const createStore = () => ({ docs: new Map(), collections: new Map() })

// Minimal in-memory firebase/firestore mock for the functions the app uses.
// Each function is a jest.fn so tests can assert on calls.
const create = (store = createStore()) => {
  const getDoc = jest.fn(async ref => {
    const data = store.docs.get(ref.path)
    return {
      exists: () => data !== undefined,
      data: () => (data === undefined ? null : data),
    }
  })
  const setDoc = jest.fn(async (ref, data) => {
    store.docs.set(ref.path, { ...data })
  })
  const updateDoc = jest.fn(async (ref, data) => {
    store.docs.set(ref.path, { ...(store.docs.get(ref.path) || {}), ...data })
  })
  const getDocs = jest.fn(async col => ({
    docs: (store.collections.get(col) || []).map((data, i) => ({
      id: `team_${i}`,
      data: () => data,
    })),
  }))
  return {
    _store: store,
    doc: jest.fn((_db, path) => ({ path })),
    collection: jest.fn((_db, path) => path),
    getDoc,
    setDoc,
    updateDoc,
    getDocs,
  }
}

module.exports = { create, createStore }
