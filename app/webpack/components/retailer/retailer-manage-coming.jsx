import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom';
import {TimeCuntDown} from '../shared/time-cuntdown';
//import {DuringCountDown} from '../shared/during-countdown';
import {createRa,getAuctionInVersionOne,getRetailerAuctionInVersionOne,retailManageComing} from '../../javascripts/componentService/admin/service';
import {Modal} from '../shared/show-modal';
import {getLoginUserId} from '../../javascripts/componentService/util';
import moment from 'moment';

export class RetailerManage extends Component {
    constructor(props){
        super(props);
        this.state={
            id:"",
            text:"",
            type:"",live_modal:"",live_modal_do:"",
            btn_status:false,
            disabled:false,
            havedata:false,
            allbtnStatus:true
        }
        this.auctionData = {};
    }
    componentWillMount(){
        getAuctionInVersionOne().then(res=>{
            this.auction = res;
            this.timerTitle = res ? `${res.name} on ${moment(res.start_datetime).format('D MMM YYYY, h:mm a')}` : '';
            if(res.publish_status == 1){
                this.setState({
                    live_modal:"live_hide",
                    live_modal_do:"live_show"
                })
            }else{
                this.setState({
                    live_modal:"live_show",
                    live_modal_do:"live_hide"
                })
            }
        }, error => {
            console.log(error);
        })
    }
    componentDidMount() {
        this.getRetailerAuction();
    }
    getRetailerAuction(){
        let auction_id = window.location.href.split("auctions/")[1];
        auction_id = auction_id.split("/upcoming")[0];
        let user_id = getLoginUserId();
        getRetailerAuctionInVersionOne({ auction_id: auction_id, user_id: user_id}).then(res => {
            //console.log(res);
            if(res.main_name && res.main_email_address && res.main_mobile_number && res.main_office_number){
                this.setState({
                    disabled:true,
                    havedata:true
                })
            }else{
                this.setState({
                    disabled:false,
                    havedata:false
                })
            }
            this.auctionData = res;
            this.setState({id:res.id})
            this.refs.main_name.value = res.main_name;
            this.refs.main_email_address.value = res.main_email_address;
            this.refs.main_mobile_number.value = res.main_mobile_number;
            this.refs.main_office_number.value = res.main_office_number;
            this.refs.alternative_name.value = res.alternative_name;
            this.refs.alternative_email_address.value = res.alternative_email_address;
            this.refs.alternative_mobile_number.value = res.alternative_mobile_number;
            this.refs.alternative_office_number.value = res.alternative_office_number;
            //this.refs.lt_peak.value = res.lt_peak == null ? '' : this.padZero(res.lt_peak,4).toString().split('.')[1];
            //this.refs.lt_off_peak.value = res.lt_off_peak == null ? '' : this.padZero(res.lt_off_peak,4).toString().split('.')[1];
            //this.refs.hts_peak.value = res.hts_peak == null ? '' : this.padZero(res.hts_peak,4).toString().split('.')[1];
            //this.refs.hts_off_peak.value = res.hts_off_peak == null ? '' : this.padZero(res.hts_off_peak,4).toString().split('.')[1];
            //this.refs.htl_peak.value = res.htl_peak == null ? '' : this.padZero(res.htl_peak,4).toString().split('.')[1];
            //this.refs.htl_off_peak.value = res.htl_off_peak == null ? '' : this.padZero(res.htl_off_peak,4).toString().split('.')[1];
        }, error => {
            console.log(error);
        })
    }
    padZero(num, n) { 
        let len = num.toString().split('.')[1].length; 
        while(len < n) { 
        num = num+"0"; 
        len++; 
        } 
        return num; 
    } 
    btnStatus(){
        this.setState({
            btn_status:true,
            disabled:false
        })
    }
    cancel(){
        this.getRetailerAuction();
        this.setState({
            btn_status:false,
            disabled:true
        })
    }
    checkSuccess(event,obj){
        event.preventDefault();
        retailManageComing({
            arrangement: {
                "id": this.state.id,
                "main_name": this.refs.main_name.value,
                "main_email_address": this.refs.main_email_address.value,
                "main_mobile_number": this.refs.main_mobile_number.value,
                "main_office_number": this.refs.main_office_number.value,
                "alternative_name": this.refs.alternative_name.value,
                "alternative_email_address": this.refs.alternative_email_address.value,
                "alternative_mobile_number": this.refs.alternative_mobile_number.value,
                "alternative_office_number": this.refs.alternative_office_number.value,
                "lt_peak": 0.1458,//+this.refs.lt_peak.value
                "lt_off_peak": 0.1458,//+this.refs.lt_off_peak.value
                "hts_peak":0,//+this.refs.hts_peak.value
                "hts_off_peak": 0,//+this.refs.hts_off_peak.value
                "htl_peak": 0.1458,//+this.refs.htl_peak.value
                "htl_off_peak": 0.1458,//+this.refs.htl_off_peak.value
                "accept_status": "1"   // '0':reject '1':accept '2':pending
            }
        }).then(res => {
                this.refs.Modal.showModal();
                this.setState({
                    text:"Your details have been successfully submitted. You may click on 'Start Bidding' in homepage to standby for the live reverse auction."
                });
                this.getRetailerAuction();
                this.setState({
                    btn_status:false,
                    disabled:true
                })
                // setTimeout(() => {
                //     window.location.href="/retailer/home"
                // },3000);
            }, error => {
                console.log(error);
            })
    }
    render () {
        let btn_html ='';
        !this.state.havedata ? btn_html = <button className="lm--button lm--button--primary" >Submit</button> 
        : btn_html = !this.state.btn_status ? <a className="lm--button lm--button--primary" onClick={this.btnStatus.bind(this)}>Edit</a> 
                       :<div><button className="lm--button lm--button--primary" >Submit</button>
                        <a className="lm--button lm--button--primary" onClick={this.cancel.bind(this)}>Cancel</a>
                        </div>;       
        return (
            <div>
            <div id="live_modal" className={this.state.live_modal}>
                <div className={this.state.holdOrend}></div>
                <p>
                There is no upcoming reverse auction published.
                </p>
            </div>
            <div className={this.state.live_modal_do}>
            <TimeCuntDown  title={this.timerTitle} auction={this.auction} countDownOver={()=>{this.setState({disabled:true,allbtnStatus:false})}}/>
            {/* <DuringCountDown /> */}
            <form onSubmit={this.checkSuccess.bind(this)}>
            <div className="u-grid">
                <div className="col-sm-12 col-md-6 push-md-3">
                    {/* <h3 className="u-mt3 u-mb1">Section A: Information on Reverse Auction</h3>
                    <div className="lm--formItem lm--formItem--inline string">
                        <label className="lm--formItem-left lm--formItem-label string required">
                            Specifications:
                        </label>
                        <div className="lm--formItem-right lm--formItem-control">
                            <span className="string required link_file">xxx.pdf</span>
                        </div>
                    </div>
                    <div className="lm--formItem lm--formItem--inline string">
                        <label className="lm--formItem-left lm--formItem-label string required">
                            Briefing Pack:
                        </label>
                        <div className="lm--formItem-right lm--formItem-control">
                            <span className="string required link_file">xxx.pdf</span>
                        </div>
                    </div> */}
                    <h3 className="u-mt3 u-mb1">Contact Person Details for Actual Day of Reverse Auction</h3>
                    <h4 className="lm--formItem lm--formItem--inline string">Main Contact Person on Actual Bidding Day:</h4>
                    <div className="lm--formItem lm--formItem--inline string">
                        <label className="lm--formItem-left lm--formItem-label string required">
                        <abbr title="required">*</abbr> Name:
                        </label>
                        <div className="lm--formItem-right lm--formItem-control">
                            <input type="text" name="main_name" disabled={this.state.disabled} ref="main_name" maxLength="150" required aria-required="true" title="The length must not be longer than 150 characters."></input>
                        </div>
                    </div>
                    <div className="lm--formItem lm--formItem--inline string">
                        <label className="lm--formItem-left lm--formItem-label string required">
                        <abbr title="required">*</abbr> Email Address:
                        </label>
                        <div className="lm--formItem-right lm--formItem-control">
                            <input type="text" name="main_email_address" disabled={this.state.disabled} ref="main_email_address" maxLength="50" required aria-required="true" pattern="\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*" title="Email address should be in the format name@example.com."></input>
                        </div>
                    </div>
                    <div className="lm--formItem lm--formItem--inline string">
                        <label className="lm--formItem-left lm--formItem-label string required">
                        <abbr title="required">*</abbr> Mobile Number: (+65)
                        </label>
                        <div className="lm--formItem-right lm--formItem-control">
                            <input type="text" name="main_mobile_number" disabled={this.state.disabled} ref="main_mobile_number" maxLength="50" required aria-required="true" pattern="^(\d{8})$" title="Contact Number should contain 8 integers."></input>
                        </div>
                    </div>
                    <div className="lm--formItem lm--formItem--inline string">
                        <label className="lm--formItem-left lm--formItem-label string required">
                        <abbr title="required">*</abbr> Office Number: (+65)
                        </label>
                        <div className="lm--formItem-right lm--formItem-control">
                            <input type="text" name="main_office_number" disabled={this.state.disabled} ref="main_office_number" maxLength="50" required aria-required="true" pattern="^(\d{8})$" title="Contact Number should contain 8 integers."></input>
                        </div>
                    </div>
                    <h4 className="lm--formItem lm--formItem--inline string">Alternative Contact Person on Actual Bidding Day:</h4>
                    <div className="lm--formItem lm--formItem--inline string">
                        <label className="lm--formItem-left lm--formItem-label string required">
                        Name:
                        </label>
                        <div className="lm--formItem-right lm--formItem-control">
                            <input type="text" name="alternative_name" disabled={this.state.disabled} ref="alternative_name" maxLength="150" title="The length must not be longer than 150 characters."></input>
                        </div>
                    </div>
                    <div className="lm--formItem lm--formItem--inline string">
                        <label className="lm--formItem-left lm--formItem-label string required">
                        Email Address:
                        </label>
                        <div className="lm--formItem-right lm--formItem-control">
                            <input type="text" name="alternative_email_address" disabled={this.state.disabled} ref="alternative_email_address" aria-required="true" pattern="\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*" maxLength="50" title="Email address should be in the format name@example.com."></input>
                        </div>
                    </div>
                    <div className="lm--formItem lm--formItem--inline string">
                        <label className="lm--formItem-left lm--formItem-label string required">
                        Mobile Number: (+65)
                        </label>
                        <div className="lm--formItem-right lm--formItem-control">
                            <input type="text" name="alternative_mobile_number" disabled={this.state.disabled} ref="alternative_mobile_number" maxLength="50" aria-required="true" pattern="^(\d{8})$" title="Contact Number should contain 8 integers."></input>
                        </div>
                    </div>
                    <div className="lm--formItem lm--formItem--inline string">
                        <label className="lm--formItem-left lm--formItem-label string required">
                        Office Number: (+65)
                        </label>
                        <div className="lm--formItem-right lm--formItem-control">
                            <input type="text" name="alternative_office_number" disabled={this.state.disabled} ref="alternative_office_number" maxLength="50" aria-required="true" pattern="^(\d{8})$" title="Contact Number should contain 8 integers."></input>
                        </div>
                    </div>
                    {/* <h3 className="u-mt3 u-mb1"><abbr title="required">*</abbr>Section C: Starting Bid Price</h3>
                    <h4 className="u-mt1 u-mb1 font13">Important: Please note that this will be your starting bid price for the reverse auction. Your price submission during the live reverse auction must be lower than your starting bid price.</h4>
                    <div className="lm--formItem lm--formItem--inline string">
                        <table className="retailer_fill" cellPadding="0" cellSpacing="0">
                            <thead>
                                <tr><th></th><th>LT</th><th>HT (Small)</th><th>HT (Large)</th></tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Peak (7am-7pm)</td>
                                    <td>$ 0.<input type="tel" disabled={this.state.disabled} maxLength="4" className="col" name="lt_peak" ref="lt_peak" required  aria-required="true" pattern="^\d{4}$" title="Price must be a number with 4 decimal places, e.g. $0.0891/kWh."></input>
                                    </td>
                                    <td>$ 0.<input type="tel" disabled={this.state.disabled} maxLength="4" name="hts_peak" ref="hts_peak" required  aria-required="true" pattern="^\d{4}$" title="Price must be a number with 4 decimal places, e.g. $0.0891/kWh."></input>
                                    </td>
                                    <td>$ 0.<input type="tel" disabled={this.state.disabled} maxLength="4" name="htl_peak" ref="htl_peak" required  aria-required="true" pattern="^\d{4}$" title="Price must be a number with 4 decimal places, e.g. $0.0891/kWh."></input>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Off-Peak (7pm-7am)</td>
                                    <td>$ 0.<input type="tel" disabled={this.state.disabled} maxLength="4" name="lt_off_peak" ref="lt_off_peak" required aria-required="true" pattern="^\d{4}$" title="Price must be a number with 4 decimal places, e.g. $0.0891/kWh."></input>
                                    </td>
                                    <td>$ 0.<input type="tel" disabled={this.state.disabled} maxLength="4" name="hts_off_peak" ref="hts_off_peak" required  aria-required="true" pattern="^\d{4}$" title="Price must be a number with 4 decimal places, e.g. $0.0891/kWh."></input>
                                    </td> 
                                    <td>$ 0.<input type="tel" disabled={this.state.disabled} maxLength="4" name="htl_off_peak" ref="htl_off_peak" required  aria-required="true" pattern="^\d{4}$" title="Price must be a number with 4 decimal places, e.g. $0.0891/kWh."></input>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div> */}
                    <div className="retailer_btn">
                        {!this.state.allbtnStatus ? <div className="mask"></div> : ''}
                        {/* <button className="lm--button lm--button--primary">Reject Participation</button> */}                       
                        {btn_html}
                    </div>
                </div>
            </div>
            </form>
            <Modal text={this.state.text} ref="Modal" />
            </div>
            <div className="createRaMain u-grid">
            <a className="lm--button lm--button--primary u-mt3" href="/retailer/home" >Back to Homepage</a>
            </div>
            </div>
        )
    }
}






function runs() {
    const domNode = document.getElementById('retailerManage');
    if(domNode !== null){
        ReactDOM.render(
            React.createElement(RetailerManage),
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
    runs();
} else {
    window.addEventListener('DOMContentLoaded', runs, false);
}