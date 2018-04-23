class MainPageSS  extends React.Component {
    constructor(props) {
        super(props)

        this.create = this.create.bind(this);
    }
    create(event) {
        ReactDOM.render(
            React.createElement(SlideCreator, {},),
            document.getElementById('app')
        )
    }

    display(event) {
        ReactDOM.render(
            React.createElement(SlideShow, {},),
            document.getElementById('app')
        );
    }

    render() {
        return (
            React.createElement(
                "div",
                null,
                React.createElement(
                    "button",
                    {onClick: this.create},
                    "Create slide"
                ),
                React.createElement(
                    "button",
                    {onClick: this.display},
                    "View slideshow"
                ),
            )
        )
    };
}

ReactDOM.render(
   React.createElement(MainPageSS, {}),
    document.getElementById('app')
);
