import React, { Component } from 'react';
import moment from 'moment';
export default class WinnerPrice extends Component {
  constructor(props){
    super(props);
    this.state={
        status:{
            showOrhide:"hide",
            showStatus:"Awarded",
            statusColor:"green"
        }
    }
}
  padZero(num, n) { 
    if(num){
      let len = num.split('.')[1].length; 
      while(len < n) { 
      num = num+"0"; 
      len++; 
      } 
      return num; 
    }
  } 
  toThousands(k) {
    let num = k.toString(), result = '',node ='';
    if(num.indexOf('.')>0){
      node = '.'+num.split('.')[1];
      num = num.split('.')[0];
    }
    while (num.length > 3) {
        result = ',' + num.slice(-3) + result;
        num = num.slice(0, num.length - 3);
    }
    if (num) { result = num + result; }
    return result+node;
  }
  render() {
    //console.log(this.props.winner);
    return this.props.winner.data ? (
      this.props.winner.data.status ?
                    <div className="winnerPrice_main">
                              <h2 className={this.props.showOrhide}>{this.props.winner.data.status === 'win' ? <span className="green">Status : Awarded</span> : <span className="red">Status : Void</span> }</h2>
                              <h4 className="u-mt1">Summary of Lowest Bidder</h4>
                              <ul>
                                <li><span>Lowest Price Bidder: </span><span>{this.props.winner.data.lowest_price_bidder}</span></li>
                                <li><span>Lowest Average Price: </span><span>$ {Number(this.props.winner.data.lowest_average_price).toFixed(4)}/kWh</span></li>
                              </ul>
                              <table className="retailer_fill" cellPadding="0" cellSpacing="0">
                                  <thead>
                                  <tr>
                                      <th></th>
                                      <th>LT</th>
                                      <th className="live_hide">HT (Small)</th>
                                      <th>HT (Large)</th>
                                      </tr>
                                  </thead>
                                  <tbody>
                                      <tr><td>Peak (7am-7pm)</td><td>$ {this.padZero(this.props.winner.data.lt_peak,4)}</td><td className="live_hide">$ {this.padZero(this.props.winner.data.hts_peak,4)}</td><td>$ {this.padZero(this.props.winner.data.htl_peak,4)}</td></tr>
                                      <tr><td>Off-Peak (7pm-7am)</td><td>$ {this.padZero(this.props.winner.data.lt_off_peak,4)}</td><td className="live_hide">$ {this.padZero(this.props.winner.data.hts_off_peak,4)}</td><td>$ {this.padZero(this.props.winner.data.htl_off_peak,4)}</td></tr>
                                  </tbody>
                            </table>
                              <ul>
                                <li><span>Contract Period: </span><span>{moment(this.props.winner.auction.contract_period_start_date).format('D MMM YYYY')} to {moment(this.props.winner.auction.contract_period_end_date).format('D MMM YYYY')}</span></li>
                                <li><span>Total Volume: </span><span>{this.toThousands(parseInt(this.props.winner.auction.total_volume))} kWh (forecasted)</span></li>
                                <li><span>Total Award Sum: </span><span>$ {this.toThousands(Number(this.props.winner.data.total_award_sum).toFixed(2))} (forecasted)</span></li>
                                </ul>
                            </div>
                  : <div className="winnerPrice_main">
                      <h2 className={this.props.showOrhide}>{this.props.winner.data.is_bidder ? <span className="green">Status : Awarded</span> : <span className="red">Status :Not Awarded</span>}</h2>
                      <h4 className="u-mt1">Summary of Lowest Bidder</h4>
                      <ul>
                        <li><span>Lowest Price Bidder: </span><span>{this.props.winner.data.company_name}</span></li>
                        <li><span>Lowest Average Price: </span><span>$ {Number(this.props.winner.data.average_price).toFixed(4)}/kWh</span></li>
                      </ul>
                      <table className="retailer_fill" cellPadding="0" cellSpacing="0">
                          <thead>
                          <tr>
                              <th></th>
                              <th>LT</th>
                              <th className="live_hide">HT (Small)</th>
                              <th>HT (Large)</th>
                              </tr>
                          </thead>
                          <tbody>
                              <tr><td>Peak (7am-7pm)</td><td>$ {this.padZero(this.props.winner.data.lt_peak,4)}</td><td className="live_hide">$ {this.padZero(this.props.winner.data.hts_peak,4)}</td><td>$ {this.padZero(this.props.winner.data.htl_peak,4)}</td></tr>
                              <tr><td>Off-Peak (7pm-7am)</td><td>$ {this.padZero(this.props.winner.data.lt_off_peak,4)}</td><td className="live_hide">$ {this.padZero(this.props.winner.data.hts_off_peak,4)}</td><td>$ {this.padZero(this.props.winner.data.htl_off_peak,4)}</td></tr>
                          </tbody>
                    </table>
                      <ul>
                        <li><span>Contract Period: </span><span>{moment(this.props.winner.auction.contract_period_start_date).format('D MMM YYYY')} to {moment(this.props.winner.auction.contract_period_end_date).format('D MMM YYYY')}</span></li>
                        <li><span>Total Volume: </span><span>{this.toThousands(parseInt(this.props.winner.auction.total_volume))} kWh (forecasted)</span></li>
                        <li><span>Total Award Sum: </span><span>$ {this.toThousands(Number(this.props.winner.data.total_award_sum).toFixed(2))} (forecasted)</span></li>
                        </ul>
                    </div>                       
    ):(
      <div className="winnerPrice_main">no data</div>
    )
  }
}