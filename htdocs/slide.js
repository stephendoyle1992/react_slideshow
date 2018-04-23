class SlideShow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            slides: [{slideInfo: "{\"points\":[], \"images\":[]}"}],
            currentSlide: 0,
        }

        document.addEventListener("keydown", this.changeSlide.bind(this));
        
            
    }

    componentDidMount() {
        let xhttp = new XMLHttpRequest();
        xhttp.addEventListener("loadend", () => {
            this.setState({slides: JSON.parse(xhttp.response)});
        });
        xhttp.open("GET", "/slides");
        xhttp.send();
    }

    changeSlide(event) {
        if (event.keyCode === 39) {
            this.setState({currentSlide: this.state.currentSlide + 1});
        } else if (event.keyCode == 37) {
            this.setState({currentSlide: this.state.currentSlide - 1});
        }
    }


    render() {
        let current = this.state.slides[this.state.currentSlide].slideInfo;
        return (
            React.createElement(
            "div",
            null,
            React.createElement(Slide, {current})
            )
        )
    }

}

class Slide extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log(this.props);
        console.log(this.props.current);
        let slideData = JSON.parse(this.props.current);
        return (
            React.createElement(
                "div",
                {style: {paddingLeft: "40px"}},
                React.createElement(
                    "h1",
                    {className:"page-header", style: {color: "282C34"}},
                    slideData.title,
                ),
                React.createElement(
                    "lu",
                    null,
                    slideData.points.map((point, index) =>
                    React.createElement(
                        "li",
                        {key: index ,style: {padding: "10px"}},
                        React.createElement(
                            "text",
                            {style: {padding: "10px"}},
                            point.point
                        )
                    )),
                    slideData.images.map((image, index)=> 
                    React.createElement(
                        "img",
                        {key: index, src: image.path, style: {padding: "10px"}},
                    ))
                ),
                React.createElement(
                    "footer",
                    {style: {paddingTop: "50px"}},
                    React.createElement(
                        "text",
                        null,
                        `Source: ${slideData.source}`
                    )
                )
            )
        )
    }
}

class SlideCreator extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            title: "test title",
            source: " ",
            points: [],
            images: [],
        }

        this.handleTitle = this.handleTitle.bind(this);
        this.handleSource = this.handleSource.bind(this);
        this.addPoint = this.addPoint.bind(this);
        this.addImage = this.addImage.bind(this);
        this.submit = this.submit.bind(this);
    }

    handleTitle(event) {
        this.setState({title: event.target.value});
    }
    handleSource(event) {
        this.setState({source: event.target.value});
    }
    addPoint(event) {
        let newstate = this.state.points.concat({point: " "});
        this.setState({points: newstate});
    }
    addImage(event) {
        let newstate = this.state.images.concat({path: " "});
        this.setState({images: newstate});
    }

    handlePoint(index, event) {
        let newstate = this.state.points;
        newstate[index] = {"point": event.target.value};
        this.setState({points: newstate});
    }

    handleImage(index, event) {
        let newstate = this.state.images;
        newstate[index] = {"path": event.target.value};
        this.setState({images: newstate});
    }

    submit(event) {
        let slide = {"title": this.state.title, "points": this.state.points,
                        "images": this.state.images, "source": this.state.source}
            
        let data = {"slideInfo": JSON.stringify(slide)};

        let xhttp = new XMLHttpRequest();
            xhttp.addEventListener("loadend", () => {
                alert(xhttp.status);
                ReactDOM.render(
                    React.createElement(MainPageSS, {}, ),
                    document.getElementById('app')
                );
            });
            xhttp.open("POST", "/slides");
            xhttp.send(JSON.stringify(data));
    }

    render() {

        
        let current = JSON.stringify({title: this.state.title,
            points: this.state.points,
            images: this.state.images,
            source: this.state.source,
           })
      
        return (
            React.createElement(
                "div",
                null,
                React.createElement(
                    "input",
                    {text: "text", placeholder: "title goes here", onChange: this.handleTitle},
                    null
                ),

                React.createElement(
                    "input",
                    {text: "text", placeholder: "source", onChange: this.handleSource},
                    null
                ),
                this.state.points.map((_, index) =>
                React.createElement(
                    "input",
                    {type: "text", placeholder: "point....",
                        onChange: this.handlePoint.bind(this, index)}
                )),
                this.state.images.map((_, index) =>
                React.createElement(
                    "input",
                    {type: "text", placeholder: "image....",
                        onChange: this.handleImage.bind(this, index)}
                )),
                React.createElement(
                    "button",
                    {onClick: this.addPoint},
                    "Add point"
                ),
                React.createElement(
                    "button",
                    {onClick: this.addImage},
                    "Add image"
                ),
                React.createElement(
                    Slide,
                    {current}

                ),
                React.createElement(
                "button",
                {onClick: this.submit},
                "Add to slideshow")
            )
        )
    }
}
