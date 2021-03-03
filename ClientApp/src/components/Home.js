import React, { Component } from 'react';

export class Home extends Component {
  static displayName = Home.name;

  render () {
    return (
      <div>
        <h1>Hey SIG!</h1>
        <p>My C# is lacking severely however I managed to put this together over the weekend/Monday.</p>
        <p>Here's how you setup the project:</p>
        <ul>
            <li><strong>clone the repo</strong></li>
            <li><strong>cd into project folder</strong></li>
            <li><strong>run npm install</strong></li>
            <li><strong>run dotnet run</strong></li>
        </ul>
      </div>
    );
  }
}
