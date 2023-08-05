odoo.define('custom_dashboard.dashboard', function (require) {
    "use strict";

    var core = require('web.core');
    var QWeb = core.qweb;
    var web_client = require('web.web_client');
    var session = require('web.session');
    var ajax = require('web.ajax');
    var _t = core._t;
    var rpc = require('web.rpc');
    var self = this;
    var AbstractAction = require('web.AbstractAction');
    var core = require('web.core');
    var Dashboard = AbstractAction.extend({
        template: 'DashboardDetails',
        init: function(parent, context) {
            this._super(parent, context);
            this.dashboards_templates  = ['DashboardDetails'];
        },

        // willStart: function() {
        //     console.log("WILLSTART FUNCTION")
        //     var self = this;
        //         return self.fetch_data();
        // },

        start: function() {
            var self = this;
            this.set("title", 'Dashboard');
            return this._super().then(function() {
                self.fetch_data();
                self.render_graphs();
                self.render_dashboards();
                self.$el.parent().addClass('oe_background_grey');
            });
        },

        render_graphs: function () {
            var self = this;
            self.render_line_graph();
        },

        render_line_graph: function () {
            var self = this;
            var ctx = self.$(".sale_order_count");
        
            rpc.query({
                model: "sale.order.dashboard",
                method: "get_sale_order_count",
            }).then(function (data) {
                var datasets = [{
                    data: [],
                    backgroundColor: [],
                    borderColor: [],
                    borderWidth: 3,
                    fill: [],
                    borderDash: [],
                }];
        
                data.forEach(function (record) {
                    datasets[0].data.push(record.value);
                    datasets[0].fill.push(false);
                    datasets[0].backgroundColor.push(record.bg_colors);
                    datasets[0].borderColor.push(record.color);
                    datasets[0].borderDash.push(5, 5);
                });
        
                var chartData = {
                    datasets: datasets,
                    
                    labels: data.map(function (record) {
                        return record.label;
                    })
                };
        
                var options = {
                    responsive: true,
                    title: {
                        display: false,
                        text: (ctx) => 'Point Style: ' + ctx.chart.data.datasets[0].pointStyle,
                      },
                    maintainAspectRatio: true,
                    legend: {
                        display: false
                    },
                    scales: {
                        xAxis: [{
                            display: true,
                            title: {
                                display: true,
                                text: 'X-Axis'
                            }
                        }],
                        yAxis: [{
                            display: true,
                            ticks: {
                                beginAtZero: true,
                                steps: 10,
                                stepValue: 5,
                            },
                            title: {
                                display: true,
                                text: 'Y-Axis'
                            }
                        }]
                    }
                };
                

                console.log("OPTIONS", options)
                var chart = new Chart(ctx, {
                    type: "line",
                    data: chartData,
                    
                    options: options,
                    
                    // {
                    //     responsive: true,
                    //     legend: {
                    //         display: false
                    //     },
                    //     interaction: {
                    //       mode: 'index',
                    //       intersect: false,
                    //     },
                    //     stacked: false,
                    //     plugins: {
                    //       title: {
                    //         display: true,
                    //         text: 'Chart.js Line Chart - Multi Axis'
                    //       }
                    //     },
                    //     scales: {
                    //       y: {
                    //         type: 'linear',
                    //         display: true,
                    //         position: 'left',
                    //         title: {
                    //             display: true,
                    //             text: 'Y-Axis'
                    //         }
                    //       },
                    //       y1: {
                    //         type: 'linear',
                    //         display: true,
                    //         position: 'right',
                    
                            
                    //         grid: {
                    //           drawOnChartArea: false, // only want the grid lines for one axis to show up
                    //         },
                    //       },
                    //     }
                    // },
                });
            });
        },

        fetch_data: function() {
            console.log("FETCH_DATE FUNCTION")
            var self = this;
            var def1 =  this._rpc({
                    model: 'res.partner',
                    method: 'get_user_details'
            }).then(function (result) {
                var result = result[0];
                console.log("Returned user details:", result);

                // old
                // var base64String = result.image;
                // var imageElement = document.getElementById("image");
                // imageElement.src = "data:image/png;base64," + base64String;

                // new
                var base64String = result.image;
                var imageElement = document.getElementById("image");
                var defaultIconUrl = "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg";
                
                if (base64String) {
                    console.log("base64String", base64String)
                    imageElement.src = "data:image/png;base64," + base64String;
                } else {
                    console.log("defaultIconUrl", defaultIconUrl)
                    imageElement.src = defaultIconUrl;
                }

                $('#user_name').append('<span>' + result.name + '</span>');
                $('#user_email').append('<span>' + result.email + '</span>');
                self.login_user = result[0];
            });
            var def2 = self._rpc({
                model: "project.task",
                method: "get_project_details",
            })
            .then(function (res) {
                console.log("res", res)
                console.log("res.length", res.length)
                for (var i = 0; i < res.length; i++){
                    console.log("res[i]", res[i])
                    console.log("res[i].name", res[i].name)
                    console.log("res[i].progress", res[i].progress)

                    var data = 
                        '<div class="container"' +
                        '<label class="tx-12 tx-uppercase tx-inverse tx-semibold tx-spacing-1">' + res[i].name + '</label>' +
                        '<div class="progress my-2" style="background: white;">' +
                        '<div class="progress-bar progress-bar-striped" style="width: ' + res[i].progress + '%" role="progressbar" aria-valuenow="' + res[i].progress + '" aria-valuemin="0" aria-valuemax="100"></div>' +
                        '</div>' +
                        '</div \n>'
                    
                        console.log('data', data);
                        $('#task_list').append(data);

                }
                // var taskName = res.name;
                // var taskProgress = res.progress;

                // console.log("taskName", taskName);
                // console.log("taskProgress", taskProgress);
                
                // $('#statusLabel').append('<span>' + taskName + '</span>');
                // $('#progressBar').css('width', taskProgress + "%").attr('aria-valuenow', taskProgress);
                // $('#progressBar').attr('aria-valuemin', 0).attr('aria-valuemax', 100);

            });
            return $.when(def1, def2);
        },

        // render_dashboards: function() {console.log("RENDER_DASHBOARD")
        //     var self = this;
        //     if (this.login_user){
        //         _.each(this.dashboards_templates, function(dashboards_templates) {
        //             self.$('.o_hr_dashboard').append(QWeb.render(dashboards_templates, {widget: self}));
        //         });
        //         }
        // },

        //     init: function (parent, context) {
        //         this.action_id = context['id'];
        //         this._super(parent, context);
        //         this.block_ids = []
        //     },

        //     start: function () {
        //         var self = this;
        //         this.set("title", 'Dashboard');

        //         return this._super().then(function () {
        //             self.render_dashboards();
        //         });
        //     },

        //     willStart: function () {
        //         var self = this;
        //         return $.when(this._super()).then(function () {
        //             return self.fetch_data();
        //         });
        //     },

        //     fetch_data: function () {
        //         var self = this;
        //         var def1 = this._rpc({
        //             model: 'dashboard.block',
        //             method: 'get_dashboard_vals',
        //             args: [[], this.action_id]
        //         }).then(function (result) {
        //             self.block_ids = result;
        //         });
        //         return $.when(def1);
        //     },

        //     get_colors: function (x_axis) {
        //         var color = []
        //         for (var j = 0; j < x_axis.length; j++) {
        //             var r = Math.floor(Math.random() * 255);
        //             var g = Math.floor(Math.random() * 255);
        //             var b = Math.floor(Math.random() * 255);
        //             color.push("rgb(" + r + "," + g + "," + b + ")");
        //         }
        //         return color
        //     },

        //     get_values_bar: function (block) {
        //         var labels = block['x_axis']
        //         var data = {
        //             labels: labels,
        //             datasets: [{
        //                 label: "",
        //                 data: block['y_axis'],
        //                 backgroundColor: this.get_colors(block['x_axis']),
        //                 borderColor: 'rgba(200, 200, 200, 0.75)',
        //                 borderWidth: 1
        //             }]
        //         };

        //         var options = {
        //             scales: {
        //                 y: {
        //                     beginAtZero: true
        //                 }
        //             }
        //         },
        //             bar_data = [data, options]
        //         return bar_data;
        //     },

        //     get_values_pie: function (block) {
        //         var data = {
        //             labels: block['x_axis'],
        //             datasets: [{
        //                 label: '',
        //                 data: block['y_axis'],
        //                 backgroundColor: this.get_colors(block['x_axis']),
        //                 hoverOffset: 4
        //             }]
        //         };
        //         var options = {},
        //             pie_data = [data, options]
        //         return pie_data;
        //     },

        //     get_values_line: function (block) {
        //         var labels = block['x_axis']
        //         var data = {
        //             labels: labels,
        //             datasets: [{
        //                 label: '',
        //                 data: block['y_axis'],
        //                 fill: false,
        //                 borderColor: 'rgb(75, 192, 192)',
        //                 tension: 0.1
        //             }]
        //         };
        //         var options = {},
        //             line_data = [data, options]
        //         return line_data;

        //     },

        //     get_values_doughnut: function (block) {
        //         var data = {
        //             labels: block['x_axis'],
        //             datasets: [{
        //                 label: '',
        //                 data: block['y_axis'],
        //                 backgroundColor: this.get_colors(block['x_axis']),
        //                 hoverOffset: 4
        //             }]
        //         };
        //         var options = {},
        //             doughnut_data = [data, options]
        //         return doughnut_data;


        //     },

        //     get_values_radar: function (block) {
        //         var data = {
        //             labels: block['x_axis'],
        //             datasets: [{
        //                 label: '',
        //                 data: block['y_axis'],
        //                 fill: true,
        //                 backgroundColor: 'rgba(255, 99, 132, 0.2)',
        //                 borderColor: 'rgb(255, 99, 132)',
        //                 pointBackgroundColor: 'rgb(255, 99, 132)',
        //                 pointBorderColor: '#fff',
        //                 pointHoverBackgroundColor: '#fff',
        //                 pointHoverBorderColor: 'rgb(255, 99, 132)'
        //             }]
        //         };
        //         var options = {
        //             elements: {
        //                 line: {
        //                     borderWidth: 3
        //                 }
        //             }
        //         },
        //             radar_data = [data, options]
        //         return radar_data;
        //     },

        render_dashboards: function () {
            var self = this;
            _.each(this.block_ids, function (block) {
                if (block['type'] == 'tile') {
                    self.$('.dynamic_dashboard').append(QWeb.render('DynamicTile', { widget: block }));
                }
                //             else {
                //                 self.$('.dynamic_chart').append(QWeb.render('DynamicDashboardChart', { widget: block }));
                //                 var element = $('[data-id=' + block['id'] + ']')
                //                 if (!('x_axis' in block)) {
                //                     return false
                //                 }
                //                 var ctx = self.$('.chart_graphs').last()
                //                 var type = block['graph_type']
                //                 var chart_type = 'self.get_values_' + `${type}(block)`
                //                 var data = eval(chart_type)
                //                 var chart = new Chart(ctx, {
                //                     type: type,
                //                     data: data[0],
                //                     options: data[1]
                //                 });
                //             }
            });
        },

        _onClick_add_block: function (e) {
            var self = this;
            var type = $(e.currentTarget).attr('data-type');
            ajax.jsonRpc('/create/tile', 'call', {
                'type': type,
                'action_id': self.action_id
            }).then(function (result) {
                if (result['type'] == 'tile') {
                    self.$('.dynamic_dashboard').append(QWeb.render('DynamicTile', { widget: result }));
                }
                // else {
                //     self.$('.dynamic_chart').append(QWeb.render('DynamicDashboardChart', { widget: result }));
                //     var element = $('[data-id=' + result['id'] + ']')
                //     var ctx = self.$('.chart_graphs').last()
                //     var options = {
                //         type: 'bar',
                //         data: {
                //             // labels: [],
                //             // datasets: [
                //             //     {
                //             //         data: [],
                //             //         borderWidth: 1
                //             //     },
                //             // ]
                //         },
                //     }
                //     var chart = new Chart(ctx, {
                //         type: "bar",
                //         data: options
                //     });
                // }
            });
        },

        //     _onClick_block_setting: function (event) {
        //         event.stopPropagation();
        //         var self = this;
        //         var id = $(event.currentTarget).closest('.block').attr('data-id');
        //         this.do_action({
        //             type: 'ir.actions.act_window',
        //             res_model: 'dashboard.block',
        //             view_mode: 'form',
        //             res_id: parseInt(id),
        //             views: [[false, 'form']],
        //             context: { 'form_view_initial_mode': 'edit' },
        //         });
        //     },

        //     _onClick_tile: function (e) {
        //         e.stopPropagation();
        //         var self = this;
        //         var id = $(e.currentTarget).attr('data-id');
        //         ajax.jsonRpc('/tile/details', 'call', {
        //             'id': id
        //         }).then(function (result) {
        //             self.do_action({
        //                 name: result['model_name'],
        //                 type: 'ir.actions.act_window',
        //                 res_model: result['model'],
        //                 view_mode: 'tree,form',
        //                 views: [[false, 'list'], [false, 'form']],
        //                 domain: result['filter']
        //             });
        //         });
        //     },

        // NEW

    });


    core.action_registry.add('custom_dashboard', Dashboard);

    return Dashboard;

});
