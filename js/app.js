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


//--------------------IGOR NEVENITSA HOMEWORK ---------------------
window.ee = new EventEmitter();


var Article = React.createClass({
    propTypes: {
        data: React.PropTypes.shape({
            author: React.PropTypes.string.isRequired,
            text: React.PropTypes.string.isRequired,
            bigText: React.PropTypes.string.isRequired
        })
    },
    getInitialState: function() {
      return {
          visible: false,
          rating: 0,

      }
    },
    readmore: function(e)	{
        e.preventDefault();
        this.setState({visible:	true});
    },
    render: function() {
        var author = this.props.data.author;
        var text = this.props.data.text;
        var bigText = this.props.data.bigText;
        var visible = this.state.visible;

        return (
            <div className="article" >
                <p className="news__author">{author}:</p>
                <p className="news__text">{text}</p>
                <a href="#" onClick={this.readmore} className="news__readmore">Подробнее</a>
                <p className={'news__big-text ' + (visible ? '': 'none')} > {bigText} </p>

            </div>
        )
    }});

var	News	=	React.createClass({
    propTypes:	{
        data: React.PropTypes.array.isRequired
    },

    render:	function()	{
        var	data = this.props.data;
        var	newsTemp;

        if(data.length > 0) {
         newsTemp = data.map(function(item,	index)	{
            return	(
                <div  key={index}>
                    <Article data={item}/>
                </div>
            )
        })
        }else {
            newstemp = <p>Новостей нет..........</p>
        }
    return	(
        <div
            className="news">
            {newsTemp}
            <strong	className={'news__count ' + (data.length > 0 ? '' : 'none')}>Всего новостей: {data.length}</strong>
        </div>
    );
    }
});

var Add = React.createClass({
    getInitialState: function() {
        return {
            agreeNotChecked: true,
            authorIsEmpty: true,
            textIsEmpty: true
        };
    },
    componentDidMount:	function()	{
        ReactDOM.findDOMNode(this.refs.author).focus();
    },
    btnClickHandle: function(e) {
        e.preventDefault();
        var	textEl = ReactDOM.findDOMNode(this.refs.text);
        var author = ReactDOM.findDOMNode(this.refs.author).value;
        var text = textEl.value;
        var	item = [{
            author:	author,
            text:	text,
            bigText:	'...'
        }];
        window.ee.emit('News.add',	item);

        textEl.value = '';
        this.setState({textIsEmpty:	true});
    },
    isCheck: function() {
        this.setState({agreeNotChecked: !this.state.agreeNotChecked});
    },
    fieldChange: function(fieldName, e) {
        if (e.target.value.trim().length > 0) {
            this.setState({[''+fieldName]:false})
        } else {
            this.setState({[''+fieldName]:true})
        }
    },

   render: function () {
       var agreeNotChecked = this.state.agreeNotChecked;

       var authorIsEmpty = this.state.authorIsEmpty;

       var textIsEmpty = this.state.textIsEmpty;

       return(
           <form className='add	cf'>
                 <input className='add__author' type="text" defaultValue='' placeholder='Автор' ref='author'  onChange={this.fieldChange.bind(this,'authorIsEmpty')}/>
                <textarea className='add__text' defaultValue='' placeholder='введите новость'	ref='text'  onChange={this.fieldChange.bind(this,'textIsEmpty')}/>
                <label className='add__checkrule'>
                <input	type='checkbox' 	ref='checkrule'  onChange={this.isCheck}/>Пожалуй соглашусь
                </label>
               <button onClick={this.btnClickHandle} disabled={agreeNotChecked || authorIsEmpty || textIsEmpty} className='add__btn' ref="alert-btn"> Додати Новину </button>
           </form>
       );
}});


/**/


var	App	= React.createClass({
    getInitialState: function()	{
        return	{
            news: my_news
        };
    },
        componentDidMount:	function()	{
        var	self	=	this;
        window.ee.addListener('News.add',
            function(item)	{
            var	nextNews= item.concat(self.state.news);
                self.setState({news: nextNews});
        });
    },
    componentWillUnmount:	function()	{
        window.ee.removeListener('News.add');
    },
    render:	function()	{
        return	(
        <div className="app">
            <Add/>
            <h3>новости</h3>
            <News data={this.state.news}/>

        </div>
        );
    }
});



ReactDOM.render(
    <App	/>,
    document.getElementById('root')
);

