{application,emqttd_stomp,
             [{description,"Stomp Protocol Plugin for emqttd broker"},
              {vsn,"2.0"},
              {modules, ['emqttd_stomp','emqttd_stomp_app','emqttd_stomp_client','emqttd_stomp_frame','emqttd_stomp_heartbeat','emqttd_stomp_proto','emqttd_stomp_sup','emqttd_stomp_transaction']},
              {registered,[]},
              {applications,[kernel,stdlib]},
              {mod,{emqttd_stomp_app,[]}},
              {env,[]}]}.
