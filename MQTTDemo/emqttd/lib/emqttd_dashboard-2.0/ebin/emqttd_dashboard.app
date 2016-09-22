{application,emqttd_dashboard,
             [{description,"emqttd web dashboard"},
              {vsn,"2.0"},
              {modules, ['emqttd_auth_dashboard','emqttd_dashboard','emqttd_dashboard_admin','emqttd_dashboard_alarm','emqttd_dashboard_app','emqttd_dashboard_cli','emqttd_dashboard_client','emqttd_dashboard_metric','emqttd_dashboard_overview','emqttd_dashboard_route','emqttd_dashboard_session','emqttd_dashboard_subscription','emqttd_dashboard_sup','emqttd_dashboard_topic','emqttd_dashboard_user','emqttd_meter_access','emqttd_meter_define']},
              {registered,[]},
              {applications,[kernel,stdlib,mnesia]},
              {mod,{emqttd_dashboard_app,[]}},
              {env,[]}]}.
