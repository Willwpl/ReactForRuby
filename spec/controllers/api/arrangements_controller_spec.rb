require 'rails_helper'

RSpec.describe Api::ArrangementsController, type: :controller do
  let!(:user) { create(:user) }
  let!(:auction) { create(:auction, :for_next_month, :upcoming) }

  base_url = 'api/arrangements'
  context 'api/auctions routes' do
    describe 'GET obtain' do
      before { sign_in user }
      it 'success' do
        expect(get: "/#{base_url}/obtain").not_to be_routable
      end
    end

    describe 'GET show' do
      before { sign_in user }
      it 'success' do
        expect(get: "/#{base_url}/#{auction.id}").not_to be_routable
      end
    end

    describe 'GET index' do
      before { sign_in user }
      it 'success' do
        expect(get: "/#{base_url}").not_to be_routable
      end
    end

    describe 'PUT update' do
      before { sign_in user }
      it 'success' do
        expect(get: "/#{base_url}/#{auction.id}").not_to be_routable
      end
    end
  end
end
