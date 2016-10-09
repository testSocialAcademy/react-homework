var ListBlockItem = React.createClass({
    getInitialState: function () {
        return {
            id: '',
            name: '',
            image: '',
            weakness: '',
            super_effective: '',
            resource_uri: "",
            liked: false,
            idType: '',
            toggleClass:"single-pokemon-block"
        };
    },
    componentDidMount: function () {

        this.serverRequest = $.get(this.props.source, function (result) {
            var index = this.props.data;
            var response = /*JSON.parse(*/result/*)*/;
            console.log(response);
            var id_num = response.objects[index].national_id;
            var imageSource = "http://pokeapi.co/media/img/" + id_num + ".png";

            this.setState({
                id: response.objects[index].national_id,
                name: response.objects[index].name,
                resource_uri: response.objects[index].resource_uri,
                image: imageSource,
                type: response.objects[index].types,
                attack: response.objects[index].attack,
                defence: response.objects[index].defence,
                hp: response.objects[index].hp,
                spAttack: response.objects[index].sp_atk,
                spDefence: response.objects[index].sp_def,
                speed: response.objects[index].speed,
                weight: response.objects[index].weight,
                totalMoves: response.objects[index].total
            });
        }.bind(this));
    },
    likeButtonHandler: function(){
        if(this.state.liked==false){
        this.setState({
            liked: !this.state.liked
        });
        var pokemon = 'pokemon'+this.state.id;
        localStorage.setItem(pokemon, JSON.stringify([{
            id: this.state.id,
            name: this.state.id,
            image: this.state.id,
            type: this.state.type,
            attack: this.state.attack,
            defence: this.state.defence,
            hp: this.state.hp,
            spAttack: this.state.spAttack,
            spDefence:this.state.spDefence,
            speed: this.state.speed,
            weight: this.state.weight,
            totalMoves: this.state.totalMoves
        }]))}else{
            this.setState({
                liked: !this.state.liked
            })
            var pokemon = 'pokemon'+this.state.id;
            localStorage.removeItem(pokemon)
        }
    },
    showTableHandler: function(){
       /* this.props.onClick(this.state.id);*/
    },
    onImageClickHandler: function(){
        localStorage.setItem('tableLoad', JSON.stringify([{
            id: this.state.id,
        }]));
        if(this.state.toggleClass=='single-pokemon-block'){
            this.setState({toggleClass:'single-pokemon-block-active'});
        }else{
            this.setState({toggleClass:'single-pokemon-block'});
        }
        /*this.props.onUpdate(this.state.id)*/
    },
    render: function () {
        return (<div ref="PokemonComponent">
                <li className={this.state.toggleClass} onClick={this.showTableHandler}>
                    <img src={this.state.image} className="image" onClick={this.onImageClickHandler}/>

                    <p className="info">
                        {this.state.name},
                        #{this.state.id}
                    </p>
                     <img className="like" onClick={this.likeButtonHandler} src={"style/like-"+this.state.liked+".png"} className={"liked-"+this.state.liked} />
                </li>
            </div>
        );
    }
});

