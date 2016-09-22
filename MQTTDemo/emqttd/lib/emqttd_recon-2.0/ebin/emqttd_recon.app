{application,emqttd_recon,
             [{description,"emqttd recon plugin"},
              {vsn,"2.0"},
              {modules, ['emqttd_recon_app','emqttd_recon_cli','emqttd_recon_gc','emqttd_recon_sup']},
              {registered,[emqttd_recon_gc]},
              {applications,[kernel,stdlib,recon]},
              {mod,{emqttd_recon_app,[]}},
              {env,[]}]}.
