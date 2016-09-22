{application,emqttd_auth_redis,
             [{description,"emqttd authentication against Redis"},
              {vsn,"2.0"},
              {modules, ['emqttd_acl_redis','emqttd_auth_redis','emqttd_auth_redis_app','emqttd_auth_redis_client','emqttd_auth_redis_sup','emqttd_plugin_redis']},
              {registered,[]},
              {applications,[kernel,stdlib,eredis,ecpool]},
              {mod,{emqttd_auth_redis_app,[]}},
              {env,[]}]}.
