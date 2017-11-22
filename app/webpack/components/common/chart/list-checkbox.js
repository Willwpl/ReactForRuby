import React, {Component} from 'react';
import CheckboxListItem from './list-checkbox-item';
// import {findUpLimit, getRandomColor} from '../../../javascripts/componentService/util';

export default class CheckboxList extends Component {

    constructor(props) {
        super(props);
        this.filters = [];
    }

    // componentWillReceiveProps(next) {
    //     if (this.filters.length === 0 && next.list) {
    //         next.list.forEach(element => {
    //             let id = element.user_id;
    //             let color = element.color;
    //             this.filters.push({id, color});
    //         })
    //         if (this.props.onCheckeds) {
    //             this.props.onCheckeds(this.filters);
    //         }
    //     }
    // }

    selectAll(list) {
        this.filters = [];
        list.forEach(element => {
            let id = element.user_id;
            let color = element.color;
            this.filters.push({id, color});
        })
        if (this.props.onCheckeds) {
            this.props.onCheckeds(this.filters);
        }
    }

    makeCheckeds(id, status, color) {
        this.filters = this.filters.filter(element => {
            return element.id !== id;
        });
        if (status) {
            this.filters.push({id, color});
        }
        if (this.props.onCheckeds) {
            this.props.onCheckeds(this.filters);
        }
    }

    render() {
        let checkItems;
        if (this.props.list) {
            checkItems = this.props.list.map((obj, index) => {
                return (
                    <CheckboxListItem key={obj.user_id} id={obj.user_id} display={obj.company_name} color={obj.color} onCheck={this.makeCheckeds.bind(this)}/>
                );
            })
        }
        return (
            <ul className="charList">
                {checkItems}
            </ul>

        );
    }
}