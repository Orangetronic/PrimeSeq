class Enum {
  constructor(entries) {
    const _enum = [...entries]

    for (const entry of entries) {
      if (typeof entry !== "string") throw new Error("Enum keys must be string")
      _enum[entry] = entry
    }

    _enum.has = entry => {
      return _enum[entry] != null
    }

    return Object.seal(_enum)
  }
}

export default Enum