import * as React from "react";
import * as ReactDOM from "react-dom";

import Input from "./components/Input";
import List from "./components/List";

class App extends React.Component {
  constructor(props) {
    super(props);

    /* The only piece of state we have is an array of items.
       The state looks like this:
         {
           items: [{
             text: String,
             id: Number,
             done: Boolean,
           }]
         }
    */
    this.state = {
      items: []
    };

    // We keep track of the ID so that we can ensure unique ID's for each todo
    this.lastId = 0;

    // We bind `this` to the handlers
    // See https://reactjs.org/docs/handling-events.html
    this.handleCreate = this.handleCreate.bind(this);
    this.itemClick = this.itemClick.bind(this);
  }

  // handleCreate is passed down to the input below, and is called with the text of the item we want to create
  handleCreate(text) {
    //W e create a new item, with a new, unique id
    const newItem = {
      text: text,
      id: this.lastId + 1,
      done: false
    };

    // Continue keeping track of the last created id to ensure uniqueness
    this.lastId = newItem.id;

    // We add this new todo to the list of our current todos when we create one through the input.
    // setState happens asynchronously, so our view will update later.
    // See https://reactjs.org/docs/react-component.html#setstate
    this.setState({
      items: this.state.items.concat(newItem)
    });
  }

  // Called when an item is clicked, passed down into the items themselves
  itemClick(id, done) {
    this.setState(prevState => {
      let nextStateItems = [];

      // It's important that we read from `prevState`, as the `setState` is asynchronous.
      // We don't know exactly when it will be called, but when it is, `prevState` will be
      // the correct previous state.
      for (let item of prevState.items) {
        // We want to alter only the item with the id that was clicked
        if (item.id === id) {
          nextStateItems.push({
            ...item,
            done: done //we actually do the state modification, to whatever our new state is, `done`.
          });
          continue;
        }

        // For the rest of the items, leave them unaltered;
        nextStateItems.push(item);
      }

      // In our case we have only one bit of state (`items`) but if there were more,
      // we'd leave that unaltered, by spreading out `prevState`
      return {
        ...prevState,
        items: nextStateItems
      };
    });
  }

  render() {
    return (
      <div>
        <Input onCreate={this.handleCreate} />
        <List
          title="To do"
          items={this.state.items.filter(item => !item.done)}
          onItemClick={this.itemClick}
        />
        <List
          title="Done"
          items={this.state.items.filter(item => item.done)}
          onItemClick={this.itemClick}
        />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
