import React from 'react'
import {render} from 'react-dom'
import Person from '~/person.class'
import {App} from '~/app'


const pete = new Person('pete', 33)

// tslint:disable-next-line
console.log(pete.hi())

render(<App />, document.getElementById('app'))
