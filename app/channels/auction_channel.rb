class AuctionChannel < ApplicationCable::Channel
  def subscribed
    # stream_from "some_channel"
    stream_from "auction_#{params[:auction_id]}"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
    update_check_params('off')
  end

  def check_in
    update_check_params('on-live')
    ActionCable.server.broadcast "auction_#{params[:auction_id]}"
  end

  def extend_time(data)
    auction = Auction.find(params[:auction_id])
    extend_time = data['extend_time'].to_i
    auction_extend_time = AuctionExtendTime.new
    auction_extend_time.extend_time = extend_time
    auction_extend_time.current_time = Time.now
    auction_extend_time.actual_begin_time = auction.actual_begin_time
    auction_extend_time.actual_end_time = auction.actual_end_time + 60 * extend_time
    auction_extend_time.auction_id = params[:auction_id]
    auction_extend_time.user_id = params[:user_id]
    if auction_extend_time.save
      if auction.update(actual_end_time: auction_extend_time.actual_end_time)
        ActionCable.server.broadcast "auction_#{params[:auction_id]}", {action:'extend' , data:{minutes: extend_time}}
      end
    end

  end

  def set_bid(data)
    auction = Auction.find(params[:auction_id])
    # (auction.total_lt_peak,auction.total_lt_off_peak,auction.total_hts_peak, auction.total_hts_off_peak,auction.total_htl_peak,auction.total_htl_off_peak,
    #                                  data['lt_peak'] ,data['lt_off_peak'],data['hts_peak'],data['hts_off_peak'], data['htl_peak'], data['htl_off_peak'], params[:auction_id], params[:user_id])
    calculate_dto = CalculateDto.new
    calculate_dto.total_lt_peak = auction.total_lt_peak
    calculate_dto.total_lt_off_peak = auction.total_lt_off_peak
    calculate_dto.total_hts_peak = auction.total_hts_peak
    calculate_dto.total_hts_off_peak = auction.total_hts_off_peak
    calculate_dto.total_htl_peak = auction.total_htl_peak
    calculate_dto.total_htl_off_peak = auction.total_htl_off_peak
    calculate_dto.lt_peak = data['lt_peak']
    calculate_dto.lt_off_peak = data['lt_off_peak']
    calculate_dto.hts_peak = data['hts_peak']
    calculate_dto.hts_off_peak = data['hts_off_peak']
    calculate_dto.htl_peak = data['htl_peak']
    calculate_dto.htl_off_peak = data['htl_off_peak']
    calculate_dto.user_id = params[:user_id]
    calculate_dto.auction_id = params[:auction_id]
    ActionCable.server.broadcast "auction_#{params[:auction_id]}", {data: set_price(calculate_dto), action: 'set_bid'}
  end

  private

  def update_check_params(login_status)
    # @arrangement = Arrangement.where('auction_id = :auction_id and user_id = :user_id', auction_id: params[:auction_id], user_id: params[:user_id])
    # @arrangement.update(login_status: login_status)
  end

  def set_price(calculate_dto)
    total_award_sum = AuctionHistory.set_total_award_sum(calculate_dto.total_lt_peak,calculate_dto.total_lt_off_peak,
                                                         calculate_dto.total_hts_peak,calculate_dto.total_hts_off_peak,
                                                         calculate_dto.total_htl_peak, calculate_dto.total_htl_off_peak,
                                                         calculate_dto.lt_peak,calculate_dto.lt_off_peak,
                                                         calculate_dto.hts_peak,calculate_dto.hts_off_peak,
                                                         calculate_dto.htl_peak,calculate_dto.htl_off_peak)
    total_volume = Auction.set_total_volume(
        calculate_dto.total_lt_peak,calculate_dto.total_lt_off_peak,
        calculate_dto.total_hts_peak,calculate_dto.total_hts_off_peak,
        calculate_dto.total_htl_peak, calculate_dto.total_htl_off_peak)

    average_price = AuctionHistory.set_average_price(total_award_sum, total_volume)

    @history = AuctionHistory.new(lt_peak: calculate_dto.lt_peak, lt_off_peak: calculate_dto.lt_off_peak, hts_peak: calculate_dto.hts_peak, hts_off_peak: calculate_dto.hts_off_peak, htl_peak: calculate_dto.htl_peak, htl_off_peak: calculate_dto.htl_off_peak, bid_time: Time.now,
                                  user_id: calculate_dto.user_id, auction_id: calculate_dto.auction_id, average_price: average_price, total_award_sum: total_award_sum, is_bidder: true)
    if @history.save
      # update update sort
      @histories = AuctionHistory.find_clone_sort_update_auction_histories(params[:auction_id], @history.id)

    end
    # @histories = AuctionHistory.find_clone_sort_update_auction_histories(params[:auction_id])
    # return @histories
  end
end
