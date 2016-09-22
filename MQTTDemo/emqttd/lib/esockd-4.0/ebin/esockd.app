{application,esockd,
             [{id,"esockd"},
              {vsn,"4.0"},
              {description,"Erlang General Non-blocking TCP/SSL Server"},
              {modules, ['esockd','esockd_acceptor','esockd_acceptor_sup','esockd_access','esockd_app','esockd_cidr','esockd_connection','esockd_connection_sup','esockd_gen','esockd_keepalive','esockd_listener','esockd_listener_sup','esockd_net','esockd_ratelimit','esockd_server','esockd_sup','esockd_transport','esockd_udp']},
              {registered,[]},
              {applications,[kernel,stdlib,gen_logger]},
              {mod,{esockd_app,[]}},
              {env,[{logger,{error_logger,info}}]}]}.
