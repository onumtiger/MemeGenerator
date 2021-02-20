import React, { Component } from 'react'
import ReactTable from 'react-table'
import 'react-table'
import api from '../api'

import styled from 'styled-components'
import '../style/react-table.css'
import Counter from '../components/MemeVoteCounter'
import Comment from '../components/MemeComment'



// ---- DOMI ---- // 
// slide show //

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
  font-weight: bold; 
  font-size: 16px;
`

const SlideButton = styled.button`
background-color: black; 
border-radius: 5px;
  border: none;
  padding: 10px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 30px;
  color: white
`

const MemeImg = styled.img`
display: block;
  margin-left: auto;
  margin-right: auto;
  width: 90%;
  max-width: 500px;
  
`

const StatsTable = styled.table`
  margin: auto;
  width: 75%;
  padding: 10px;
  text-align: center;
`

const SlideShowTable = styled.table`
    vertical-align: middle;
`

const ButtonTable = styled.table`
    width: auto;
    margin-right: 0px;
    margin-left: auto;
    text-align: right;
`

const CenterDiv = styled.div`
margin: auto;
  width: 48%;
  padding: 10px;
  text-align: center;
`

class SlideShow extends Component {
    constructor(props) {
        super(props)
        this.state = {
            memes: [],
            columns: [],
            isLoading: false,
            search: null,
            filter: "all",
            slideIndex: 1
        }
    }

    startSearch = (e) => {
        let keyword = e.target.value;
        this.setState({ search: keyword });
    }

    setFilter = () => {
        var filter = document.getElementById("filter").value;
        this.setState({ filter: filter });
    }

    sortMemeList = () => {
        const { memes } = this.state;
        var sort = document.getElementById("sort").value;
        let newMemeList;

        if (sort == "newest") {
            newMemeList = [...memes].sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate))
        }
        else if (sort == "oldest") {
            newMemeList = [...memes].sort((a, b) => new Date(a.creationDate) - new Date(b.creationDate))
        }
        else if (sort == "bestRating") {
            newMemeList = [...memes].sort((a, b) => b.stats.upvotes.length - a.stats.upvotes.length)
        }
        else if (sort == "worstRating") {
            newMemeList = [...memes].sort((a, b) => b.stats.downvotes.length - a.stats.downvotes.length)
        }
        else if (sort == "mostViewed") {
            newMemeList = [...memes].sort((a, b) => b.stats.views - a.stats.views)
        }
        else if (sort == "leastViewed") {
            newMemeList = [...memes].sort((a, b) => a.stats.views - b.stats.views)
        }

        this.setState({
            memes: newMemeList
        })
    }

    plusSlides(n) {
        this.showSlides(this.state.slideIndex += n);
    }

    showSlides(n) {
        var i;
        var slides = document.getElementsByClassName("slides");
        console.log(slides)
        if (slides.length) {
            if (n > slides.length) {
                this.state.slideIndex = 1
            }
            if (n < 1) {
                this.state.slideIndex = slides.length
            }
            for (i = 0; i < slides.length; i++) {
                slides[i].style.display = "none";   //element will not be displayed
            }
            slides[this.state.slideIndex - 1].style.display = "block";
        }
        // slides[this.state.slideIndex - 1].style.display = "block";
        console.log(slides[1])
    }

    /*componentDidMount = async () => {
        this.setState({ isLoading: true })

        await api.getAllMemes().then(memes => {
            this.setState({
                memes: memes.data.data,
                isLoading: false,
            })
        })
    }*/

    componentDidMount = async () => {
        this.setState({ isLoading: true })

        await api.getAllMemes().then(memes => {
            console.log("Memes with stats: ", memes)
            this.setState({
                memes: memes.data.data,
                isLoading: false,
            })
        })


        await api.getAllStats().then(stats => {
            console.log("test", stats)
            this.setState({
                stats: stats.data.data,
                isLoading: false,
            })
        })

        this.sortMemeList();

        this.showSlides(this.state.slideIndex);
    }

    render() {
        const { memes, isLoading } = this.state
        console.log('TCL: memesList -> render -> memes', memes)

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

            //This is for view testing
            <Wrapper>
                <CenterDiv>
                    <Search type="text" id="search" name="search" placeholder="Search for a meme title..." onChange={(e) => this.startSearch(e)}></Search>

Sort by: <Select name="sort" id="sort" onChange={this.sortMemeList}>
                        <option value="newest">newest</option>
                        <option value="oldest">oldest</option>
                        <option value="bestRating">rating (best)</option>
                        <option value="worstRating">rating (worst)</option>
                        <option value="mostViewed">views (most)</option>
                        <option value="leastViewed">views (least)</option>
                    </Select>
Filter: <Select name="filter" id="filter" onChange={this.setFilter}>
                        <option value="all">all</option>
                        <option value="jpg">jpg</option>
                        <option value="png">png</option>
                        <option value="katze">katze</option>
                        <option value="gif">gif</option>
                        <option value="image">image</option>
                        <option value="template">template</option>
                        <option value="video">video</option>
                    </Select>
                    

                    <div className="slideshow">
                    
                    <SlideShowTable>
                        <td><SlideButton onClick={this.plusSlides(-1)}>←</SlideButton></td>
                        <td>{memes.filter((meme) => {
                            if (this.state.filter == "all")
                                return meme
                            else if (meme.url.toLowerCase().includes(this.state.filter.toLowerCase())) {
                                return meme
                            }
                        }).filter((meme) => {
                            if (this.state.search == null)
                                return meme
                            else if (meme.name.toLowerCase().includes(this.state.search.toLowerCase())) {
                                return meme
                            }
                        }).map(meme => (
                            <div className="slides">

                                <Right>
                                    <label>{meme.name} // </label>
                                    <ActionButton>Shuffle ↔</ActionButton>
                                    <ActionButton>Diashow ►</ActionButton> 
                                </Right>
                                <MemeImg src={meme.url} alt={meme.name}></MemeImg>
                                <StatsTable>
                                    <tr>
                                        <td><p>{meme.stats.views} views</p></td>
                                        <td><p><Counter upVotes={meme.stats.upvotes.length} downVotes={meme.stats.downvotes.length} stats_id={meme.stats_id}></Counter></p></td>{/*upVotes={meme.stats.upVotes} downVotes={meme.stats.upVotes}*/}
                                        <td><p>{meme.creationDate}</p></td>
                                    </tr>
                                </StatsTable>
                                <Comment id={meme._id} commentCount={meme.comment_ids.length}></Comment>


                            </div>
                        ))}</td>
                        <td><SlideButton onClick={this.plusSlides(1)}>→</SlideButton></td>
                    </SlideShowTable>
                    </div>
                    
                </CenterDiv>

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
            </Wrapper>
        )
    }
}

export default SlideShow
