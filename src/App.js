import React from 'react';
import logo from './logo.png';

import {
  Button, Card, Container, Badge
} from 'react-bootstrap';

import {
  FaInstagram, FaTwitter, FaGithub
} from 'react-icons/fa';

import {
  GiCoffeeCup
} from 'react-icons/gi'

import './App.css';

var seedrandom = require('seedrandom');
var convert = require('color-convert');

class SocialButtons extends React.Component {
  constructor(props) {
    super(props);

    this.Links = [
      {
        name: "Instagram",
        icon: <FaInstagram />,
        url: "https://www.instagram.com/summerysaturn/"
      },
      {
        name: "Twitter",
        icon: <FaTwitter />,
        url: "https://twitter.com/summerysaturn"
      },
      {
        name: "GitHub",
        icon: <FaGithub />,
        url: "https://github.com/summerysaturn"
      },
      {
        name: "Ko-Fi",
        icon: <GiCoffeeCup />,
        url: "https://ko-fi.com/summerysaturn"
      }
    ]
  }

  render() {
    return (
      <div className="d-flex">
        {this.Links.map(e =>
          <SocialButton url={e.url}>
            {e.icon}
            <span className="sr-only"> {e.name} Link</span>
          </SocialButton >
        )}
      </div>
    )
  }
}

class SocialButton extends React.Component {
  render() {
    return (
      <a
        href={this.props.url}
        className="m-2 socialButton"
      >
        {this.props.children}
      </a>
    );
  }
}

class RepoDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = { restData: [] }
  }

  componentDidMount() {
    fetch("https://api.github.com/users/summerysaturn/repos")
      .then(res => res.json())
      .then((data) => {
        this.setState({
          restData: data
        })
      })
  }

  render() {
    return (
      <div className="card-columns">
        {this.state.restData.map(e => (
          <RepoCard key={"card-" + e.full_name} repoData={e} />
        ))}
      </div>
    );
  }
}

class RepoCard extends React.Component {
  constructor(props) {
    super(props);
    this.url = "";
    this.state = { img: "" }
  }

  componentDidMount() {
    this.url = "https://raw.githubusercontent.com/" +
      this.props.repoData.full_name + "/" +
      this.props.repoData.default_branch + "/" +
      ".github/preview.png"

    this.img = fetch(this.url)
      .then(res => res.blob())
      .then((data) => {
        if (data.type === "image/png") {
          this.setState({ img: URL.createObjectURL(data) });
        }
      })
      .catch(error => console.log("Image not found:", error))
  }

  render() {
    function getColour(string) {
      let hue = seedrandom(string).quick();
      return convert.hsl.hex(hue * 360, 100, 50);
    }

    return (
      <Card>
        <a href={this.props.repoData.html_url} className="text-reset">
          {this.state.img &&
            <img src={this.state.img} className="card-img-top" alt={this.props.repoData.name} />
          }
          {!this.state.img &&
            <img src={process.env.PUBLIC_URL + "/placeholder.png"} className="card-img-top" alt={this.props.repoData.name} />
          }
          <Card.Body>
            <Card.Text>
              <h6>{this.props.repoData.name}</h6>
              <p>{this.props.repoData.description}</p>
              <Badge
                style={{
                  color: "white",
                  backgroundColor: "#" + getColour(this.props.repoData.language)
                }}
              >
                {this.props.repoData.language}
              </Badge>
            </Card.Text>
          </Card.Body>
        </a>
      </Card >
    )
  }
}

class Heading extends React.Component {
  render() {
    return (
      <>
        <div class="hr">
          <hr data-content={this.props.children} class="hr-text" />
        </div>
      </>
    )
  }
}

function App() {
  return (
    <div className="App">
      <header className="App-header">

        <div className="position-relative">
          <img src={logo} className="App-logo" alt="Logo" />
          <h1 className="display-1 App-Title font-weight-bold">summerysaturn</h1>
        </div>

        <h2>
          This page is under development!
        </h2>

        <div className="d-flex mb-2">

          <Button
            className="m-2 btn-info"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </Button>

          <Button
            className="m-2 btn-info"
            href="https://getbootstrap.com/docs/4.5/components/alerts/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn Bootstrap
          </Button>

        </div>

        <SocialButtons />

      </header>

      <Container className="mb-5">
        <Heading>My Repositories</Heading>
        <RepoDisplay />
      </Container>

    </div>
  );
}

export default App;
