window.ee = new EventEmitter();

var my_news = [
    {
        author: 'Саша Печкин',
        text: 'В четчерг, четвертого числа...',
        bigText: 'в четыре с четвертью часа четыре чёрненьких чумазеньких чертёнка чертили чёрными чернилами чертёж.'
    },
    {
        author: 'Просто Вася',
        text: 'Считаю, что $ должен стоить 35 рублей!',
        bigText: 'А евро 42!'
    },
    {
        author: 'Гость',
        text: 'Бесплатно. Скачать. Лучший сайт - http://localhost:3000',
        bigText: 'На самом деле платно, просто нужно прочитать очень длинное лицензионное соглашение'
    }
];

var News = React.createClass({
    propTypes: {
        data: React.PropTypes.array.isRequired
    },

    render: function () {
        var data = this.props.data;
        var newsTemplate;
        if (data.length > 0) {
            newsTemplate = data.map(function (item, index) {
                return (
                    <div key={index}>
                        <Article data={item}/>
                    </div>
                )
            })
        } else {
            newsTemplate = <p>К сожалению новостей нет</p>
        }
        return (
            <div className='news'>
                {newsTemplate}
            </div>
        );
    }
});


var Article = React.createClass({
    propTypes: {
        data: React.PropTypes.shape({
            author: React.PropTypes.string.isRequired,
            text: React.PropTypes.string.isRequired,
            bigText: React.PropTypes.string.isRequired
        })
    },
    getInitialState: function () {
        return {
            visible: false
        };
    },

    readmoreClick: function () {
        this.setState({visible: true});
        return false;
    },


    render: function () {
        var author = this.props.data.author,
            text = this.props.data.text,
            bigText = this.props.data.bigText,
            visible = this.state.visible;
        return (
            <div className='article'>
                <p className='news__author'>{author}:</p>
                <p className='news__text'>{text}</p>

                <a href="#" onClick={this.readmoreClick}
                   className={'news__readmore '	+ (visible	? 'none': '')}>Подробнее</a>
                <p className={'news__big-text '	+ (visible	? '': 'none')}>{bigText}</p>
            </div>
        )
    }
});

var Add = React.createClass({
    getInitialState: function () {
        return {
            authorIsEmpty: true,
            textIsEmpty: true
        };
    },
    componentDidMount: function () {
        ReactDOM.findDOMNode(this.refs.author).focus();
    },
    onBtnClickHandler: function (e) {
        e.preventDefault();
        var textEl = ReactDOM.findDOMNode(this.refs.text);
        var author = ReactDOM.findDOMNode(this.refs.author).value;
        var text = textEl.value;
        var item = [{
            author: author,
            text: text,
            bigText: '...'
        }];
        window.ee.emit('News.add', item);
        textEl.value = '';
        this.setState({textIsEmpty: true});
    },
    onAuthorChange: function (e) {
        if (e.target.value.trim().length > 0) {
            this.setState({authorIsEmpty: false})
        } else {
            this.setState({authorIsEmpty: true})
        }
    },
    onFieldChange: function (fieldName, e) {
        if (e.target.value.trim().length > 0) {
            this.setState({['' + fieldName]: false})
        } else {
            this.setState({['' + fieldName]: true})
        }
    },

    onTextChange: function (e) {
        if (e.target.value.trim().length > 0) {
            this.setState({textIsEmpty: false})
        } else {
            this.setState({textIsEmpty: true})
        }
    },
    render: function () {
        var authorIsEmpty = this.state.authorIsEmpty,
            textIsEmpty = this.state.textIsEmpty;
        return (
            <form className='add cf'>
                <input
                    type='text'
                    className='add__author'
                    onChange={this.onFieldChange.bind(this,	'authorIsEmpty')}
                    placeholder='Ваше имя'
                    ref='author'
                />
                <textarea
                    className='add__text'
                    onChange={this.onFieldChange.bind(this,	'textIsEmpty')}
                    placeholder='Текст новости'
                    ref='text'
                />
                <button
                    className='add__btn'
                    onClick={this.onBtnClickHandler}
                    ref='alert_button'
                    disabled={authorIsEmpty	||	textIsEmpty}
                >
                    Отправить
                </button>
            </form>
        );
    }
});


var App = React.createClass({
    getInitialState: function () {
        return {
            news: my_news
        };
    },
    componentDidMount: function () {
        var _this = this;
        window.ee.addListener('News.add', function (item) {
            var nextNews = item.concat(_this.state.news);
            _this.setState({news: nextNews});
        });
    },
    componentWillUnmount: function () {
        window.ee.removeListener('News.add');
    },
    render: function () {
        return (
            <div className='app'>
                <Add    />
                <h3>Новости</h3>
                <News data={this.state.news}/>
            </div>
        );
    }
});

ReactDOM.render(
    <App    />,
    document.getElementById('root')
);



