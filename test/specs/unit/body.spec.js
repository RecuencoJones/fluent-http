const { Body, BodyType } = require('../../../src/body')

describe('Body utilities', () => {
  describe('Body', () => {
    it('should transform object into BodyType', () => {
      let result = Body.asJson({})

      expect(result).toBeInstanceOf(BodyType)
      expect(result.mimeType).toEqual('application/json')
    })

    it('should transform string into BodyType', () => {
      let result = Body.asPlain('string')

      expect(result).toBeInstanceOf(BodyType)
      expect(result.mimeType).toEqual('text/plain')
    })

    it('should process object into BodyType', () => {
      const result = Body.parse({})

      expect(result).toBeInstanceOf(BodyType)
      expect(result.mimeType).toEqual('application/json')
    })

    it('should process string into BodyType', () => {
      const result = Body.parse('string')

      expect(result).toBeInstanceOf(BodyType)
      expect(result.mimeType).toEqual('text/plain')
    })

    it('should transform numeric data to null BodyType', () => {
      const result = Body.parse(3)

      expect(result).toBeNull()
    })
  })
})
