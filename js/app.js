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

window.ee = new EventEmitter();

var Article = React.createClass({
    propTypes: {
        data: React.PropTypes.shape({
            author: React.PropTypes.string.isRequired,
            text: React.PropTypes.string.isRequired,
        })
    },

    render: function () {
        var author = this.props.data.author,
            text = this.props.data.text;

        return (
            <div className='article'>
                <p className='news__author'>{author}:</p>
                <p className='news__text'>{text}</p>
            </div>
        )
    }
});

var News = React.createClass({
    propTypes: {
        data: React.PropTypes.array.isRequired
    },

    getInitialState: function () {
        return {
            counter: 0
        }
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
        }];

        window.ee.emit('News.add', item);

        textEl.value = '';
        this.setState({textIsEmpty: true});
    },

    onFieldChange: function (fieldName, e) {
        if (e.target.value.trim().length > 0) {
            this.setState({['' + fieldName]: false})
        } else {
            this.setState({['' + fieldName]: true})
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
                    onChange={this.onFieldChange.bind(this, 'authorIsEmpty')}
                    placeholder='Ваше имя'
                    ref='author'
                />
                <textarea
                    className='add__text'
                    onChange={this.onFieldChange.bind(this, 'textIsEmpty')}
                    placeholder='Текст новости'
                    ref='text'
                />
                <button
                    className='add__btn'
                    onClick={this.onBtnClickHandler}
                    ref='alert_button'
                    disabled={authorIsEmpty || textIsEmpty}>
                    Опубликовать новость
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
        var self = this;
        window.ee.addListener('News.add', function (item) {
            var nextNews = item.concat(self.state.news);
            self.setState({news: nextNews});
        });
    },

    componentWillUnmount: function () {
        window.ee.removeListener('News.add');
    },

    render: function () {
        return (
            <div className='app'>
                <Add />
                <h3 className='title'>Новости</h3>
                <News data={this.state.news}/>
            </div>
        );
    }
});

ReactDOM.render(
    <App />,
    document.getElementById('root')
);
