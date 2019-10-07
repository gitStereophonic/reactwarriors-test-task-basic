import React from "react";
import { Item } from "./Item";

export class App extends React.Component {
  constructor() {
    super();

    this.state = {
      items: [],
      isLoading: false
    };
  }

  componentDidMount() {
    this.setState({
      isLoading: true
    });

    fetch("https://www.reddit.com/r/reactjs.json?limit=100")
      .then(responce => responce.json())
      .then(({ data }) => {
        this.setState({
          items: data.children,
          isLoading: false
        });
      });
  }

  render() {
    const { items, isLoading } = this.state;
    const itemsSortByComments = items.sort(
      (a, b) => b.data.num_comments - a.data.num_comments
    );
    return (
      <div>
        <h1>Top commented</h1>
        {isLoading ? (
          <p>...Loading</p>
        ) : (
          <div
            style={{
              display: "inline-grid",
              "grid-template-columns": "repeat(5, 220px)",
              "grid-column-gap": "20px"
            }}
          >
            {itemsSortByComments.map(item => (
              <Item key={item.data.id} data={item.data} />
            ))}
          </div>
        )}
      </div>
    );
  }
}