var PokeInfoTable = React.createClass({
    getInitialState: function () {
        return {id: JSON.parse(localStorage.getItem('tableLoad'))[0].id,
            name: '',
            image: '',
            type: '',
            attack: '',
            defence: '',
            hp: '',
            spAttack:'',
            spDefence: '',
            speed: '',
            weight: '',
            totalMoves: ''}
    },
    componentDidMount: function(){
        var ind = this.state.id;
        this.source="http://pokeapi.co/api/v1/pokemon/"+ind+"/";
        this.serverRequest = $.get(this.source , function (result) {
            var tableResponse = /*JSON.parse(*/result/*)*/;
            var imageSource = "http://pokeapi.co/media/img/" + ind + ".png";
            console.log(tableResponse);
            this.setState({
                named: tableResponse.name,
                image: imageSource,
                type: tableResponse.types,
                attack: tableResponse.attack,
                defence: tableResponse.defence,
                hp: tableResponse.hp,
                spAttack: tableResponse.sp_atk,
                spDefence: tableResponse.sp_def,
                speed: tableResponse.speed,
                weight: tableResponse.weight,
                totalMoves: tableResponse.total
            });
        }.bind(this));
    },
    componentWillUpdate: function(){


    },
    render: function () {
        window.addEventListener('storage', function(e) {
            console.log('старое значение: ' + e.oldValue);
            console.log('новое значение: ' + e.newValue);
            console.log('Страница, вызвавшая метод изменения: ' + e.url);
            console.log('Область: ' + e.storageArea);
            if(JSON.parse(e.newValue[0].id)) {
            this.setState({id:JSON.parse(localStorage.getItem('tableLoad'))[0].id})}
        });
        return (
            <div className="poke-table">
                <img src={this.state.image}/>
                <p className="info">
                    {this.state.named},
                    #{this.state.id}
                </p>
                <table className="poke-inner-table">
                    <tr>
                        <td>Specs</td><td>Context</td>
                    </tr>
                    <tr>
                        <td>Type</td><td>{JSON.stringify(this.state.type)}</td>
                    </tr>
                    <tr>
                        <td>Attack</td><td> {JSON.stringify(this.state.attack)}</td>
                    </tr>
                    <tr>
                        <td>Defence</td><td> {JSON.stringify(this.state.defence)}</td>
                    </tr>
                    <tr>
                        <td>HP</td><td> {JSON.stringify(this.state.hp)}</td>
                    </tr>
                    <tr>
                        <td>SP_Attack</td><td> {JSON.stringify(this.state.spAttack)}</td>
                    </tr>
                    <tr>
                        <td>SP_Defence</td><td> {JSON.stringify(this.state.spDefence)}</td>
                    </tr>
                    <tr>
                        <td>Speed</td><td> {JSON.stringify(this.state.speed)}</td>
                    </tr>
                    <tr>
                        <td>Weight</td><td> {JSON.stringify(this.state.weight)}</td>
                    </tr>
                    <tr>
                        <td>Total Moves</td><td> {JSON.stringify(this.state.totalMoves)}</td>
                    </tr>
                </table>
            </div>
        );
    }
});

var ListBlockTemplate = React.createClass({
    getInitialState: function () {
        return {itemsNumber: '12',
                /*localId:''*/};
    },
   /* onUpdate: function(val){
        this.setState({localId: val})
        }
*/    onButtonClickHandler: function(e){
        e.preventDefault();
        this.setState({itemsNumber: parseInt(this.state.itemsNumber)+ 12})
    },
    render: function () {
        var data = parseInt(this.state.itemsNumber);
        console.log(data);
        var mappingArray = [];
        function generateStream(mappingArray){
            for (let i = 0; i < data; i++) {
                mappingArray.push(i);
            }
            return mappingArray;
        };
        var mappingArray = generateStream(mappingArray);
        console.log(mappingArray);

        return (<div className="container1">

            <ul className="list-block">
            {mappingArray.map(function (name, index) {
                return (
                <ListBlockItem
                   /* onUpdate={this.onUpdate}*/
                    className="list-block-item"app.js
                    key={index}
                    data={name}
                    source={"http://pokeapi.co/api/v1/pokemon/?limit="+ data}
                    sourceType="http://pokeapi.co/api/v1/type/?limit=999"
                    >
                </ListBlockItem>);
            })}
                <button className="more" onClick={this.onButtonClickHandler}>Load More</button>
            </ul>
            <PokeInfoTable  className = "poke-table" /*property={this.state.localId}*/ />
            </div>)
    }
});




var App = React.createClass({
    render: function() {
        return (
            <div className="app">
            <span className="title">POKEDEX</span>
                <ListBlockTemplate className="container2" />
            </div>
        );
    }
});

ReactDOM.render(
    <App />, document.getElementById('root')
)
