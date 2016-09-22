/*!
 * 
 * dashboard.js v1.0 
 * Copyright 2016, Feng Lee <feng@emqtt.io>
 * 
 */

(function(dashboard, $) {

    'use strict';

    dashboard.version = '1.0';

    var WebAPI = function(options) {
        this.options = $.extend(
                {},
                WebAPI.DEFAULTS,
                options || {});
    };

    WebAPI.DEFAULTS = {
        apiPath  : '/',
        method   : 'POST',
        cache    : false,
        dataType : 'json',
        callback : null
    };

    /** Instantiation WebAPI */
    WebAPI._instance = null;
    /**
     * Get the Instantiation WebAPI
     */
    WebAPI.getInstance = function() {
        if (!WebAPI._instance) {
            throw new Error('WebAPI is not initialized.');
        }
        return WebAPI._instance;
    };

    // WebAPI initialized
    WebAPI.init = function(options) {
        if (!WebAPI._instance) {
            WebAPI._instance = new WebAPI(options);
        }
        return WebAPI.getInstance();
    };

    // var callback = function(ret, err) {};
    WebAPI.prototype._ajax = function(path, params, callback, ajaxInfo) {
        var _this = this, options = _this.options;
        var info = {
            type     : options.method,
            url      : options.apiPath + path,
            data     : params,
            dataType : options.dataType,
            cache    : options.cache,
            success  : function(ret) {
                if ((path == 'api/remove_user'
                    || path == 'api/add_user')
                        && typeof ret == 'object'
                        && ret.status == 'failure') {
                    callback(undefined, ret);
                } else {
                    callback(ret, undefined);
                }

                // Do "options.callback" after
                // the request is successful
                if (typeof options.callback === 'function') {
                    options.callback();
                }
            },
            error : function(err) {
                if (typeof callback === 'function') {
                    callback(undefined, err);
                }
            }
        };
        $.extend(info, ajaxInfo || {});
        $.ajax(info);
    };

    $.extend(WebAPI.prototype, {
        // broker
        broker : function(callback) {
            this._ajax('api/brokers', null, callback);
        },

        // bnode
        bnode : function(callback) {
            this._ajax('api/bnode', null, callback);
        },

        // nodes
        nodes : function(callback) {
            this._ajax('api/nodes', null, callback);
        },

        // stats
        stats : function(callback) {
            this._ajax('api/stats', null, callback);
        },

        // metrics
        metrics : function(callback) {
            this._ajax('api/metrics', null, callback);
        },

        // m_chart
        m_chart : function(minutes, callback) {
            this._ajax('api/m_chart', {minutes : minutes}, callback);
        },

        // listeners
        listeners : function(callback) {
            this._ajax('api/listeners', null, callback);
        },

        // clients
        clients : function(params, callback) {
            this._ajax('api/clients', params, callback);
        },

        // sessions
        sessions : function(params, callback) {
            this._ajax('api/sessions', params, callback);
        },

        // topics
        topics : function(params, callback) {
            this._ajax('api/topics', params, callback);
        },

        // subscriptions
        subscriptions : function(params, callback) {
            this._ajax('api/subscriptions', params, callback);
        },

        // alarms 
        alarms: function(callback) {
            this._ajax('api/alarms', null, callback);
        },


        // users
        users : function(callback) {
            this._ajax('api/users', null, callback);
        },

        // user_remove
        user_remove : function(username, callback) {
            this._ajax('api/remove_user', {user_name : username}, callback);
        },

        // user_add
        user_add : function(user, callback) {
            this._ajax('api/add_user', user, callback);
        },

        // user_curr
        user_curr : function(callback) {
            this._ajax('api/current_user', null, callback);
        },

        // node_curr
        node_curr : function(callback) {
            this._ajax('api/bnode', null, callback);
        },


        // user_update
        user_update : function(user, callback) {
            this._ajax('api/update_user', user, callback);
        },

        // logout
        logout : function(callback) {
            this._ajax('api/current_user', null, callback, {
                headers: {
                    "Authorization": "Lougout 123456789"
                }
            });
            // clearAuthenticate();
        },

        // routes
        routes : function(params, callback) {
            this._ajax('api/routes', params, callback);
        }
    });

    var PageInfo = function(currPage, pageSize, totalNum) {
        this.currPage = currPage;
        this.pageSize = pageSize;
        this.totalNum = totalNum;
        this.totalPage = 0;
    };
    PageInfo.prototype.countTotalPage = function(totalPage) {
        if (totalPage) {
            this.totalPage = totalPage;
            return;
        }
        if (this.totalNum % this.pageSize == 0) {
            this.totalPage = this.totalNum / this.pageSize;
        } else {
            this.totalPage = this.totalNum / this.pageSize + 1;
        }
    };
    PageInfo.prototype.offsetting = function() {
        if (this.totalNum == 0) {
            return 0;
        } else {
            return (this.currPage - 1) * this.pageSize + 1;
        }
    };
    PageInfo.prototype.endNum = function() {
        if (this.totalNum == 0) {
            return 0;
        }
        if (this.currPage == this.totalPage) {
            return this.totalNum;
        } else {
            return this.offsetting() + this.pageSize - 1;
        }
    };

    // Modules save container.
    var modules = {};
    dashboard.modules = modules;

    // Overview-----------------------------------------

    var Overview = function() {
        this.modName = 'overview';
        this.$html = $('#dashboard_overview',
                sog.mainCenter.$html);
        
        this._init();
    };
    Overview.prototype._init = function() {
        var _this = this;
        loading('overview.html', function() {
            _this.vmBroker = new Vue({
                el : $('#overview_broker', _this.$html)[0]
            });
            _this.vmNodes = new Vue({
                el  : $('#overview_nodes', _this.$html)[0],
                data: {
                    nodes: []
                }
            });
            _this.vmLiss = new Vue({
                el  : $('#voerview_listeners', _this.$html)[0],
                data: {
                    listeners: []
                }
            });
            
            _this.broker();
            _this.nodes();
            _this.stats();
            _this.metrics();
            _this.listeners();
            // Start Timertask
            _this.startTask()
        }, _this.$html);
    };
    Overview.prototype.show = function() {
        this.$html.show();
    };
    Overview.prototype.hide = function() {
        this.$html.hide();
    };
    Overview.prototype.broker = function() {
        var _this = this;
        dashboard.webapi.broker(function(ret, err) {
            if (ret) {
                _this.vmBroker.$data = ret;
            }
        });
    };
    Overview.prototype.nodes = function() {
        var _this = this;
        dashboard.webapi.nodes(function(ret, err) {
            if (ret) {
                _this.vmNodes.nodes = ret;
            }
        });
    };
    Overview.prototype.stats = function() {
        var _this = this;
        var $stats = $('#overview_stats', _this.$html);
        dashboard.webapi.stats(function(ret, err) {
            if (ret) {
                for (var key in ret) {
                    var keyStr = key.split('/').join('_');
                    $('#' + keyStr, $stats).text(ret[key]);
                }
            }
        });
    };
    Overview.prototype.metrics = function() {
        var _this = this;
        var $metrics = $('#overview_metrics', _this.$html);
        dashboard.webapi.metrics(function(ret, err) {
            if (ret) {
                for (var key in ret) {
                    var keyStr = key.split('/').join('_');
                    $('#' + keyStr, $metrics).text(ret[key]);
                }
            }
        });
    };
    Overview.prototype.listeners = function() {
        var _this = this;
        dashboard.webapi.listeners(function(ret, err) {
            if (ret) {
                _this.vmLiss.listeners = ret;
            }
        });
    };
    Overview.prototype.startTask = function() {
        var _this = this;
        _this.timertask = setInterval(function() {
            _this.broker();
            _this.nodes();
            _this.stats();
            _this.metrics();
        }, 10000);
    };

    // Metrics------------------------------------------

    var Metrics = function() {
        this.modName = 'metrics';
        this.$html = $('#dashboard_metrics',
                sog.mainCenter.$html);

        this._matrics();
        this._chart();
        this._init();
    };
    Metrics.prototype._init = function() {
        var _this = this;
        loading('metrics.html', function() {
            _this.vmRecent = new Vue({
                el  : $('#metrics_recent', _this.$html)[0],
                data: {minutes: 60},
                methods : {
                    hour : function() {
                        this.minutes = 60;
                        _this.chart();
                    },
                    day : function() {
                        this.minutes = 60 * 24;
                        _this.chart();
                    },
                    week : function() {
                        this.minutes = 60 * 24 * 7;
                        _this.chart();
                    }
                }
            });
            _this.chart();
            _this.startTask();
        }, _this.$html);
    };
    Metrics.prototype.startTask = function() {
        var _this = this;
        _this.timertask = setInterval(function() {
            _this.chart();
        }, 20000);
    };
    Metrics.prototype._matrics = function() {
        this.packets = [ {
            key : 'packets/received',
            values : [],
            color : '#a9d796'
        }, {
            key : 'packets/sent',
            values : [],
            color : '#8cc9e7'
        } ];
        this.packets_2 = [ {
            key : 'packets/publish/received',
            values : [],
            color : '#a9d796'
        }, {
            key : 'packets/publish/sent',
            values : [],
            color : '#8cc9e7'
        } ];
        this.packets_3 = [ {
            key : 'packets/puback/received',
            values : [],
            color : '#a9d796'
        }, {
            key : 'packets/puback/sent',
            values : [],
            color : '#8cc9e7'
        } ];
        this.packets_4 = [ {
            key : 'packets/pubcomp/received',
            values : [],
            color : '#a9d796'
        }, {
            key : 'packets/pubcomp/sent',
            values : [],
            color : '#8cc9e7'
        } ];
        this.packets_5 = [ {
            key : 'packets/pubrec/received',
            values : [],
            color : '#a9d796'
        }, {
            key : 'packets/pubrec/sent',
            values : [],
            color : '#8cc9e7'
        } ];
        this.packets_6 = [ {
            key : 'packets/pubrel/received',
            values : [],
            color : '#a9d796'
        }, {
            key : 'packets/pubrel/sent',
            values : [],
            color : '#8cc9e7'
        } ];
        this.packets_7 = [ {
            key : 'packets/pingreq',
            values : [],
            color : '#a9d796'
        }, {
            key : 'packets/pingresp',
            values : [],
            color : '#8cc9e7'
        } ];
        this.packets_8 = [ {
            key : 'packets/suback',
            values : [],
            color : '#a9d796'
        }, {
            key : 'packets/unsuback',
            values : [],
            color : '#8cc9e7'
        } ];
        this.packets_9 = [ {
            key : 'packets/subscribe',
            values : [],
            color : '#a9d796'
        }, {
            key : 'packets/unsubscribe',
            values : [],
            color : '#8cc9e7'
        } ];
        this.packets_10 = [ {
            key : 'packets/connect',
            values : [],
            color : '#a9d796'
        }, {
            key : 'packets/connack',
            values : [],
            color : '#8cc9e7'
        }, {
            key : 'packets/disconnect',
            values : [],
            color : '#cccccc'
        } ];
        
        this.messages = [ {
            key : 'messages/received',
            values : [],
            color : '#a9d796'
        }, {
            key : 'messages/sent',
            values : [],
            color : '#8cc9e7'
        }, {
            key : 'messages/dropped',
            values : [],
            color : 'rgb(44, 160, 44)'
        }, {
            key : 'messages/retained',
            values : [],
            color : '#cccccc'
        } ];
        this.messages_2 = [{
            key : 'messages/qos0/received',
            values : [],
            color : '#a9d796'
        }, {
            key : 'messages/qos0/sent',
            values : [],
            color : '#8cc9e7'
        } ];
        this.messages_3 = [ {
            key : 'messages/qos1/received',
            values : [],
            color : '#a9d796'
        }, {
            key : 'messages/qos1/sent',
            values : [],
            color : '#8cc9e7'
        } ];
        this.messages_4 = [ {
            key : 'messages/qos2/received',
            values : [],
            color : '#a9d796'
        }, {
            key : 'messages/qos2/sent',
            values : [],
            color : '#8cc9e7'
        } ];
        
        this.bytes = [ {
            key : 'bytes/received',
            values : [],
            color : '#a9d796'
        }, {
            key : 'bytes/sent',
            values : [],
            color : '#8cc9e7'
        } ];
    };
    Metrics.prototype.newChart = function() {
        var _this = this;
        var chart = nv.models.lineChart()
            .color(d3.scale.category10().range())
            //.margin({left: 30})
            .useInteractiveGuideline(true)
            .transitionDuration(350)
            .showLegend(true) 
            .showYAxis(true)
            .showXAxis(true)
            .x(function(d) {return d.x * 1000})
            .y(function(d) {return d.y});
        chart.xAxis.tickFormat(function(d) {
            var ms = _this.vmRecent.minutes;
            if (ms == 60) {
                return (new Date(d)).format('hh:mm');
            } else if (ms == 60 * 24) {
                return (new Date(d)).format('MM/dd,hh:mm');
            } else if (ms == 60 * 24 * 7) {
                return (new Date(d)).format('MM/dd,hh:mm');
            }
        });
        nv.utils.windowResize(function() {
            chart.update();
        });
        return chart;
    };
    Metrics.CHART_COUNTS = 15;
    Metrics.prototype._chart = function() {
        var _this = this;
        
        _this.charts = [];
        for (var i = 0; i < Metrics.CHART_COUNTS; i++) {
            _this.charts.push(_this.newChart());
        }
    };
    Metrics.prototype.show = function() {
        this.$html.show();
        var _this = this;
        for (var i = 0; i < Metrics.CHART_COUNTS; i++) {
            if (_this.charts[i].update) {
                _this.charts[i].update();
            }
        }
    };
    Metrics.prototype.hide = function() {
        this.$html.hide();
    };
    Metrics.prototype.newGraph = function(area, chart, data) {
        nv.addGraph(function() {
            d3.select(area)
                .datum(data)
                .transition()
                .duration(500)
                .call(chart);
            return chart;
        });
    };
    Metrics.prototype.graph = function(packets, messages, bytes,
            packets_2, packets_3, packets_4,
            packets_5, packets_6, packets_7,
            packets_8, packets_9, packets_10,
            messages_2, messages_3, messages_4) {
        var _this = this;
        var ts = (new Date()).getTime();
        var ms = _this.vmRecent.minutes;
        var uniform = ms * 60 * 1000 / 5;
        for (var i = 0; i < Metrics.CHART_COUNTS; i++) {
            _this.charts[i].xAxis.tickValues([ ts - uniform * 5,
                    ts - uniform * 4, ts - uniform * 3,
                    ts - uniform * 2, ts - uniform, ts ]);
        }
//        for (var i = 0; i < Metrics.CHART_COUNTS; i++) {
//            _this.charts[i].xAxis.ticks(5);
//        }
        
        _this.newGraph('#packets_chart svg', _this.charts[0], packets);
        _this.newGraph('#packets_chart_2 svg', _this.charts[1], packets_2);
        _this.newGraph('#packets_chart_3 svg', _this.charts[2], packets_3);
        _this.newGraph('#packets_chart_4 svg', _this.charts[3], packets_4);
        _this.newGraph('#packets_chart_5 svg', _this.charts[4], packets_5);
        _this.newGraph('#packets_chart_6 svg', _this.charts[5], packets_6);
        _this.newGraph('#packets_chart_7 svg', _this.charts[6], packets_7);
        _this.newGraph('#packets_chart_8 svg', _this.charts[7], packets_8);
        _this.newGraph('#packets_chart_9 svg', _this.charts[8], packets_9);
        _this.newGraph('#packets_chart_10 svg', _this.charts[9], packets_10);
        
        _this.newGraph('#messages_chart svg', _this.charts[10], messages);
        _this.newGraph('#messages_chart_2 svg', _this.charts[11], messages_2);
        _this.newGraph('#messages_chart_3 svg', _this.charts[12], messages_3);
        _this.newGraph('#messages_chart_4 svg', _this.charts[13], messages_4);
        
        _this.newGraph('#bytes_chart svg', _this.charts[14], bytes);
    };
    Metrics.prototype.chart = function() {
        var _this = this;
        dashboard.webapi.m_chart(_this.vmRecent.minutes, function(ret, err) {
            if (ret) {
                for (var key in ret) {
                    for (var i = 0, l = _this.packets.length; i < l; i++) {
                        if (_this.packets[i].key == key) {
                            _this.packets[i].values = ret[key];
                            break;
                        }
                    }
                    for (var i = 0, l = _this.packets_2.length; i < l; i++) {
                        if (_this.packets_2[i].key == key) {
                            _this.packets_2[i].values = ret[key];
                            break;
                        }
                    }
                    for (var i = 0, l = _this.packets_3.length; i < l; i++) {
                        if (_this.packets_3[i].key == key) {
                            _this.packets_3[i].values = ret[key];
                            break;
                        }
                    }
                    for (var i = 0, l = _this.packets_4.length; i < l; i++) {
                        if (_this.packets_4[i].key == key) {
                            _this.packets_4[i].values = ret[key];
                            break;
                        }
                    }
                    for (var i = 0, l = _this.packets_5.length; i < l; i++) {
                        if (_this.packets_5[i].key == key) {
                            _this.packets_5[i].values = ret[key];
                            break;
                        }
                    }
                    for (var i = 0, l = _this.packets_6.length; i < l; i++) {
                        if (_this.packets_6[i].key == key) {
                            _this.packets_6[i].values = ret[key];
                            break;
                        }
                    }
                    for (var i = 0, l = _this.packets_7.length; i < l; i++) {
                        if (_this.packets_7[i].key == key) {
                            _this.packets_7[i].values = ret[key];
                            break;
                        }
                    }
                    for (var i = 0, l = _this.packets_8.length; i < l; i++) {
                        if (_this.packets_8[i].key == key) {
                            _this.packets_8[i].values = ret[key];
                            break;
                        }
                    }
                    for (var i = 0, l = _this.packets_9.length; i < l; i++) {
                        if (_this.packets_9[i].key == key) {
                            _this.packets_9[i].values = ret[key];
                            break;
                        }
                    }
                    for (var i = 0, l = _this.packets_10.length; i < l; i++) {
                        if (_this.packets_10[i].key == key) {
                            _this.packets_10[i].values = ret[key];
                            break;
                        }
                    }
                    
                    for (var i = 0, l = _this.messages.length; i < l; i++) {
                        if (_this.messages[i].key == key) {
                            _this.messages[i].values = ret[key];
                            break;
                        }
                    }
                    for (var i = 0, l = _this.messages_2.length; i < l; i++) {
                        if (_this.messages_2[i].key == key) {
                            _this.messages_2[i].values = ret[key];
                            break;
                        }
                    }
                    for (var i = 0, l = _this.messages_3.length; i < l; i++) {
                        if (_this.messages_3[i].key == key) {
                            _this.messages_3[i].values = ret[key];
                            break;
                        }
                    }
                    for (var i = 0, l = _this.messages_4.length; i < l; i++) {
                        if (_this.messages_4[i].key == key) {
                            _this.messages_4[i].values = ret[key];
                            break;
                        }
                    }
                    
                    for (var i = 0, l = _this.bytes.length; i < l; i++) {
                        if (_this.bytes[i].key == key) {
                            _this.bytes[i].values = ret[key];
                            break;
                        }
                    }
                }
                _this.graph(_this.packets, _this.messages, _this.bytes,
                        _this.packets_2, _this.packets_3, _this.packets_4,
                        _this.packets_5, _this.packets_6, _this.packets_7,
                        _this.packets_8, _this.packets_9, _this.packets_10,
                        _this.messages_2, _this.messages_3, _this.messages_4);
            }
        });
    };

    // Clients------------------------------------------

    var Clients = function() {
        this.modName = 'clients';
        this.$html = $('#dashboard_clients',
                sog.mainCenter.$html);
        this.pageInfo = new PageInfo(1, 100, 0);
        this._init();
    };
    Clients.prototype._init = function() {
        var _this = this;
        loading('clients.html', function() {
            _this.vmClients = new Vue({
                el  : $('#clients_list', _this.$html)[0],
                data: {
                    clientKey : null,
                    pageInfo : _this.pageInfo,
                    clients : []
                },
                methods : {
                    search : function() {
                        _this.list();
                    },
                    changeSize : function(pageSize) {
                        _this.pageInfo.pageSize = pageSize;
                        _this.pageInfo.currPage = 1;
                        _this.list();
                    },
                    go : function(currPage) {
                        _this.pageInfo.currPage = currPage;
                        _this.list();
                    }
                }
            });
            
            _this.list();
        }, _this.$html);
    };
    Clients.prototype.clear = function(){
        var _this = this;
        _this.pageInfo = new PageInfo(1, 100, 0);
        _this.vmClients.clientKey = null;
    };
    Clients.prototype.show = function() {
        this.$html.show();
    };
    Clients.prototype.hide = function() {
        this.$html.hide();
    };
    Clients.prototype.list = function() {
        var _this = this;
        var cKey = _this.vmClients.clientKey;
        _this.vmClients.clientKey = cKey ? cKey.trim() : '';
        var params = {
            page_size : _this.pageInfo.pageSize,
            curr_page : _this.pageInfo.currPage,
            client_key : _this.vmClients.clientKey
        };
        dashboard.webapi.clients(params, function(ret, err) {
            if (ret) {
                _this.vmClients.clients = ret.result;
                _this.pageInfo.currPage = ret.currentPage;
                _this.pageInfo.pageSize = ret.pageSize;
                _this.pageInfo.totalNum = ret.totalNum;
                _this.pageInfo.totalPage = ret.totalPage;
                _this.vmClients.pageInfo = _this.pageInfo;
            }
        });
    };

    // Sessions-----------------------------------------

    var Sessions = function() {
        this.modName = 'sessions';
        this.$html = $('#dashboard_sessions',
                sog.mainCenter.$html);
        this.pageInfo = new PageInfo(1, 100, 0);
        this._init();
    };
    Sessions.prototype._init = function() {
        var _this = this;
        loading('sessions.html', function() {
            _this.vmSessions = new Vue({
                el  : $('#sessions_list', _this.$html)[0],
                data: {
                    clientKey : null,
                    pageInfo : _this.pageInfo,
                    sessions : []
                },
                methods : {
                    search : function() {
                        _this.list();
                    },
                    changeSize : function(pageSize) {
                        _this.pageInfo.pageSize = pageSize;
                        _this.pageInfo.currPage = 1;
                        _this.list();
                    },
                    go : function(currPage) {
                        _this.pageInfo.currPage = currPage;
                        _this.list();
                    }
                }
            });
            
            _this.list();
        }, _this.$html);
    };
    Sessions.prototype.clear = function(){
        var _this = this;
        _this.pageInfo = new PageInfo(1, 100, 0);
        _this.vmSessions.clientKey = null;
    };
    Sessions.prototype.show = function() {
        this.$html.show();
    };
    Sessions.prototype.hide = function() {
        this.$html.hide();
    };
    Sessions.prototype.list = function() {
        var _this = this;
        var cKey = _this.vmSessions.clientKey;
        _this.vmSessions.clientKey = cKey ? cKey.trim() : '';
        var params = {
            page_size : _this.pageInfo.pageSize,
            curr_page : _this.pageInfo.currPage,
            client_key : _this.vmSessions.clientKey
        };
        dashboard.webapi.sessions(params, function(ret, err) {
            if (ret) {
                _this.vmSessions.sessions = ret.result;
                _this.pageInfo.currPage = ret.currentPage;
                _this.pageInfo.pageSize = ret.pageSize;
                _this.pageInfo.totalNum = ret.totalNum;
                _this.pageInfo.totalPage = ret.totalPage;
                _this.vmSessions.pageInfo = _this.pageInfo;
            }
        });
    };

    // Topics-------------------------------------------

    var Topics = function() {
        this.modName = 'topics';
        this.$html = $('#dashboard_topics',
                sog.mainCenter.$html);
        this.pageInfo = new PageInfo(1, 100, 0);
        this._init();
    };
    Topics.prototype._init = function() {
        var _this = this;
        loading('topics.html', function() {
            _this.vmTopics = new Vue({
                el  : $('#topics_list', _this.$html)[0],
                data: {
                    topic : null,
                    pageInfo : _this.pageInfo,
                    topics : []
                },
                methods : {
                    search : function() {
                        _this.list();
                    },
                    changeSize : function(pageSize) {
                        _this.pageInfo.pageSize = pageSize;
                        _this.pageInfo.currPage = 1;
                        _this.list();
                    },
                    go : function(currPage) {
                        _this.pageInfo.currPage = currPage;
                        _this.list();
                    }
                }
            });
            
            _this.list();
        }, _this.$html);
    };
    Topics.prototype.clear = function(){
        var _this = this;
        _this.pageInfo = new PageInfo(1, 100, 0);
        _this.vmTopics.topic = null;
    };
    Topics.prototype.show = function() {
        this.$html.show();
    };
    Topics.prototype.hide = function() {
        this.$html.hide();
    };
    Topics.prototype.list = function() {
        var _this = this;
        var tc = _this.vmTopics.topic;
        _this.vmTopics.topic = tc ? tc.trim() : '';
        var params = {
            page_size : _this.pageInfo.pageSize,
            curr_page : _this.pageInfo.currPage,
            topic : _this.vmTopics.topic
        };
        dashboard.webapi.topics(params, function(ret, err) {
            if (ret) {
                _this.vmTopics.topics = ret.result;
                _this.pageInfo.currPage = ret.currentPage;
                _this.pageInfo.pageSize = ret.pageSize;
                _this.pageInfo.totalNum = ret.totalNum;
                _this.pageInfo.totalPage = ret.totalPage;
                _this.vmTopics.pageInfo = _this.pageInfo;
            }
        });
    };

    // Routes-------------------------------------------

    var Routes = function() {
        this.modName = 'routes';
        this.$html = $('#dashboard_routes',
                sog.mainCenter.$html);
        this.pageInfo = new PageInfo(1, 100, 0);
        this._init();
    };
    Routes.prototype._init = function() {
        var _this = this;
        loading('routes.html', function() {
            _this.vmRoutes = new Vue({
                el  : $('#routes_list', _this.$html)[0],
                data: {
                    topic : null,
                    pageInfo : _this.pageInfo,
                    routes : []
                },
                methods : {
                    search : function() {
                        _this.list();
                    },
                    changeSize : function(pageSize) {
                        _this.pageInfo.pageSize = pageSize;
                        _this.pageInfo.currPage = 1;
                        _this.list();
                    },
                    go : function(currPage) {
                        _this.pageInfo.currPage = currPage;
                        _this.list();
                    }
                }
            });
            
            _this.list();
        }, _this.$html);
    };
    Routes.prototype.clear = function() {
        var _this = this;
        _this.pageInfo = new PageInfo(1, 100, 0);
        _this.vmRoutes.topic = null;
    };
    Routes.prototype.show = function() {
        this.$html.show();
    };
    Routes.prototype.hide = function() {
        this.$html.hide();
    };
    Routes.prototype.list = function() {
        var _this = this;
        var tc = _this.vmRoutes.topic;
        _this.vmRoutes.topic = tc ? tc.trim() : '';
        var params = {
            page_size : _this.pageInfo.pageSize,
            curr_page : _this.pageInfo.currPage,
            topic : _this.vmRoutes.topic
        };
        dashboard.webapi.routes(params, function(ret, err) {
            if (ret) {
                _this.vmRoutes.routes = ret.result;
                _this.pageInfo.currPage = ret.currentPage;
                _this.pageInfo.pageSize = ret.pageSize;
                _this.pageInfo.totalNum = ret.totalNum;
                _this.pageInfo.totalPage = ret.totalPage;
                _this.vmRoutes.pageInfo = _this.pageInfo;
            }
        });
    };

    // Subscriptions-------------------------------------

    var Subscriptions = function() {
        this.modName = 'subscriptions';
        this.$html = $('#dashboard_subscriptions',
                sog.mainCenter.$html);
        this.pageInfo = new PageInfo(1, 100, 0);
        this._init();
    };
    Subscriptions.prototype._init = function() {
        var _this = this;
        loading('subscriptions.html', function() {
            _this.vmSubs = new Vue({
                el  : $('#subscriptions_list', _this.$html)[0],
                data: {
                    clientKey : null,
                    pageInfo : _this.pageInfo,
                    subscriptions : []
                },
                methods : {
                    search : function() {
                        _this.list();
                    },
                    changeSize : function(pageSize) {
                        _this.pageInfo.pageSize = pageSize;
                        _this.pageInfo.currPage = 1;
                        _this.list();
                    },
                    go : function(currPage) {
                        _this.pageInfo.currPage = currPage;
                        _this.list();
                    }
                }
            });
            
            _this.list();
        }, _this.$html);
    };
    Subscriptions.prototype.clear = function(){
        var _this = this;
        _this.pageInfo = new PageInfo(1, 100, 0);
        _this.vmSubs.clientKey = null;
    };
    Subscriptions.prototype.show = function() {
        this.$html.show();
    };
    Subscriptions.prototype.hide = function() {
        this.$html.hide();
    };
    Subscriptions.prototype.list = function() {
        var _this = this;
        var cKey = _this.vmSubs.clientKey;
        _this.vmSubs.clientKey = cKey ? cKey.trim() : '';
        var params = {
            page_size : _this.pageInfo.pageSize,
            curr_page : _this.pageInfo.currPage,
            client_key : _this.vmSubs.clientKey
        };
        dashboard.webapi.subscriptions(params, function(ret, err) {
            if (ret) {
                _this.vmSubs.subscriptions = ret.result;
                _this.pageInfo.currPage = ret.currentPage;
                _this.pageInfo.pageSize = ret.pageSize;
                _this.pageInfo.totalNum = ret.totalNum;
                _this.pageInfo.totalPage = ret.totalPage;
                _this.vmSubs.pageInfo = _this.pageInfo;
            }
        });
    };
    
    // Alarms-------------------------------------

    var Alarms= function() {
        this.modName = 'alarms';
        this.$html = $('#dashboard_alarms',
                sog.mainCenter.$html);
        this._init();
    };
    Alarms.prototype._init = function() {
        var _this = this;
        loading('alarms.html', function() {
            _this.vmAlarms = new Vue({
                el  : $('#alarms_list', _this.$html)[0],
                data: {
                    alarms: []
                },
            });
            
            _this.list();
        }, _this.$html);
    };
    Alarms.prototype.show = function() {
        this.$html.show();
    };
    Alarms.prototype.hide = function() {
        this.$html.hide();
    };
    Alarms.prototype.list = function() {
        var _this = this;
        dashboard.webapi.alarms(function(ret, err) {
            if (ret) {
                _this.vmAlarms.alarms= ret;
            }
        });
    };


    // Websocket----------------------------------------

    var Websocket = function() {
        this.modName = 'websocket';
        this.$html = $('#dashboard_websocket',
                sog.mainCenter.$html);
        this.client = null;
        this._init();
    };
    Websocket.prototype._init = function() {
        var _this = this;
        loading('websocket.html', function() {
            _this.vmWS = new Vue({
                el  : _this.$html[0],
                data: {
                    connState : false,
                    cInfo : {
                        host : location.hostname,
                        port : 8083,
                        clientId : 'C_' + new Date().getTime(),
                        userName : null,
                        password : null,
                        keepAlive: null,
                        cleanSession : true
                    },
                    subInfo : {
                        topic : '/world',
                        qos : 0
                    },
                    subscriptions : [],
                    sendInfo : {
                        topic : '/world',
                        text : 'Hello world!',
                        qos : 0,
                        retained : true
                    },
                    sendMsgs : [],
                    receiveMsgs : []
                },
                methods : {
                    connect : function() {
                        _this.connect();
                    },
                    disconnect : function() {
                        _this.disconnect();
                    },
                    sub : function() {
                        _this.subscribe();
                    },
                    send : function() {
                        _this.sendMessage();
                    }
                }
            });
        }, _this.$html);
    };
    Websocket.prototype.show = function() {
        this.$html.show();
    };
    Websocket.prototype.hide = function() {
        this.$html.hide();
    };
    Websocket.prototype.newClient = function() {
        this.client = new Paho.MQTT.Client(
                this.vmWS.cInfo.host,
                Number(this.vmWS.cInfo.port),
                this.vmWS.cInfo.clientId);
    };
    Websocket.prototype.connect = function() {
        var _this = this;
        _this.newClient();

        if (!_this.client) {
            return;
        }
        // called when the client loses its connection
        _this.client.onConnectionLost = function(responseObject) {
            if (responseObject.errorCode !== 0) {
                console.log("onConnectionLost: " + responseObject.errorMessage);
            }
        }
        // called when a message arrives
        _this.client.onMessageArrived = function(message) {
            console.log("onMessageArrived: " + message.payloadString);
            message.time = (new Date()).format("yyyy-MM-dd hh:mm:ss");
            _this.vmWS.receiveMsgs.push(message);
        }
        
        var options = {
            onSuccess : function() {
                console.log("The client connect success.");
                _this.vmWS.connState = true;
            },
            onFailure : function() {
                console.log("The client connect failure.");
                _this.vmWS.connState = false;
            }
        };
        var userName = _this.vmWS.cInfo.userName;
        var password = _this.vmWS.cInfo.password;
        var keepAlive = _this.vmWS.cInfo.keepAlive;
        var cleanSession = _this.vmWS.cInfo.cleanSession;
        if (userName) {
            options.userName = userName;
        }
        if (password) {
            options.password = password;
        }
        if (keepAlive) {
            options.keepAliveInterval = Number(keepAlive);
        }
        options.cleanSession = cleanSession;
        _this.client.connect(options);
    };
    Websocket.prototype.disconnect = function() {
        var _this = this;
        _this.client.disconnect();
        console.log("The client disconnect success.");
        _this.vmWS.connState = false;
    };
    Websocket.prototype.subscribe = function() {
        var _this = this;
        if (!_this.vmWS.subInfo.topic) {
            alert('Please subscribe to the topic.');
            return;
        }
        this.client.subscribe(_this.vmWS.subInfo.topic, {
            qos : Number(_this.vmWS.subInfo.qos)
        });
        this.vmWS.subInfo.time = (new Date()).format("yyyy-MM-dd hh:mm:ss");
        this.vmWS.subscriptions.push(this.vmWS.subInfo);
        this.vmWS.subInfo = {qos : _this.vmWS.subInfo.qos};
    };
    Websocket.prototype.sendMessage = function() {
        var _this = this;
        var text = _this.vmWS.sendInfo.text;
        if (!_this.vmWS.sendInfo.topic) {
            alert('Please fill in the message topic.');
            return;
        }
        if (!text) {
            alert('Please fill in the message content.');
            return;
        }
        var message = new Paho.MQTT.Message(text);
        message.destinationName = _this.vmWS.sendInfo.topic;
        message.qos = Number(_this.vmWS.sendInfo.qos);
        message.retained = _this.vmWS.sendInfo.retained;
        _this.client.send(message);
        _this.vmWS.sendInfo.time = (new Date()).format("yyyy-MM-dd hh:mm:ss");
        _this.vmWS.sendMsgs.push(this.vmWS.sendInfo);
        _this.vmWS.sendInfo = {
                topic : _this.vmWS.sendInfo.topic,
                qos : _this.vmWS.sendInfo.qos,
                retained : _this.vmWS.sendInfo.retained};
    };

    // Users---------------------------------------------

    var Users = function() {
        this.modName = 'users';
        this.$html = $('#dashboard_users',
                sog.mainCenter.$html);
        this._init();
    };
    Users.prototype._init = function() {
        var _this = this;
        $.ajax({
            url : 'user_modal.html',
            type : 'GET',
            dataType : 'html',
            success : function(ret) {
                $('body').append(ret);
                _this.$modalCofDelUser = $('#modal_confirm_del_user');
                _this.$modalUserAdd = $('#modal_user_add');
                _this.$modalUserEdit = $('#modal_user_edit');
                
                _this.vmUserAdd = new Vue({
                    el  : _this.$modalUserAdd[0],
                    data: {
                        user : {}
                    },
                    methods: {
                        submit : function() {
                            this.user.name = this.user.name ? this.user.name.trim() : '';
                            this.user.password = this.user.password ? this.user.password.trim() : '';
                            this.user.tags = this.user.tags ? this.user.tags.trim() : '';
                            this.user.user_name = this.user.name;
                            if (this.user.user_name == '') {
                                alert("Username is required.");
                                return;
                            }
                            if (this.user.password == '') {
                                alert("Password is required.");
                                return;
                            }
                            if (this.user.password != this.user.password2) {
                                alert("Passwords do not match.");
                                return;
                            }
                            
                            var vm = this;
                            dashboard.webapi.user_add(vm.user,
                                    function(ret, err) {
                                        if (ret) {
                                            vm.user = {};
                                            _this.$modalUserAdd.modal('hide');
                                            _this.list();
                                        } else {
                                            alert(err.reason);
                                        }
                                    });
                        }
                    }
                });
                _this.vmUserEdit = new Vue({
                    el  : _this.$modalUserEdit[0],
                    data: {
                        user : {}
                    },
                    methods: {
                        submit : function() {
                            this.user.name = this.user.name ? this.user.name.trim() : '';
                            this.user.password = this.user.password ? this.user.password.trim() : '';
                            this.user.tags = this.user.tags ? this.user.tags.trim() : '';
                            this.user.user_name = this.user.name;
                            if (this.user.user_name == '') {
                                alert("Username is required.");
                                return;
                            }
                            if (this.user.password == '') {
                                alert("Password is required.");
                                return;
                            }
                            if (this.user.password != this.user.password2) {
                                alert("Passwords do not match.");
                                return;
                            }
                            
                            var vm = this;
                            dashboard.webapi.user_update(vm.user,
                                    function(ret, err) {
                                        if (ret) {
                                            vm.user = {};
                                            _this.$modalUserEdit.modal('hide');
                                            _this.list();
                                        } else {
                                            alert("Edit failure.");
                                        }
                                    });
                        }
                    }
                });
                _this.vmUserDel = new Vue({
                    el  : _this.$modalCofDelUser[0],
                    data: {
                        user : {}
                    },
                    methods: {
                        submit : function() {
                            var vm = this;
                            dashboard.webapi.user_remove(vm.user.name,
                                    function(ret, err) {
                                        if (ret) {
                                            vm.user = {};
                                            _this.$modalCofDelUser.modal('hide');
                                            _this.list();
                                        } else {
                                            alert(err.reason);
                                        }
                                    });
                        }
                    }
                });
            }
        });
        loading('users.html', function() {
            _this.vmUsers = new Vue({
                el  : $('#users_list', _this.$html)[0],
                data: {
                    users: [],
                    i : 0
                },
                methods: {
                    del : function(user) {
                        user = {name : user.name};
                        _this.vmUserDel.user = user;
                        _this.$modalCofDelUser.modal('show');
                    },
                    edit : function(user) {
                        user = {name : user.name,
                                tags : user.tag};
                        _this.vmUserEdit.user = user;
                        _this.$modalUserEdit.modal('show');
                    },
                    add : function() {
                        _this.$modalUserAdd.modal('show');
                    }
                }
            });
            _this.list();
        }, _this.$html);
    };
    Users.prototype.show = function() {
        this.$html.show();
    };
    Users.prototype.hide = function() {
        this.$html.hide();
    };
    Users.prototype.list = function() {
        var _this = this;
        dashboard.webapi.users(function(ret, err) {
            if (ret) {
                _this.vmUsers.users = ret;
                _this.vmUsers.i = 0;
            }
        });
    };

    // HttpApi-------------------------------------------

    var HttpApi = function() {
        this.modName = 'http_api';
        this.$html = $('#dashboard_http_api',
                sog.mainCenter.$html);
        this._init();
    };
    HttpApi.prototype._init = function() {
        var _this = this;
        loading('http_api.html', function() {
            
        }, _this.$html);
    };
    HttpApi.prototype.show = function() {
        this.$html.show();
    };
    HttpApi.prototype.hide = function() {
        this.$html.hide();
    };

    // Functions----------------------------------------

    var hideAllMods = function() {
        for (var key in modules) {
            var m = modules[key];
            m.hide();
        }
    };
    var loading = function(mod, fun, $html) {
        sog.loadingBar.show({
            pct : 100,
            delay : 0.5,
            finish : function(pct) {
                // $html.empty().append(
                // '<div class="page-loading-overlay">\
                // <div class="loader-2"></div></div>');
                $html.load(mod, function() {
                    fun();
                    sog.mainFooter.toBottom();
                });
            }
        });
    };
    var showCurrUser = function() {
        dashboard.webapi.user_curr(function(ret, err) {
            if (ret) {
                $('#current_user', sog.mainContent.$html)
                .text(ret.username);
            }
        });
    };

    var showCurrNode= function() {
        dashboard.webapi.node_curr(function(ret, err) {
            if (ret) {
                $('#current_node', sog.mainContent.$html)
                .text(ret.node);
            }
        });
    };


    var clearAuth = function() {
        dashboard.webapi.logout(function(ret, err) {
            if (ret) {
                window.location.href = '/';
            } else {
                window.location.href = '/';
            }
        });
    };
    var openModule = function(modName) {
        hideAllMods();
        activeMenu(modName);

        switch (modName) {
        case 'overview':
            if (!modules.overview) {
                modules.overview = new Overview();
            }
            modules.overview.show();
            break;
        case 'metrics':
            if (!modules.metrics) {
                modules.metrics = new Metrics();
            }
            modules.metrics.show();
            break;
        case 'clients':
            if (!modules.clients) {
                modules.clients = new Clients();
            } else {
                modules.clients.clear();
                modules.clients.list();
            }
            modules.clients.show();
            break;
        case 'sessions':
            if (!modules.sessions) {
                modules.sessions = new Sessions();
            } else {
                modules.sessions.clear();
                modules.sessions.list();
            }
            modules.sessions.show();
            break;
        case 'topics':
            if (!modules.topics) {
                modules.topics = new Topics();
            } else {
                modules.topics.clear();
                modules.topics.list();
            }
            modules.topics.show();
            break;
        case 'routes':
            if (!modules.routes) {
                modules.routes = new Routes();
            } else {
                modules.routes.clear();
                modules.routes.list();
            }
            modules.routes.show();
            break;
        case 'subscriptions':
            if (!modules.subscriptions) {
                modules.subscriptions = new Subscriptions();
            } else {
                modules.subscriptions.clear();
                modules.subscriptions.list();
            }
            modules.subscriptions.show();
            break;
     case 'alarms':
            if (!modules.alarms) {
                modules.alarms= new Alarms();
            } else {
                modules.alarms.list();
            }
            modules.alarms.show();
            break;

        case 'websocket':
            if (!modules.websocket) {
                modules.websocket = new Websocket();
            }
            modules.websocket.show();
            break;
        case 'users':
            if (!modules.users) {
                modules.users = new Users();
            }
            modules.users.show();
            break;
        case 'http_api':
            if (!modules.httpApi) {
                modules.httpApi = new HttpApi();
            }
            modules.httpApi.show();
            break;
        default:
            break;
        }
    };
    var registerEvent = function() {
        var $main = sog.mainContent.$html;
        var $menu = sog.sidebarMenu.$html;
        
        $('#logout', $main).on('click', function(ev) {
            ev.preventDefault();
            clearAuth();
        });

        $('#main-menu>li', $menu).each(function() {
            $(this).click(function() {
                openModule($(this).attr('module'));
            });
        });
    };
    var activeMenu = function(modName) {
        if (modName == 'websocket') {
            if (!window.WebSocket) {
                var msg = "WebSocket not supported by this browser.";
                alert(msg);
                throw new Error(msg);
            }
        }
        $('#main-menu>li').each(function() {
            var $m = $(this);
            $m.removeClass('active');
            var mod = $m.attr('module');
            if (mod == modName) {
                $m.addClass('active');
            }
        });
    };

    dashboard.init = function(url) {
        var _this = this;

        _this.webapi = WebAPI.init({
            callback : function() {
                sog.mainFooter.toBottom();
            }
        });

        showCurrUser();
        showCurrNode();
        // Register menu event.
        registerEvent();
        // Show main center content.
        var strs = url.split('#');
        if (strs.length == 1) {
            openModule('overview');
            return;
        }
        openModule(strs[1].substring(1));
    };

})((function() {
    if (!window.dashboard) {
        window.dashboard = {}
    }
    return window.dashboard;
})(), jQuery);
