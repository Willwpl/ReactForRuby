import React, {Component} from 'react';
import {getAuctionTimeRule} from '../../javascripts/componentService/common/service';
import moment from 'moment';


const ACTUAL_BEGIN_TIME = 'actual_begin_time';
const ACTUAL_CURRENT_TIME = 'current_time';
const HOLD_STATUS = 'hold_status';

export class TimeCuntDown extends Component {
    constructor(props) {
        super(props);
        this.state = {day: 0, hour: 0, minute: 0, second: 0}
    }

    componentDidMount() {
        //test
        // setTimeout(() => {
        //     clearInterval(this.interval);
        //     setTimeout(() => {
        //         if (this.props.countDownOver) {
        //             this.props.countDownOver();
        //         }
        //     }, 1000)
        // }, 2000)
    }

    componentWillReceiveProps(nextProps) {
        this.getAuctionTime(nextProps.auction);
        if (this.interval) {
            clearInterval(this.interval);
        }
        this.interval = setInterval(() => {
            this.getAuctionTime(nextProps.auction);
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    getAuctionTime(auction) {
        if (auction) {
            getAuctionTimeRule(auction.id).then(res => {
                //console.log('pre start time ==>', moment(res[ACTUAL_BEGIN_TIME]).format('YYYY-MM-DD hh:mm:ss'))
                //console.log('pre now time ==>', moment(res[ACTUAL_CURRENT_TIME]).format('YYYY-MM-DD hh:mm:ss'))
                //console.log(res[HOLD_STATUS]);
                //this.timerTitle = res ? `${res.name} on ${moment(res.start_datetime).toDate().getTime().format('D MMM YYYY, h:mm a')}` : '';
                let isOver = this.isCountDownOver(moment(res[ACTUAL_BEGIN_TIME]).toDate().getTime()
                    , moment(res[ACTUAL_CURRENT_TIME]).toDate().getTime());
                if (this.props.listenHold) {
                    this.props.listenHold(res[HOLD_STATUS],isOver);
                }
                if (isOver) {
                    if (!res[HOLD_STATUS]) {
                        clearInterval(this.interval);
                        if (this.props.countDownOver) {
                            this.props.countDownOver();
                        }
                    }else{
                        this.setState({day: 0, hour: 0, minute: 0, second: 0});
                    }
                }
            }, error => {
                console.log('whoops dam it')
            })
        }
    }

    isCountDownOver(startSeq, nowSeq) {
        let divider = parseInt((startSeq - nowSeq) / 1000);
        let day = Math.floor(divider / (60 * 60 * 24));
        let hour = Math.floor((divider - day * 24 * 60 * 60) / 3600);
        let minute = Math.floor((divider - day * 24 * 60 * 60 - hour * 3600) / 60);
        let second = Math.floor(divider - day * 24 * 60 * 60 - hour * 3600 - minute * 60);
        let left = day || hour || minute || second;
        this.setState({day: day, hour: hour, minute: minute, second: second});
        if (left <= 0) {
            return true;
        }
        return false;
    }

    render() {
        return (
            <div className="time_cuntdown">
                <p>{this.props.title}</p>
                <div className="Countdown"><abbr>Countdown Timer:</abbr>
                    <ol id="countdown_timer">
                        <span><font>{this.state.day}</font>DAYS</span>
                        <span><font>{this.state.hour}</font>HOURS</span>
                        <span><font>{this.state.minute}</font>MINUTES</span>
                        <span><font>{this.state.second}</font>SECONDS</span>
                    </ol>
                    {
                        this.props.children
                    }
                </div>
            </div>
        )
    }
}

TimeCuntDown.defaultProps = {
    title:'SP Reverse Auction'
}