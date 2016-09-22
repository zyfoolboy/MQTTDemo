{application,emqttd_sn,
             [{description,"MQTT-SN Gateway for The EMQTT Broker"},
              {vsn,"0.2.0"},
              {modules, ['emqttd_sn','emqttd_sn_app','emqttd_sn_gateway','emqttd_sn_gateway_sup','emqttd_sn_message','emqttd_sn_registry','emqttd_sn_sup']},
              {registered,[emqttd_sn_sup]},
              {applications,[kernel,stdlib,lager,esockd]},
              {mod,{emqttd_sn_app,[]}},
              {env,[{listener,{1884,[]}}]}]}.
