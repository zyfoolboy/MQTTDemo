{application,emqttd_auth_mongo,
             [{description,"Authentication with MongoDB"},
              {vsn,"2.0"},
              {modules, ['emqttd_acl_mongo','emqttd_auth_mongo','emqttd_auth_mongo_app','emqttd_auth_mongo_sup']},
              {registered,[]},
              {applications,[kernel,stdlib,crypto,mongodb,ecpool]},
              {mod,{emqttd_auth_mongo_app,[]}},
              {env,[]}]}.
