{application,emqttd_auth_mysql,
             [{description,"emqttd Authentication/ACL with MySQL"},
              {vsn,"2.0"},
              {modules, ['emqttd_acl_mysql','emqttd_auth_mysql','emqttd_auth_mysql_app','emqttd_auth_mysql_client','emqttd_auth_mysql_sup']},
              {registered,[]},
              {applications,[kernel,stdlib,mysql,ecpool]},
              {mod,{emqttd_auth_mysql_app,[]}},
              {env,[]}]}.
