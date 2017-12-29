import {get, create, put, Ws, update} from '../../../javascripts/http';

export const getArrangements = (auction_id, status) => {
    return get('/api/admin/arrangements', { auction_id: auction_id, accept_status: status });
}

export const getBidderStatus = (params) => {
    return get('/api/admin/arrangements', params);
}

export const arrangementDetail = (params) => {
    return get('/api/admin/arrangements/'+params);
}

export const createRa = (params) => {
    return update('/api/admin/auctions/'+params.auction.id, params);
}

// export const createNewRa = (params) => {
//     return update('/api/admin/auctions/new', params);
// }

export const raPublish = (params) => {
    return put('/api/admin/auctions/'+params.id+'/publish', params.pagedata);
}

export const upateHoldStatus = (auction, hold_status) => {
    return put(`/api/admin/auctions/${auction}/hold`, {hold_status});
}

export const auctionConfirm = (params) => {
    return create('/api/admin/auctions/'+params.id+'/confirm', params.data);
}

export const getHistories = (params) => {
    return get('/api/admin/auction_histories/list', params);
}

export const getHistoriesLast = (params) => {
    return get('/api/admin/auction_histories/last', params);
}

export const createWebsocket = (auction, methods = {}) => {
    return new Ws(window.location.port, auction);
}
