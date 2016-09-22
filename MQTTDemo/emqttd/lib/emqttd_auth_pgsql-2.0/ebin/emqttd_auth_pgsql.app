{application,emqttd_auth_pgsql,
             [{description,"emqttd Authentication against PostgreSQL"},
              {vsn,"2.0"},
              {modules, ['emqttd_acl_pgsql','emqttd_auth_pgsql','emqttd_auth_pgsql_app','emqttd_auth_pgsql_sup']},
              {registered,[]},
              {modules, ['emqttd_acl_pgsql','emqttd_auth_pgsql','emqttd_auth_pgsql_app','emqttd_auth_pgsql_sup']},
              {applications,[kernel,stdlib,epgsql,ecpool]},
              {mod,{emqttd_auth_pgsql_app,[]}},
              {env,[]}]}.
