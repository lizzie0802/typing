import React from 'react'


const dataMap = {
  hello: 'Hello, World!',
}

export class App extends React.Component<{}> {
  render() {
    return (
      <div>{dataMap.hello}</div>
    )
  }
}
