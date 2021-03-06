class TenderChat < ApplicationRecord

  # comments
  # sp_response_status
  # '0' reject
  # '1' accept
  # '2' retailer save, just input processing, don't show at history list
  # '3' retailer submit deviation
  # '4' retailer withdraw
  # Extends

  # Includes

  # Associations

  belongs_to :arrangement
  has_many :tender_chat_details, dependent: :destroy

  # accepts_nested_attributes

  # Validations

  # Scopes
  scope :admin_find_by_id, ->(id) { where(id: id).take }
  # Callbacks

  # Delegates

  # Custom

  # Methods (class methods before instance methods)

end
