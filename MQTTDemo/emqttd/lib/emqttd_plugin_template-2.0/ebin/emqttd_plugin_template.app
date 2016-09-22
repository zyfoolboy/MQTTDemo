{application,emqttd_plugin_template,
             [{description,"emqttd plugin template"},
              {vsn,"2.0"},
              {modules, ['emqttd_acl_demo','emqttd_auth_demo','emqttd_cli_demo','emqttd_plugin_template','emqttd_plugin_template_app','emqttd_plugin_template_sup']},
              {registered,[]},
              {applications,[kernel,stdlib]},
              {mod,{emqttd_plugin_template_app,[]}},
              {env,[]}]}.
