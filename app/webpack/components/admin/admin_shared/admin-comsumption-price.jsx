import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import moment from 'moment';
import {formatPower} from '../../../javascripts/componentService/util';
export default class AdminComsumptionPrice extends Component {
  constructor(props){
    super(props);
    this.state={
        
    }
}

componentDidMount() {
    
}
render() {
    //console.log(this.winner.data);
    return (
        <div className="u-grid mg0">
               <div className="col-sm-12 u-mb1" id="price_title">{this.props.type === 'View Company Consumption Details' ? 'Company' : 'Individual'} Consumption Total Summary:</div>
               <div className="col-sm-12 u-mb1" id="price_number">Number of Buyers: {this.props.price.consumption_count} Number of Accounts: {this.props.price.account_count}</div>
               <table className="retailer_fill w_100"  cellPadding="0" cellSpacing="0">
               <thead>
               <tr>
                   <th></th>
                   <th>LT</th>
                   <th>HT (Small)</th>
                   <th>HT (Large)</th>
                   <th>EHT</th>
                   </tr>
               </thead>
               <tbody>
                   <tr>
                       <td>Peak<br/>(7am-7pm)</td>
                       <td >{formatPower(parseInt(Number(this.props.price.lt_peak)), 0, '')}</td>
                       <td >{formatPower(parseInt(Number(this.props.price.hts_peak)), 0, '')}</td>
                       <td >{formatPower(parseInt(Number(this.props.price.htl_peak)), 0, '')}</td>
                       <td >{formatPower(parseInt(Number(this.props.price.eht_peak)), 0, '')}</td>
                   </tr>
                   <tr>
                       <td>Off-Peak<br/>(7pm-7am)</td>
                       <td >{formatPower(parseInt(Number(this.props.price.lt_off_peak)), 0, '')}</td>
                       <td >{formatPower(parseInt(Number(this.props.price.hts_off_peak)), 0, '')}</td>
                       <td >{formatPower(parseInt(Number(this.props.price.htl_off_peak)), 0, '')}</td>
                       <td >{formatPower(parseInt(Number(this.props.price.eht_off_peak)), 0, '')}</td>
                   </tr>
               </tbody>
           </table>
            </div>
    )
  }
}