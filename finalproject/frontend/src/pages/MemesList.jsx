import React, { Component } from 'react'
import ReactTable from 'react-table'
import 'react-table'
import api from '../api'

import styled from 'styled-components'
import '../style/react-table.css'
import Counter from '../components/MemeVoteCounter'
import Comment from '../components/MemeComment'

// ---- DOMI ---- // 
// endless scroll, image & title, passive information (views, votes, comments), interaction (up/down vote, download, share) //



const Wrapper = styled.div`
padding: 0 40px 40px 40px;
`

const Right = styled.div`
width: auto;
    margin-right: 0px;
    margin-left: auto;
    text-align: right;
`

const Title = styled.h2.attrs({
    className: 'h2',
})`
`

const MemeTitle = styled.h4.attrs({
    className: 'h4',
})`

`

const UpVotes = styled.label`
color: green;
font-weight: bold
`

const DownVotes = styled.label`
color: red;
font-weight: bold
`

const ActionButton = styled.button`
background-color: white; 
  border: none;
  padding: 10px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
`

const CommentButton = styled.button`
    background-color: white; 
  border: none;
  text-align: center;
  
  
`

const MemeImg = styled.img`
display: block;
  margin-left: auto;
  margin-right: auto;
  width: 70%;
  max-width: 500px;
  
`

const Select = styled.select`
width:20%;
margin-left: 10px;
height:10%;
  box-sizing:border-box;

`
const Search = styled.input`
width:20%;
height:10%;
  box-sizing:border-box;
`

const StatsTable = styled.table`
  margin: auto;
  width: 65%;
  padding: 10px;
  text-align: center;
`

const ButtonTable = styled.table`
    width: auto;
    margin-right: 0px;
    margin-left: auto;
    text-align: right;
`

const CenterDiv = styled.div`
margin: auto;
  width: 45%;
  border-bottom: 2px solid grey;
  padding: 10px;
  text-align: center;
`
const CenterSearch = styled.div`
margin: auto;
  width: 45%;
  padding: 10px;
  text-align: center;
`

class MemesList extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            memes: [],
            columns: [],
            isLoading: false,
            search: null,
            filter: "all"
        }

        // var filter = document.getElementById("filter").value
    }

    startSearch = (e) => {
        let keyword = e.target.value;
        this.setState({ search: keyword })
    }

    setFilter = () => {
        var filter = document.getElementById("filter").value
        this.setState({ filter: filter})
    }

    /*componentDidMount = async () => {
        this.setState({ isLoading: true })

        await api.getAllMovies().then(movies => {
            this.setState({
                movies: movies.data.data,
                isLoading: false,
            })
        })
    }*/

    componentDidMount = async () => {
        this.setState({ isLoading: true })

        await api.getAllMemes().then(memes => {
            console.log("test", memes)
            this.setState({
                memes: memes.data.data,
                isLoading: false,
            })
        })
        // var filter = document.getElementById("filter").value

        
    }

    render() {

        const { memes, isLoading } = this.state
        console.log('TCL: memesList -> render -> memes', memes)

        
        console.log("filter value: " + this.state.filter)
        /*const columns = [
            {
                Header: 'ID',
                accessor: '_id',
                filterable: true,
            },
            {
                Header: 'Url',
                accessor: 'url',
                filterable: true,
            },
            // {
            //     Header: 'Rating',
            //     accessor: 'rating',
            //     filterable: true,
            // },
            // {
            //     Header: 'Time',
            //     accessor: 'time',
            //     Cell: props => <span>{props.value.join(' / ')}</span>,
            // },
        ]*/

        let showTable = true
        if (!memes.length) {
            showTable = false
        }

        return (
            showTable && (
                //This is for view testing
                <Wrapper>
                    <CenterSearch>
                        <Search type="text" id="search" name="search" placeholder="Search for a meme title..." onChange={(e) => this.startSearch(e)}></Search>

                        Sort: <Select name="sort" id="sort">
                            <option value="newest" selected disabled>sort</option>
                            <option value="newest">newest</option>
                            <option value="oldest">oldest</option>
                            <option value="top rating">rating (best)</option>
                            <option value="top rating">rating (worst)</option>
                            <option value="most viewed">views (most)</option>
                            <option value="most viewed">views (least)</option>
                        </Select>
                        Filter: <Select name="filter" id="filter" onChange={this.setFilter}>
                            <option value="all">all</option>
                            <option value="jpg">jpg</option>
                            <option value="png">png</option>
                            <option value="katze">katze</option>
                            <option value="gif">gif</option>
                            <option value="image">image</option>
                            <option value="template">template</option>
                            <option value="template">video</option>
                        </Select>
                    </CenterSearch>

                    {memes.filter((meme) => {
                            // if (this.state.search == null)
                            //     return meme
                            if (this.state.filter == "all")
                                return meme
                            // else if (meme.name.toLowerCase().includes(this.state.search.toLowerCase())) {
                            //     return meme
                            // }
                            else if (meme.url.toLowerCase().includes(this.state.filter.toLowerCase())) {
                                return meme
                            }
                    }).map(meme => (
                        <CenterDiv>
                            <Right>
                                <label>{meme.name} // </label>
                                <ActionButton>↓</ActionButton>
                                <ActionButton>→</ActionButton>
                            </Right>
                            <MemeImg src={meme.url} alt={meme.name}></MemeImg>
                            <StatsTable>
                                <tr>
                                    <td><Counter></Counter></td>
                                    {/* <td><CommentButton>11 comments</CommentButton></td> */}
                                    <td><label>230 views</label></td>
                                </tr>
                            </StatsTable>
                            <Comment id={meme._id}></Comment>
                        </CenterDiv>
                    ))}


                    <div></div>
                    {/* {showTable && (
                    <ReactTable
                        data={memes}
                        columns={columns}
                        loading={isLoading}
                        defaultPageSize={10}
                        showPageSizeOptions={true}
                        minRows={0}
                    />
                )} */}
                </Wrapper>)
        )
    }
}

export default MemesList
