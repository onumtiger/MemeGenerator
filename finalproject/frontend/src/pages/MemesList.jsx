import React, { Component } from 'react'
import ReactTable from 'react-table'
import 'react-table'
import api from '../api'

import styled from 'styled-components'
import '../style/react-table.css'



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

const Votes = styled.label`
color: green;
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

const MemeImg = styled.img`
display: block;
  margin-left: auto;
  margin-right: auto;
  width: 70%;
  max-width: 500px;
  
`

const StatsTable = styled.table`
  margin: auto;
  width: 50%;
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

class MemesList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            memes: [],
            columns: [],
            isLoading: false,
        }
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

    render() {
        const { memes, isLoading } = this.state
        console.log('TCL: memesList -> render -> memes', memes)

        const columns = [
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
        ]

        let showTable = true
        if (!memes.length) {
            showTable = false
        }

        return (

            //This is for view testing
            <Wrapper>
                <CenterDiv>  
                <Right>
                    <label>Goethe // </label>
                    <ActionButton>↓</ActionButton>
                    <ActionButton>→</ActionButton>
                   </Right>
                    <MemeImg src="https://adz.ro/fileadmin/_processed_/5/e/csm_meme1_9e3229f399.jpg" alt="Goethe"></MemeImg>
                    <StatsTable>
                        <tr>
                            <td><Votes>↑ 412</Votes></td>
                            <td><label>11 comments</label></td>
                            <td><label>230 views</label></td>
                        </tr>
                    </StatsTable>
                </CenterDiv>

                <CenterDiv>  
                <Right>
                    <label>Stuff // </label>
                    <ActionButton>↓</ActionButton>
                    <ActionButton>→</ActionButton>
                   </Right>
                    <MemeImg src="https://lh3.googleusercontent.com/proxy/f_a9u6It28uXF5oRkGziafKHIeBxk0zyo-8HJAfWe15wAKzDcRUWeiIXgdvM0KiWleA53AtU97bvZSab_atxWTdQK8WFki908FtMTuP-id2lNAU0jffAUJmBCY6cvPuU3oEwRrcWjF86" alt="Goethe"></MemeImg>
                    <StatsTable>
                        <tr>
                            <td><Votes>↑ 412</Votes></td>
                            <td><label>11 comments</label></td>
                            <td><label>230 views</label></td>
                        </tr>
                    </StatsTable>
                </CenterDiv>

                <CenterDiv>  
                <Right>
                    <label>Cat // </label>
                    <ActionButton>↓</ActionButton>
                    <ActionButton>→</ActionButton>
                   </Right>
                    <MemeImg src="https://i.pinimg.com/originals/b7/1f/4b/b71f4bf1cbeecc1db2971156993fbffa.jpg" alt="Goethe"></MemeImg>
                    <StatsTable>
                        <tr>
                            <td><Votes>↑ 412</Votes></td>
                            <td><label>11 comments</label></td>
                            <td><label>230 views</label></td>
                        </tr>
                    </StatsTable>
                </CenterDiv>


                <div></div>
                {showTable && (
                    <ReactTable
                        data={memes}
                        columns={columns}
                        loading={isLoading}
                        defaultPageSize={10}
                        showPageSizeOptions={true}
                        minRows={0}
                    />
                )}
            </Wrapper>
        )
    }
}

export default MemesList
