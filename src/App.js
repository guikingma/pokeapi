import React, { Component, useState, useEffect } from 'react';
import PokemonList from './PokemonList';
import axios from 'axios';
import Pagination from './Pagination';
//import logo from './logo.svg';
// import './App.css';

// https://pokeapi.co/api/v2/
// /pokemon/1/

class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      pokemon: [],
      setPokemon: null,
      currentPageUrl: "https://pokeapi.co/api/v2/pokemon",
      setCurrentPageUrl: null,
      nextPageUrl: null,
      // setNextPageUrl: null,
      prevPageUrl: null,
      // setPrevPageUrl: null,
      loading: true,
      setLoading: null,
    }
  }

  componentDidMount() {
    const { currentPageUrl } = this.state;
    let cancel;

    axios.get(currentPageUrl, {
      cancelToken: new axios.CancelToken(c => cancel = c)
    }).then(res => {
      this.setState({
        loading: false,
        nextPageUrl: res.data.next,
        prevPageUrl: res.data.previous,
        pokemon: res.data.results.map(p => p.name) } );
    })
    return () => cancel()
  }

  componentDidUpdate(prevprops, prevState) {
    const { currentPageUrl } = this.state;
    if (prevState.currentPageUrl !== currentPageUrl) {
      let cancel;
      axios.get(currentPageUrl, {
        cancelToken: new axios.CancelToken(c => cancel = c)
      }).then(res => {
        this.setState({
          loading: false,
          nextPageUrl: res.data.next,
          prevPageUrl: res.data.previous,
          pokemon: res.data.results.map(p => p.name)
        });
      })
      return () => cancel()
    }
  }

  gotoNextPage = () => {
    const { nextPageUrl } = this.state;
    this.setState(
      {
        currentPageUrl: nextPageUrl,
      });
  }

  gotoPrevPage = () => {
    const { prevPageUrl } = this.state;
    this.setState(
      {
        currentPageUrl: prevPageUrl,
      });
  }

  render() {
    const { loading, pokemon, nextPageUrl, prevPageUrl} = this.state;

    return (
      <>
      {loading ? (
        <div>
          <p>Loading....</p>
        </div>
      ) : null}
        <PokemonList pokemon={pokemon} />
        <Pagination
          gotoNextPage={nextPageUrl ? this.gotoNextPage : null}
          gotoPrevPage = {prevPageUrl ? this.gotoPrevPage: null}
        />
      </>
    );
  }
}

// function App() {
//   const [pokemon, setPokemon] = useState([]);
//   const [currentPageUrl, setCurrentPageUrl] = useState("https://pokeapi.co/api/v2/pokemon");
//   const [nextPageUrl, setNextPageUrl] = useState();
//   const [prevPageUrl, setPrevPageUrl] = useState();
//   const [loading, setLoading] = useState();

//   useEffect(() => {
//     setLoading(true);
//     let cancel;
    
//     axios.get(currentPageUrl, {
//       cancelToken: new axios.CancelToken(c => cancel = c)
//     }).then(res => {
//       setLoading(false)
//       setNextPageUrl(res.data.next)
//       setPrevPageUrl(res.data.previous)
//       setPokemon(res.data.results.map(p => p.name))
//     })

//     return () => cancel()
//   }, [currentPageUrl])

//   function gotoNextPage() {
//     setCurrentPageUrl(nextPageUrl);
//   }

//   function gotoPrevPage() {
//     setCurrentPageUrl(prevPageUrl);
//   }

//   if (loading) return "Loading..."
  
//   return (
//     <>
//       <PokemonList pokemon={pokemon} />
//       <Pagination
//         gotoNextPage = {nextPageUrl ? gotoNextPage: null}
//         gotoPrevPage = {prevPageUrl ? gotoPrevPage: null}
//       />
//     </>
//   );
// }



export default App;
