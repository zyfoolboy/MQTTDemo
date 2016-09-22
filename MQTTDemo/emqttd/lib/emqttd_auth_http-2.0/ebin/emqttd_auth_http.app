{application,emqttd_auth_http,
             [{description,"Authentication with HTTP API"},
              {vsn,"2.0"},
              {modules, ['emqttd_acl_http','emqttd_auth_http','emqttd_auth_http_app']},
              {registered,[]},
              {applications,[kernel,stdlib]},
              {mod,{emqttd_auth_http_app,[]}},
              {env,[]}]}.
