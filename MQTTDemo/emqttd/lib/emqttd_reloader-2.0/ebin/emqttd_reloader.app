{application,emqttd_reloader,
             [{description,"emqttd reloader"},
              {vsn,"2.0"},
              {modules, ['emqttd_reloader','emqttd_reloader_app','emqttd_reloader_cli','emqttd_reloader_sup']},
              {registered,[emqttd_reloader_sup,emqttd_reloader]},
              {applications,[kernel,stdlib,lager]},
              {mod,{emqttd_reloader_app,[]}}]}.
