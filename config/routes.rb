Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  # require 'resque/server'
  # mount Resque::Server, at: '/jobs'

  # root to: 'home#index'
  resources :home, only: %i[index term] do
    collection do
      get 'term'
    end
  end

  devise_for :users, skip: %i[sessions home]
  as :user do
    get 'users/pwds/edit', to: 'devise/pwds#edit'
    patch 'users/pwds/update', to: 'devise/pwds#update'
    get 'users/choose', to: 'devise/registrations#choose'
    root to: 'devise/sessions#new'
    get 'log_in', to: 'devise/sessions#new', as: :new_user_session
    post 'sign_up', to: 'devise/sessions#create', as: :user_session
    match 'log_out', to: 'devise/sessions#destroy', as: :destroy_user_session, via: Devise.mappings[:user].sign_out_via
  end
  #
  # namespace :devise do
  #   resource :pwds
  # end

  namespace :api do
    namespace :admin do
      resources :users, only: %i[show retailers buyers] do
        collection do
          get 'retailers'
          get 'buyers'
        end
      end
      resources :auctions, only: %i[obtain link create update delete publish hold confirm destroy unpublished published retailers] do
        member do
          put 'publish'
          put 'hold'
          post 'confirm'
        end
        collection do
          get 'obtain'
          get 'unpublished'
          get 'published'
          get 'retailers'
        end
      end
      resource :auction_histories, only: %i[list last] do
        collection do
          get 'list'
          get 'last'
        end
      end
      resources :auction_attachments, only: %i[index create] do
      end
      resources :arrangements, only: %i[index show obtain update] do
        collection do
          get 'obtain'
        end
      end
    end
  end

  namespace :api do
    namespace :retailer do
      resources :auctions, only: %i[obtain] do
        collection do
          get 'obtain'
        end
      end
      resource :auction_histories, only: %i[show] do
      end
      resources :arrangements, only: %i[index show obtain update] do
        collection do
          get 'obtain'
        end
      end
    end
  end

  namespace :api do
    namespace :buyer do
      resources :consumption_details, only:%i[index update]
      resources :auctions, only: %i[obtain published] do
        collection do
          get 'obtain'
          get 'published'
        end
      end
    end
  end

  namespace :api do
    resources :base, only: %i[heartbeat] do
      collection do
        post 'heartbeat'
      end
    end
    resources :auctions, only: %i[timer] do
      member do
        get 'timer'
      end
    end
  end

  namespace :admin do
    # get '/' => 'admin/home#index'
    resources :home, only: :index
    resources :users do
      member do
        get 'manage'
      end
      collection do
        get 'retailers'
        get 'buyers'
        patch 'approval'
      end
    end
    resources :auction_results, only: [:index]
    resources :auction_histories, only: []
    resources :auction_events, only: []
    resources :arrangements, only: []
    resources :user_extensions, only: []
    resources :auction_extend_times, only: []
    resources :auctions, only: %i[new empty goto upcoming online dashboard confirm result report log invitation select comsumption unpublished published] do
      member do
        get 'upcoming' # published and pre-auction page
        get 'online' # published and pre-auciton page to retailer online status page
        get 'dashboard' # live page
        get 'confirm' # confirm or void auction page
        get 'result' # auciton result page
        get 'report' # auciton report page
        get 'log' # auction activity log page
        get 'invitation' # create RA next page
        get 'select' # select users page
        get 'comsumption' # select users page
      end
      collection do
        get 'empty' # no published auction page
        get 'goto'
        get 'unpublished'
        get 'published'
      end
    end
  end

  namespace :retailer do
    resources :home, only: :index
    resources :arrangements, only: []
    resources :auction_results, only: [:index]
    resources :auctions, only: %i[upcoming live finish result empty goto message gotobid] do
      member do
        get 'upcoming' # upcoming auction page
        get 'live' # standby and live page
        get 'finish' # finished "thank you" page
        get 'result' # view post ra page
      end
      collection do
        get 'empty' # no published auction page
        get 'goto'
        get 'message' # no published auction page
        get 'gotobid'
      end
    end
  end

  namespace :buyer do
    resources :home, only: :index
    resources :auctions,only: %i[index]
    resources :consumptions,only: %i[edit]
  end
end
