class Retailer::AuctionsController < Retailer::BaseController
  after_action :set_login_status, only: %i[upcoming live finish empty]
  # GET upcoming page
  def upcoming; end

  # GET live page
  def live; end

  # GET finish page
  def finish; end

  def empty
    @auction = Auction.first
    arrangement = Arrangement.find_by_user_id(current_user.id)
    auction_name = @auction.name
    progress_message = "#{auction_name} is currently in progress. Please click on 'Start Bidding' button located in homepage to participate."
    empty_message = 'There is no upcoming reverse auction published.'
    if @auction.publish_status != '1'
      @message = empty_message
    else
      if arrangement.accept_status != '1'
        if @auction.actual_begin_time < Time.current
          @message = 'We regret to inform that you are unable to participate as you have not submitted the necessary contact person details. We hope to see you again in future reverse auctions.'
        end
      else
        if @auction.actual_begin_time < Time.current && Time.current < @auction.actual_end_time
          @message = progress_message
        elsif @auction.auction_result.nil? && Time.current > @auction.actual_end_time
          @message = progress_message
        elsif !@auction.auction_result.nil?
          @message = empty_message
        end
      end
    end
  end

  def goto
    @auction = Auction.first
    arrangement = Arrangement.find_by_user_id(current_user.id)
    if @auction.publish_status != '1'
      redirect_to empty_retailer_auctions_path
    else
      if arrangement.accept_status != '1'
        if @auction.actual_begin_time < Time.current # auction started
          redirect_to empty_retailer_auctions_path
          #   We regret to inform that you are unable to participate as you have not submitted the necessary contact person details. We hpe to see you again in future reverse auctions.
        elsif Time.current < @auction.actual_begin_time
          redirect_to upcoming_retailer_auction_path(@auction.id)
        end
      else
        if Time.current < @auction.actual_begin_time
          redirect_to upcoming_retailer_auction_path(@auction.id)
        elsif @auction.actual_begin_time < Time.current && Time.current < @auction.actual_end_time
          redirect_to empty_retailer_auctions_path
        elsif @auction.auction_result.nil? && Time.current > @auction.actual_end_time
          redirect_to empty_retailer_auctions_path
        elsif !@auction.auction_result.nil?
          redirect_to empty_retailer_auctions_path
        end
      end
    end
  end

  def gotobid
    @auction = Auction.first
    arrangement = Arrangement.find_by_user_id(current_user.id)
    if @auction.publish_status != '1'
      redirect_to message_retailer_auctions_path
      # There is no upcoming reverse auction published.
    else
      if arrangement.accept_status != '1'
        if @auction.actual_begin_time < Time.current
          redirect_to message_retailer_auctions_path
          # We regret to inform that you are unable to participate as you have not submitted the necessary contact person details. We hpe to see you again in future reverse auctions.
        elsif Time.current < @auction.actual_begin_time
          redirect_to message_retailer_auctions_path
          # Please complete the necessary details under 'Manage Upcoming Reverse Auction' located in homepage.
        end
      else
        if Time.current < @auction.actual_begin_time
          redirect_to live_retailer_auction_path(@auction.id)
          # stand by page
        elsif @auction.actual_begin_time < Time.current && Time.current < @auction.actual_end_time
          redirect_to live_retailer_auction_path(@auction.id)
        elsif @auction.auction_result.nil? && Time.current > @auction.actual_end_time && @auction.hold_status
          redirect_to live_retailer_auction_path(@auction.id)
        elsif @auction.auction_result.nil? && Time.current > @auction.actual_end_time && !@auction.hold_status
          redirect_to finish_retailer_auction_path(@auction.id)
        elsif !@auction.auction_result.nil?
          redirect_to message_retailer_auctions_path
          # There is no upcoming reverse auction published.
        end
      end
    end
  end

  def message
    @auction = Auction.first
    arrangement = Arrangement.find_by_user_id(current_user.id)
    empty_message = 'There is no upcoming reverse auction published.'
    progress_message = "Please complete the necessary details under 'Manage Upcoming Reverse Auction' located in homepage."

    if @auction.publish_status != '1'
      @message = empty_message
    else
      if arrangement.accept_status != '1'
        if @auction.actual_begin_time < Time.current
          @message =  'We regret to inform that you are unable to participate as you have not submitted the necessary contact person details. We hope to see you again in future reverse auctions.'
        elsif Time.current < @auction.actual_begin_time
          @message = progress_message
        end
      else
        @message = empty_message unless @auction.auction_result.nil?
      end
    end
  end

  private

  def set_login_status
    UserExtension.save_or_update_login_status(current_user, 'login', params[:id], request[:action])
  end
end