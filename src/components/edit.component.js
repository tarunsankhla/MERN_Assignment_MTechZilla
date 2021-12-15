import React, { Component } from 'react';
import axios  from 'axios';

export default class EditTodo extends Component {
    constructor(props){
        super(props);

        this.onchangetododescription = this.onchangetododescription.bind(this);
        this.onchangetodoresponsible = this.onchangetodoresponsible.bind(this);
        this.onchangetodopriority = this.onchangetodopriority.bind(this);
        this.onchangetodocompleted = this.onchangetodocompleted.bind(this);
        this.onChangeTodoPhoto = this.onChangeTodoPhoto.bind(this);
        this.onSubmit = this.onSubmit.bind(this);


        this.state={
            todo_description: '',
            todo_responsible: '',
            todo_priority: '',
            todo_photo:'',
            todo_completed: false
        }
    }
    componentDidMount(){
        axios.get('http://localhost:4000/todos/'+this.props.match.params.id)
        .then(response=>{
            this.setState({
                todo_description: response.data.todo_description,
                todo_responsible: response.data.todo_responsible,
                todo_priority: response.data.todo_priority,
                todo_photo : response.data.todo_photo,
                todo_completed: response.data.todo_completed
            })            
        })
        .catch(function(err){
            console.log(err);
        });
    }
    onchangetododescription(e){
        this.setState({todo_description: e.target.value});
    }
    onchangetodoresponsible(e){
        this.setState({todo_responsible: e.target.value});
    }
    onchangetodopriority(e){
        this.setState({todo_priority: e.target.value});
    }
    onchangetodocompleted(e){
        this.setState({todo_completed: e.target.value});
    }
    onChangeTodoPhoto(e) {
        this.setState({
            todo_photo: e.target.files[0]
        });
    }
    onSubmit(e) {
        e.preventDefault();
        const obj = {
            todo_description: this.state.todo_description,
            todo_responsible: this.state.todo_responsible,
            todo_priority: this.state.todo_priority,
            todo_photo : this.state.todo_photo,
            todo_completed: this.state.todo_completed
        };
        console.log(obj);
        axios.post('http://localhost:4000/todos/update/'+this.props.match.params.id, obj)
            .then(res => console.log(res.data));
        
        this.props.history.push('/');
    }
    

  
    render() {
        return (
            <div>
                <h3 align='centre'>Update todo</h3>
                <form onSubmit={this.onSubmit} enctype="multipart/form-data">
                    <div className="form-group">
                        <label> Description:  </label>
                        <input type="text"
                        className="form-control"
                        value={this.state.todo_description}
                        onChange={this.onchangetododescription}/>
                    </div>
                    <div className="form-group">
                    <label> Responsible:  </label>
                        <input type="text"
                        className="form-control"
                        value={this.state.todo_responsible}
                        onChange={this.onchangetodoresponsible}/>
                    </div>
                    <div>
                        <label>photo:</label>
                        <input
                        type="file"
                        className="form-control"
                        accept=".png, .jpg, .jpeg"
                        value={this.state.todo_photo}
                        onChange={this.onChangeTodoPhoto}
                    />
                    </div>
                    <div className="form-group">
                        <div className="form-check form-check-inline">
                            <input className="form-check-input"
                                type="radio"
                                name='priorityOptions'
                                id='priorityLow'
                                value='Low'
                                checked={this.state.todo_priority === 'Low'}
                                onChange={this.onchangetodopriority}
                                />
                            <label className="form-check-label">LOW</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input"
                                    type="radio"
                                    name='priorityOptions'
                                    id='priorityMedium'
                                    value='Medium'
                                    checked={this.state.todo_priority === 'Medium'}
                                    onChange={this.onchangetodopriority}
                                    />
                            <label className="form-check-label">MEDIUM</label>
                        </div>
                        <div className="form-check form-check-inline">
                            <input className="form-check-input"
                                    type="radio"
                                    name='priorityOptions'
                                    id='priorityHigh'
                                    value='High'
                                    checked={this.state.todo_priority === 'High'}
                                    onChange={this.onchangetodopriority}
                                    />
                            <label className="form-check-label">HIGH</label>
                        </div>
                    </div>
                    <div className="form-group">
                    <div className="form-check form-check-inline">
                            <input className="form-check-input"
                                    type="radio"
                                    name='completed'
                                    id='completed'
                                    checked={this.state.todo_completed}
                                    onChange={this.onchangetodocompleted}
                                    value={this.state.todo_completed}
                                    />
                            <label className="form-check-label" htmlFor='checked'>Completed</label>
                        </div>
                    </div>
                    <br />

                    <div className="form-group">
                        <input type="submit" value="Update Todo" className="btn btn-primary" />
                    </div>

                  
                </form>
            </div>
        )
    }
}
