require 'rails_helper'

RSpec.describe Api::Buyer::ConsumptionDetailsController, type: :controller do
  let!(:admin_user){ create(:user, :with_admin) }
  let!(:auction) { create(:auction, :for_next_month, :upcoming, :published, :started) }
  let!(:company_buyer) { create(:user, :with_buyer, :with_company_buyer) }
  let!(:consumption) { create(:consumption, user: company_buyer, auction: auction, participation_status: '1') }
  let!(:consumption_lt) { create(:consumption_detail, :for_lt, consumption_id: consumption.id) }
  let!(:consumption_hts) { create(:consumption_detail, :for_hts, consumption_id: consumption.id) }
  let!(:consumption_htl) { create(:consumption_detail, :for_htl, consumption_id: consumption.id) }
  let!(:consumption_eht) { create(:consumption_detail, :for_eht, consumption_id: consumption.id) }


  describe 'GET buyer consumption detail list' do
    before { sign_in company_buyer }

    context 'Has consumption detail list' do
      def do_request
        get :index, params: { consumption_id: consumption.id}
      end

      before { do_request }
      it 'Success' do
        array = JSON.parse(response.body)
        expect(array.size).to eq(4)
        expect(array[0]['intake_level']).to eq('LT')
        expect(response).to have_http_status(:ok)
      end
    end
  end

end
