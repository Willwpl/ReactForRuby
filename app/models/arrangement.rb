class Arrangement < ApplicationRecord

  # Field description:
  # accept_status
  # "0":"Reject", "1":"Accept", "2":"Pending"
  # action_status: admin select retailers in auction creation
  # "1":"Notification sent", "2":"Pending Notification"

  # Extends

  # Includes

  # Associations
  belongs_to :user
  belongs_to :auction
  has_one :tender_state_machine, dependent: :destroy
  # accepts_nested_attributes

  # Validations

  # Scopes
  scope :auction_of_current_user, ->(auction_id, user_id) { where('auction_id = ? and user_id = ?', auction_id, user_id) }
  scope :find_by_auction_id, ->(auction_id) { where('auction_id = ?', auction_id) }
  scope :find_by_auction_and_user, ->(auction_id, user_id) { where('auction_id = ? and user_id =?', auction_id, user_id) }
  scope :is_not_notify, -> { where("action_status = '2'") }
  # Callbacks

  # Delegates

  # Custom

  # Methods (class methods before instance methods)

  def self.query_list(auction_id, accept_status)
    query = Arrangement.select('arrangements.*, users.company_name , user_extensions.login_status , user_extensions.current_room , user_extensions.current_page').left_outer_joins(user: :user_extension).order('arrangements.accept_status ASC, users.company_name ASC')
    if accept_status.nil?
      query.where('auction_id': auction_id)
    else
      query.where('auction_id = :auction_id and accept_status = :accept_status ', auction_id: auction_id, accept_status: accept_status)
    end
  end

  def self.query_list_by_self(auction_id, accept_status, user_id)
    query = query_list(auction_id, accept_status)
    query.where('user_id': user_id)
  end
end
