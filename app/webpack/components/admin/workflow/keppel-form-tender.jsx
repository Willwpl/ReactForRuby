import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Modal} from '../../shared/show-modal';
import {arrangementDetail,adminReject,adminAccept} from '../../../javascripts/componentService/admin/service';
export class Keppelformtender extends React.Component{
    constructor(props){
        super(props);
        this.state={
            text:'',buttonType:''
        }
    }
    componentDidMount() {
        
    }
    showConfirm(type){
        this.setState({buttonType:type});
        if(type == "Reject"){
            this.refs.Modal.showModal("comfirm");
            this.setState({
                text:"Are you sure want to reject?"
            });
        }else{
            this.refs.Modal.showModal("comfirm");
            this.setState({
                text:"Are you sure want to accept?"
            });
        }
    }
    admin_reject(){
        adminReject(this.props.current.current.arrangement_id).then(res=>{
            //this.props.page(this.props.current.current.arrangement_id);
            window.location.href="/admin/auctions/"+sessionStorage.auction_id+"/retailer_dashboard";
        })
    }
    admin_accept(){
        adminAccept(this.props.current.current.arrangement_id).then(res=>{
            //this.props.page(this.props.current.current.arrangement_id);
            window.location.href="/admin/auctions/"+sessionStorage.auction_id+"/retailer_dashboard";
        })
    }
    render(){
        return(
            <div className="col-sm-12 col-md-10 push-md-1 u-mt3 tender_documents">
                <h2 className="u-mt3 u-mb3">{this.props.title}</h2>
                <div className="lm--formItem lm--formItem--inline string u-mt3 role_select">
                    <label className="lm--formItem-left lm--formItem-label string required">
                    Please see attached tender documents:
                    </label>
                    <div className="lm--formItem-right lm--formItem-control">
                        <ul className="tender_list">
                            {this.props.linklist ? this.props.linklist.map((item,index)=>{
                                return <li key={index}>item {index+1} : <a href={item.file_path}>{item.file_name}</a></li>
                            }) : ''}
                        </ul>
                    </div>
                </div>
                <div className="lm--formItem lm--formItem--inline string u-mt3 role_select">
                    <label className="lm--formItem-left lm--formItem-label string required">
                    Deviation:
                    </label>
                    <div className="lm--formItem-right lm--formItem-control propose_deviations">
                        <table className="retailer_fill w_100" cellPadding="0" cellSpacing="0">
                            <thead>
                            <tr>
                                <th>Item</th>
                                <th>Clause</th>
                                <th>Proposs Deviation</th>
                                <th>Retailer Response</th>
                                <th>SP Response</th>
                                <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td >5.1</td>
                                    <td >xxxxxxxxxxx</td>
                                    <td >xxxxxxxxxxxxxxxxxxxx</td>
                                    <td >Accepted : this item should change to 10%</td>
                                    <td><button>History</button></td>
                                </tr>
                                <tr>
                                    <td>1</td>
                                    <td >5.1</td>
                                    <td >xxxxxxxxxxx</td>
                                    <td >xxxxxxxxxxxxxxxxxxxx</td>
                                    <td >Accepted : this item should change to 10%</td>
                                    <td><button>History</button></td>
                                </tr>
                            </tbody>
                    </table>
                    </div>
                </div>
                <div className="lm--formItem lm--formItem--inline string u-mt3 role_select">
                    <label className="lm--formItem-left lm--formItem-label string required">
                    Comment:
                    </label>
                    <div className="lm--formItem-right lm--formItem-control">
                        <textarea></textarea>
                    </div>
                </div>
                <div className="workflow_btn u-mt3">
                        <button className="lm--button lm--button--primary" onClick={this.showConfirm.bind(this,'Reject')}>Reject</button>
                        <button className="lm--button lm--button--primary" onClick={this.showConfirm.bind(this,'Accept')}>Accept</button>
                </div>
                <Modal text={this.state.text} acceptFunction={this.state.buttonType === 'Reject'?this.admin_reject.bind(this):this.admin_accept.bind(this)} ref="Modal" />
            </div>
        )
    }
}
