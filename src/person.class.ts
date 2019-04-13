class Person {
  private _name: string
  private _age: number

  constructor(name: string, age: number) {
    this._name = name
    this._age = age
  }

  get name() { return this._name }

  get age() { return this._age }

  public hi() {
    return `Hi, I'm ${this.name}, I'm ${this.age} year${this._age > 1 ? 's' : ''} old.`
  }
}

export default Person
