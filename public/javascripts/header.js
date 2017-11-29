var Header = React.createClass({
  render: function() {
    return (
      <div className="row center-align">
        <img src="/images/header.jpg"></img><h2>My Dota2 Summarization</h2>
      </div>
    );
  }
});

ReactDOM.render(
  <Header />,
  document.getElementById('header')
);
