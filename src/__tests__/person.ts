import Person from '../person.class'

describe('test Person', () => {
  it('should create a Person object with the given name and age', () => {
    const p = new Person('pete', 123)

    expect(p.name).toEqual('pete')
    expect(p.age).toEqual(123)
  })

  it('should greet with name and age', () => {
    const p = new Person('pete', 321)

    expect(p.hi()).toContain('pete')
    expect(p.hi()).toContain('321')
  })
})
