import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import {RetailsOnlineStatus} from './admin_shared/retailers-online-status';
import {TimeCuntDown} from '../shared/time-cuntdown';
import {getBidderStatus, upateHoldStatus} from '../../javascripts/componentService/admin/service';
import {getAuction} from '../../javascripts/componentService/common/service';
import {getAuctionTimeRule} from '../../javascripts/componentService/common/service';
import moment from 'moment';
const ACTUAL_END_TIME = 'actual_end_time';
const ACTUAL_CURRENT_TIME = 'current_time';
const HOLD_STATUS = 'hold_status';
export class OnlineStatusMain extends Component {
    constructor(props, context){
        super(props);
        this.state={
            id:"",
            dataList:[],
            data_online:[],
            data_pedding:[],
            data_outline:[],
            holdStatus:false
        }
        this.auction = {};
        this.holdStatus = false;
    }
    componentDidMount(){
        let timeinterval
        clearInterval(timeinterval);
        timeinterval = setInterval(()=>{
            this.timegetBidderStatus();
        },5000)
    }
    timegetBidderStatus(){
        getBidderStatus({auction_id:this.auction.id}).then(res => {
            this.setState({
                dataList:res,
            })
            let data_outline=[],data_online=[],data_pedding=[];
                this.state.dataList.map((item,index)=>{
                    if(item.login_status == "logout"){
                        data_outline.push(item);
                    }else if(item.login_status == "login"){
                        if(item.current_room == this.auction.id){
                            if(item.current_page == "live"){
                                data_online.push(item);
                            }else{
                                data_pedding.push(item);
                            }                           
                        }else{
                            data_pedding.push(item);
                        }                           
                    }else{
                        data_outline.push(item);
                    }
                })
            
            this.setState({
                data_online:data_online,
                data_outline:data_outline,
                data_pedding:data_pedding,
            })
        }, error => {
        })
    }
    componentWillMount(){
        getAuction('admin',sessionStorage.auction_id).then(res => {
            this.auction = res;
            this.timerTitle = this.auction ? `${this.auction.name} on ${moment(this.auction.start_datetime).format('D MMM YYYY, h:mm a')}` : '';
            getAuctionTimeRule(this.auction.id).then(status => {
                //console.log(status[HOLD_STATUS]);
                this.setState({
                    holdStatus:status[HOLD_STATUS]
                })
            })
            this.timegetBidderStatus();
        }, error => {
        })
    }
    goToDashboard(){
        window.location.href=`/admin/auctions/${this.auction.id}/dashboard`
    }
    hold(type,obj) {//this.holdStatus = !this.holdStatus;
        this.setState({
            holdStatus:type
        })
        upateHoldStatus(this.auction ? this.auction.id : 1, type);
    }

    render (){
        return (
            <div className="onlineStatusMain">
                <TimeCuntDown title={this.timerTitle} auction={this.auction} countDownOver={this.goToDashboard.bind(this)} />
                <div className="u-grid u-mt3">
                    <div className="col-sm-12 col-md-10 push-md-1">
                    <h3 className="col-sm-12 col-md-12 u-mb3">Online Status of Retailers</h3>
                    <div className="u-grid u-mt2">
                        <div className="col-sm-12 col-md-4 u-cell">
                            <RetailsOnlineStatus list_data={this.state.data_online} onlineStatus="on" />
                        </div>
                        <div className="col-sm-12 col-md-4 u-cell">
                            <RetailsOnlineStatus list_data={this.state.data_pedding} onlineStatus="other" />
                        </div>
                        <div className="col-sm-12 col-md-4 u-cell">
                            <RetailsOnlineStatus list_data={this.state.data_outline} onlineStatus="off" />
                        </div>
                    </div>
                    </div>
                    <div className="col-sm-12 col-md-10 push-md-1 u-mt3">
                        <div className="col-sm-12 col-md-5">
                            <ul className="ros_tab">
                                <li className="on">Retailer has logged in and is located in the 'start bidding' page</li>
                                <li className="other">Retailer has logged in but not located in the 'start bidding' page</li>
                                <li className="off">Retailer has logout</li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-10 push-md-1 u-mt3">
                        {!this.state.holdStatus ? <button className="endHold fright" onClick={this.hold.bind(this,true)}>Stop</button>
                                               : <button className="startHold fright" onClick={this.hold.bind(this,false)}>Hold</button>}
                    </div>
                </div>
                <div className="createRaMain u-grid">
            <a className="lm--button lm--button--primary u-mt3" href="/admin/home" >Back to Homepage</a>
            </div>
            </div>
        )}
    }

    function run() {
        const domNode = document.getElementById('OnlineStatusMain');
        if(domNode !== null){
            ReactDOM.render(
                React.createElement(OnlineStatusMain),
                domNode
            );
        }
    }
    
    const loadedStates = [
        'complete',
        'loaded',
        'interactive'
    ];
    if (loadedStates.indexOf(document.readyState) > -1 && document.body) {
        run();
    } else {
        window.addEventListener('DOMContentLoaded', run, false);
    }