import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

import ChatWindow from "../components/ChatWindow";

var appState = observable({
    texts: [],
    sentiments: [],
});

@observer
class AppContainer extends React.Component{
    constructor(props) {
        super(props);
        // this.load = this.load.bind(this);
        // this.showResidue = this.showResidue.bind(this);
    }

    // load() {
    //     $.ajax({
    //         url: 'http://127.0.0.1:8000/api/chat/',
    //         type: 'get',
    //         dataType: 'json',
    //         success: function(data) {
    //             this.props.appState.residue = data;
    //             this.props.appState.todos = data;
    //         }.bind(this),
    //         error: function() {
    //             console.log('load err!');
    //         }.bind(this)
    //     });
    // }

    render() {
        
        return (
            <div style={{ backgroundColor: "#f5f5f5" }}>
                <ChatWindow appState={this.props.appState} />
            </div>
        );
    }
}

ReactDOM.render(
    <AppContainer appState={appState}/>,
    document.getElementById('app')
);