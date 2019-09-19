"use strict";

// import "babel-polyfill";
import Fetch from 'node-fetch';

async function getRequest(host, path) {
    const url = host + path;
    const config = {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    }
    const response = await Fetch(url, config);
    return await response.text();
}

async function postRequest (url, tx) {
    const jsonData = JSON.stringify(tx).replace(/"amount":"(\d+)"/g, '"amount":$1');
    const config = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: jsonData
    }
    const response = await Fetch(url, config);
    return await response.json();
}

function textToSafeJson(str, keys) {
    if (keys) {
        for (let i = 0; i < keys.length; i++) {
            let temp = '"' + keys[i] + '"';
            let reg = new RegExp( temp + ' :\\s*(-?\\d+)', 'g');
            str = str.replace(reg, temp + ' : "$1"');
        }
    }
    return JSON.parse(str);
}

export default class Blockchain {

    constructor(host_ip, network_byte) {
        this.network_byte = network_byte;
        this.host_ip = host_ip;
    }

    async getBalance(address) {
        let response = await getRequest(this.host_ip, '/addresses/balance/' + address);
        let keys = ['balance'];
        return textToSafeJson(response, keys);
    }

    async getBalanceDetail(address) {
        let response = await getRequest(this.host_ip, '/addresses/balance/details/' + address);
        let keys = ['regular', 'mintingAverage', 'available', 'effective'];
        return textToSafeJson(response, keys);
    }

    async getTxHistory(address, num) {
        let response = await getRequest(this.host_ip, '/transactions/address/' + address + '/limit/' + num);
        let keys = ['amount'];
        return textToSafeJson(response, keys);
    }

    async getTxById(tx_id) {
        let response = await getRequest(this.host_ip, '/transactions/info/' + tx_id);
        let keys = ['amount'];
        return textToSafeJson(response, keys);
    }

    async getUnconfirmedTxById(tx_id) {
        let response = await getRequest(this.host_ip, '/transactions/unconfirmed/info/' + tx_id);
        return textToSafeJson(response);
    }

    async getHeight() {
        let response = await getRequest(this.host_ip, '/blocks/height');
        return textToSafeJson(response);
    }

    async getLastBlock() {
        let response = await getRequest(this.host_ip, '/blocks/last');
        let keys = ['mintBalance', 'amount'];
        return textToSafeJson(response, keys);
    }

    async getBlockByHeight(height) {
        let response = await getRequest(this.host_ip, '/blocks/at/' + height);
        let keys = ['mintBalance', 'amount'];
        return textToSafeJson(response, keys);
    }

    async getSlotInfo(slot_id) {
        let response = await getRequest(this.host_ip, '/consensus/slotInfo/' + slot_id);
        let keys = ['mintingAverageBalance'];
        return textToSafeJson(response, keys);
    }

    async getAllSlotsInfo() {
        let response = await getRequest(this.host_ip, '/consensus/allSlotsInfo');
        let keys = ['mintingAverageBalance'];
        return textToSafeJson(response, keys);
    }

    async getTokenInfo(token_id) {
        let response = await getRequest(this.host_ip, '/contract/tokenInfo/' + token_id);
        let keys = ['max', 'total', 'unity'];
        return textToSafeJson(response, keys);
    }

    async getTokenBalance(address, token_id) {
        let response = await getRequest(this.host_ip, '/contract/balance/' + address + '/' + token_id);
        let keys = ['balance', 'unity'];
        return textToSafeJson(response, keys);
    }

    async getContractInfo(contract_id) {
        let response = await getRequest(this.host_ip, '/contract/info/' + contract_id);
        return textToSafeJson(response);
    }

    async getContractContent(contract_id) {
        let response = await getRequest(this.host_ip, '/contract/content/' + contract_id);
        return textToSafeJson(response);
    }

    async sendPaymentTx(tx) {
        const url = this.host_ip + '/vsys/broadcast/payment';
        return await postRequest(url, tx);
    }

    async sendLeasingTx(tx) {
        const url = this.host_ip + '/leasing/broadcast/lease';
        return await postRequest(url, tx);
    }

    async sendCancelLeasingTx(tx) {
        const url = this.host_ip + '/leasing/broadcast/cancel';
        return await postRequest(url, tx);
    }

    async sendRegisterContractTx(tx) {
        const url = this.host_ip + '/contract/broadcast/register';
        return await postRequest(url, tx);
    }

    async sendExecuteContractTx(tx) {
        const url = this.host_ip + '/contract/broadcast/execute';
        return await postRequest(url, tx);
    }
};
