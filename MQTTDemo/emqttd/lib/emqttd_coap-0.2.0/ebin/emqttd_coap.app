{application,emqttd_coap,
             [{description,"CoAP Gateway for The EMQTT Broker"},
              {vsn,"0.2.0"},
              {modules, ['emqttd_coap','emqttd_coap_app','emqttd_coap_channel','emqttd_coap_channel_sup','emqttd_coap_gateway','emqttd_coap_handler','emqttd_coap_iana','emqttd_coap_message','emqttd_coap_observer','emqttd_coap_response','emqttd_coap_server','emqttd_coap_server_handle','emqttd_coap_sup']},
              {registered,[emqttd_coap_sup]},
              {applications,[kernel,stdlib,esockd]},
              {mod,{emqttd_coap_app,[]}},
              {env,[]}]}.
