import React from "react";
import { Item } from "./Item";

export class App extends React.Component {
  constructor() {
    super();

    this.state = {
      items: [],
      isLoading: false,
      autoRefreshEnabled: false,
      maxAvailibleComments: 0,
      minComments: 0
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
          isLoading: false,
          maxAvailibleComments: Math.max(
            ...data.children.map(o => o.data.num_comments),
            0
          )
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

  handleFilterChange = event => {
    this.setState({
      minComments: Number(event.target.value)
    });
  };

  getItemsByComments = (items, minComments) =>
    items
      .filter(item => item.data.num_comments > minComments)
      .sort((a, b) => b.data.num_comments - a.data.num_comments);

  render() {
    const {
      items,
      isLoading,
      autoRefreshEnabled,
      maxAvailibleComments,
      minComments
    } = this.state;
    const itemsByComments = this.getItemsByComments(items, minComments);

    return (
      <div>
        <h1>
          Top commented from
          <span className="logo">r/reactjs</span>
        </h1>
        <div>
          <p className="filter-title">Current comment filter: {minComments}</p>
          <button
            className="refresh-btn"
            type="button"
            onClick={this.handleAutoRefresh}
          >
            {autoRefreshEnabled ? "Stop" : "Start"} autorefresh
          </button>
        </div>
        <input
          className="range-filter"
          type="range"
          value={minComments}
          onChange={this.handleFilterChange}
          min={0}
          max={maxAvailibleComments}
        />
        {isLoading ? (
          <p>...Loading</p>
        ) : itemsByComments.length > 0 ? (
          <div className="content-grid">
            {itemsByComments.map(item => (
              <Item key={item.data.id} data={item.data} />
            ))}
          </div>
        ) : (
          <p className="no-result">No results found matching your criteria</p>
        )}
      </div>
    );
  }
}
