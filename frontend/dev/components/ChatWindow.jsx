import React from 'react';
import axios from 'axios';
import $ from "jquery";
import { observable } from 'mobx';
import { observer } from 'mobx-react';

@observer
class ChatWindow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      msgCount: 0,
      currentSentiment: {
        "neutral": 0,
        "surprise": 0,
        "sadness": 0,
        "contempt": 0,
        "fear": 0,
        "happiness": 0,
        "anger": 0,
        "disgust": 0
      },
      recentSentiments: [],
    }
  }

  componentWillMount() {
    axios.get('http://127.0.0.1:8000/api/chat/')
      .then((response) => {
        this.props.appState.texts = response.data
      })
      .catch((error) => {
        console.log(error);
      });
  }

  renderTexts = () => {
    return (
      this.props.appState.texts.map((t) => {
        if (t.meme) {
          return (
            <p key={t.id}>
              <img src={t.meme} alt=""/> {t.text}
            </p>
          )
        }
        return (
          <p key={t.id}>
            {t.text}
          </p>
        );
      })
    )
  }

  saveChat = (formData, sentimentData) => {
    //保存分析结果至数据库
    $.ajax({
      url: 'http://127.0.0.1:8000/api/chat/',
      data: formData,
      type: 'POST',
      contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
      processData: false, // NEEDED, DON'T OMIT THIS
      success: function (data) {
        this.props.appState.texts.push(data);
        this.refs.textInput.value = '';
        this.refs.imgInput.value = '';

        // console.log(sentimentData)
        let sentiments = JSON.parse(sentimentData)
        for (let sentimentKey in sentiments) {
          sentiments[sentimentKey] = 1.3 * (1 - 0.15 * this.state.msgCount) * parseFloat(sentiments[sentimentKey])
        }
        // console.log(sentiments);

        this.state.recentSentiments.push(sentiments)
        this.setState({ recentSentiments: this.state.recentSentiments })
        // console.log(this.state.recentSentiments);

        let index_count = 4;

        for (let sentiments of this.state.recentSentiments) {
          for (const sentimentKey in sentiments) {
            sentiments[sentimentKey] = index_count * sentiments[sentimentKey];
            this.state.currentSentiment[sentimentKey] = this.state.currentSentiment[sentimentKey] + sentiments[sentimentKey]
          }
          index_count -= 1;
          if (index_count < 1) index_count = 1

          this.setState({ currentSentiment: this.state.currentSentiment });
        }
        // console.log(this.state.currentSentiment);
        

      }.bind(this),
      error: function (err) {
        console.log('err occured!')
        console.log(err)
      }.bind(this)
    });

    return
  }

  handleAddSubmit = (event) => {
    event.preventDefault();

    if (this.refs.textInput.value === '' && this.refs.imgInput.value === '') {
        alert('请输入消息/上传图片')
        return;
    }

    let formData = new FormData();
    formData.append('text', this.refs.textInput.value);
    formData.append('image', $('input[type=file]')[0].files[0]);

    // 仅发送图片时分析图片
    if (this.refs.imgInput.value !== '' && this.refs.textInput.value === '') {
      $.ajax({
        url: 'http://115.159.33.68/meme/',
        data: formData,
        type: 'POST',
        contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
        processData: false, // NEEDED, DON'T OMIT THIS
        success: function (data) {
          // console.log('sentiments: ' + data)
          this.props.appState.sentiments.push(data);
          formData.append('sentiments', data);
          this.setState({ msgCount: this.state.msgCount + 1 }, () => {
            if (this.state.msgCount > 6) {
              this.setState({ msgCount: 0 })
            }
          })
          this.saveChat(formData, data);
        }.bind(this),
        error: function (err) {
          console.log('err occured!')
          console.log(err)
        }.bind(this)
      })

      return;
    }

    // // 仅发送文字时分析文字  bug to resolve !
    // if (this.refs.imgInput.value === '' && this.refs.textInput.value !== '') {
    //   $.ajax({
    //     url: 'http://115.159.33.68/meme/',
    //     data: formData,
    //     type: 'POST',
    //     contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
    //     processData: false, // NEEDED, DON'T OMIT THIS
    //     success: function (data) {
    //       console.log('sentiments: ' + data)
    //       this.props.appState.sentiments.push(data);
    //       this.saveChat(formData);
    //     }.bind(this),
    //     error: function (err) {
    //       console.log('err occured!')
    //       console.log(err)
    //     }.bind(this)
    //   })

    //   return;
    // }

    // 同时分析文字及图片
    // $.ajax({
    //   url: 'http://115.159.33.68/meme/',
    //   data: formData,
    //   type: 'POST',
    //   contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
    //   processData: false, // NEEDED, DON'T OMIT THIS
    //   success: function (data) {
    //     console.log('sentiments: ' + data)
    //     this.props.appState.sentiments.push(data);
    //     let combinedFormData = data;

    //     $.ajax({
    //       url: 'http://115.159.33.68/meme/',
    //       data: formData,
    //       type: 'POST',
    //       contentType: false, // NEEDED, DON'T OMIT THIS (requires jQuery 1.6+)
    //       processData: false, // NEEDED, DON'T OMIT THIS
    //       success: function (data) {
    //         console.log('sentiments: ' + data)
    //         this.props.appState.sentiments.push(data);
    //         // todo

    //         this.saveChat(formData);
    //       }.bind(this),
    //       error: function (err) {
    //         console.log('err occured!')
    //         console.log(err)
    //       }.bind(this)
    //     })
    //   }.bind(this),
    //   error: function (err) {
    //     console.log('err occured!')
    //     console.log(err)
    //   }.bind(this)
    // })


  }

  renderInput = () => {
    return (
      <form>
        <input type="file" id="image" name="image" ref="imgInput" accept="image/jpg, image/jpeg, image/png" />
        <br />
        <input type="text" id="text" name="text" ref="textInput" />
        <input type="image" style={{ display: 'none' }}/>
        <span onClick={() => this.handleAddSubmit(event)}>发送</span>
      </form>
    )
  }

  renderSentiment = () => {
    let currentSentimentValueSet = []
    for (const sentiment in this.state.currentSentiment) {
      currentSentimentValueSet.push(this.state.currentSentiment[sentiment])
    }
    currentSentimentValueSet = currentSentimentValueSet.sort((x, y) => {
      if (x < y) return -1;
      if (x > y) return 1;
      return 0;
    });
    console.log(currentSentimentValueSet)

    let currentSentimentKeySet = []
    for (const sentiment in this.state.currentSentiment) {
      if (this.state.currentSentiment[sentiment] === currentSentimentValueSet[0] ||
        this.state.currentSentiment[sentiment] === currentSentimentValueSet[1]) {
        currentSentimentKeySet.push(sentiment)
      }
    }
    console.log(currentSentimentKeySet)

    // if (sentimentValueSet[0] - sentimentValueSet[1] > 0.3) {

    // }

    for (const currentSentimentKey of currentSentimentKeySet) {
      return (
        <span style={{ marginRight: '5px' }}>
          {currentSentimentKey}
        </span>
      )
    }
  }

  render() {

    return (
      <div className="chat-window">
        <h5 className="head">聊天室</h5>
        <div className="chat-box">
          {this.renderTexts()}
        </div>
        <div>
          {this.renderSentiment()}
        </div>
        <div className="footer">
          {this.renderInput()}
        </div>
      </div>
    );
  }
}

export default ChatWindow;
