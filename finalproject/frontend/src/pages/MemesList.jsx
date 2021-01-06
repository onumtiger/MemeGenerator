import React, { Component } from 'react'
import ReactTable from 'react-table'
import 'react-table'
import api from '../api'

import styled from 'styled-components'
import '../style/react-table.css'


const Wrapper = styled.div`
padding: 0 40px 40px 40px;
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

    componentDidMount = async () => {
        this.setState({ isLoading: true })

        await api.getAllMemes().then(movies => {
            this.setState({
                memes: movies.data.data,
                isLoading: false,
            })
        })
    }

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
            <Wrapper>
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
