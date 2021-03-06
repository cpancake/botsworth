﻿var request = require('request');

function getStockPrice(symbol, callback) {
    var stockRegex = /<meta itemprop="price"\s+?content="([\d.]+)"\s+?\/>/;
    var nameRegex = /<meta itemprop="name"\s+?content="(.+?)"\s+?\/>/;
    request('https://www.google.com/finance?q=' + encodeURIComponent(symbol), function (err, res, body) {
        if (err || res.statusCode != 200)
            return callback('Unable to get stock price for ' + symbol + '.');
        var priceData = stockRegex.exec(body);
        var nameData = nameRegex.exec(body);
        if(!priceData || !nameData)
            return callback('Unable to get stock price for ' + symbol + '.');
        callback(null, 'Stock: ' + nameData[1] + ' - $' + priceData[1].trim());
    });
}

function numberWithCommas(x) {
    var parts = x.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
}

exports.commands = ['stock'];

exports.message = function (uniqueId, username, message, callback) {
    if (message.substr(0,1) == '$' && message.substr(1).length > 0)
    {
        getStockPrice(message.substr(1), function(err, msg) {
            callback(err, msg);
        });
    }
    else return callback(null, null);
}

exports.command = function (uniqueId, username, command, args, callback) {
    if (args.length > 0)
        getStockPrice(args, function (err, msg) {
            callback(err, msg);
        });
}