import React from "react";
import { Item } from "./Item";

export class App extends React.Component {
  constructor() {
    super();

    this.state = {
      items: [],
      isLoading: false,
      autoRefreshEnabled: false
    };
  }

  componentDidMount() {
    this.fetchItems();
  }

  fetchItems = () => {
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
  };

  handleAutoRefresh = () => {
    this.setState(
      state => ({
        autoRefreshEnabled: !state.autoRefreshEnabled
      }),
      () => {
        if (this.state.autoRefreshEnabled) {
          this.autoRefresh = setInterval(this.fetchItems, 3000);
        } else {
          clearInterval(this.autoRefresh);
        }
      }
    );
  };

  render() {
    const { items, isLoading, autoRefreshEnabled } = this.state;
    const itemsSortByComments = items.sort(
      (a, b) => b.data.num_comments - a.data.num_comments
    );
    return (
      <div>
        <h1>Top commented</h1>
        <button
          type="button"
          style={{
            margin: "15px",
            padding: "10px",
            display: "block",
            border: "none",
            borderRadius: "15px",
            backgroundColor: "#ccc"
          }}
          onClick={this.handleAutoRefresh}
        >
          {autoRefreshEnabled ? "Stop" : "Start"} autorefresh
        </button>
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
